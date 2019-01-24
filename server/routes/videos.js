const ytdl = require("youtube-dl");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const sanitise = require("sanitize-filename");
const joi = require("joi");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { videoObj, Video } = require("../models/videoModel");
const { User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.get("/", auth, admin, async (req, res) => {
  const videos = await Video.find().populate("_owner", [
    "-videos",
    "-password"
  ]);
  res.send(videos);
});

router.get("/:videoId", async (req, res) => {
  const foundVideo = await Video.findById(req.params.videoId).populate(
    "_owner",
    ["-videos", "-password"]
  );

  if (!foundVideo) return res.status(404).send("Video does not exist.");
  res.send(foundVideo);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateVideo(req.body);
  if (error) return res.status(400).send(_.map(error.details, "message"));

  const video = ytdl(req.body.link);

  video.on("error", () =>
    res.status(404).send(["Unable to download. Video not found"])
  );

  video.on("info", async info => {
    const metadata = setRequestData(req.body, info);
    metadata._owner = req.user._id;
    metadata.href = info.url;

    const newVideo = await new Video(
      _.pick(metadata, Object.keys(videoObj))
    ).save();

    metadata._id = newVideo._id;

    const foundUser = await User.findById(metadata._owner);
    foundUser.videos.push(newVideo._id);
    foundUser.save();

    res.send(metadata);
  });
});

router.delete("/:videoId", auth, async (req, res) => {
  let foundVideo;

  try {
    foundVideo = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(401).send("Unable to delete. Invalid video Id.");
  }

  if (!foundVideo)
    return res.status(404).send("Unable to delete. Video does not exist");

  const foundUser = await User.findById(req.user._id);
  const parsedVideos = foundUser.videos.map(id => id.toString());

  if (!parsedVideos.includes(req.params.videoId))
    return res
      .status(401)
      .send("Access denied. You don't have permission to delete this video.");

  try {
    await deleteVideo(req.params.videoId);
  } catch (error) {
    return res.status(400).send("Unable to delete video. File doesn't exist.");
  }

  foundVideo.remove();

  foundUser.videos = foundUser.videos.filter(Id => Id != req.params.videoId);
  foundUser.save();

  res.end();
});

function deleteVideo(videoId) {
  return new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(path.join(__dirname, "../static/files/", videoId + ".mp4"));
      fs.unlinkSync(path.join(__dirname, "../static/files/", videoId + ".jpg"));
      resolve();
    } catch (error) {
      reject();
    }
  });
}

function setRequestData(data, info) {
  if (!data.title) data.title = sanitise(info.title);
  if (!data.artist) data.artist = info.uploader;

  data.description = info.description;
  data.albumArt = info.thumbnail;
  data.videoId = info.display_id;
  const splitTime = info.duration.split(":");
  data.length = Number(splitTime[0]) * 60 + Number(splitTime[1]);
  data.size = Math.round((info.size / 1e6) * 1e1) / 1e1;

  return data;
}

function validateVideo(video) {
  const schema = {
    link: joi.string().required(),
    title: joi.string().max(videoObj.title.maxlength),
    artist: joi.string().max(videoObj.artist.maxlength),
    alternateAlbumArt: joi.string()
  };

  return joi.validate(video, schema, { abortEarly: false });
}

module.exports = router;
