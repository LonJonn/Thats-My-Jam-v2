const ytdl = require("youtube-dl");
const path = require("path");
const fs = require("fs").promises;
const _ = require("lodash");
const sanitise = require("sanitize-filename");
const joi = require("joi");
const fetch = require("node-fetch");
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

router.get("/:videoId", auth, async (req, res) => {
  let foundVideo;

  try {
    foundVideo = await Video.findById(req.params.videoId).populate("_owner", [
      "-videos",
      "-password"
    ]);
  } catch (error) {
    return res.status(400).send("Invalid video id.");
  }

  if (!foundVideo) return res.status(404).send("Video does not exist.");

  const owner = await checkOwner(req);
  if (!owner)
    return res
      .status(401)
      .send("Access denied. You don't have permission to view this data.");

  res.send(foundVideo);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateVideoPost(req.body);
  if (error)
    return res
      .status(400)
      .send({ msg: "Download Failed.", info: error.details[0].message });

  if (!req.body.link.includes("youtu"))
    return res
      .status(400)
      .send({ msg: "Download Failed.", info: "Not a youtube video." });

  if (req.body.altAlbumArt) {
    try {
      const link = await fetch(req.body.altAlbumArt);
      if (!link.headers.get("content-type").startsWith("image"))
        return res.status(400).send({
          msg: "Download Failed.",
          info: "Provided album art is not an image."
        });
    } catch (error) {
      console.error("\x1b[31m", "ALT IMAGE ERROR:", error.message);
      return res.status(400).send({
        msg: "Download Failed.",
        info: "Provided album art link is invalid."
      });
    }
  }

  const video = ytdl(req.body.link);

  video.on("error", error => {
    console.error("\x1b[31m", "YTDL ERROR:", error.message);
    res.status(404).send({
      msg: "Download Failed.",
      info: "Invalid link or video not found."
    });
  });

  video.on("info", async info => {
    const metadata = setRequestData(req.body, info);
    metadata._owner = req.user._id;

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
  const videoId = req.params.videoId;
  let foundVideo;
  let owner;

  if (req.query.forced) {
    foundVideo = await Video.findById(videoId);
    owner = await checkOwner(req);
    return res.end(removeVideoData(req, foundVideo, owner));
  }

  try {
    foundVideo = await Video.findById(videoId);
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Unable to delete.", info: "Invalid video ID." });
  }

  if (!foundVideo)
    return res.status(404).send({
      msg: "Unable to delete.",
      info: "Video does not exist on databsae"
    });

  owner = await checkOwner(req);
  if (!owner)
    return res.status(401).send({
      msg: "Access denied.",
      info: "You don't have permission to delete this video."
    });

  try {
    await Promise.all([
      fs.unlink(path.join(__dirname, "../static/files/", videoId + ".mp4")),
      fs.unlink(path.join(__dirname, "../static/files/", videoId + ".jpg"))
    ]);
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Unable to delete.", info: "Files missing on server." });
  }

  removeVideoData(req, foundVideo, owner);

  res.send("Video deleted.");
});

router.put("/:videoId", auth, async (req, res) => {
  let foundVideo;

  const { error } = validateVideoPut(req.body);
  if (error) return res.status(400).send(_.map(error.details, "message"));

  try {
    foundVideo = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(400).send("Unable to edit. Invalid video id.");
  }

  if (!foundVideo)
    return res.status(404).send("Unable to edit. Video does not exist");

  const owner = await checkOwner(req);
  if (!owner)
    return res
      .status(401)
      .send("Access denied. You don't have permission to edit this video.");

  foundVideo.set(req.body);
  foundVideo.save();

  res.send(foundVideo);
});

function setRequestData(data, info) {
  if (!data.title) data.title = sanitise(info.title);
  if (!data.artist) data.artist = info.uploader;

  data.description = info.description;
  data.albumArt = info.thumbnail;
  data.videoId = info.display_id;
  data.length = info._duration_raw;
  data.size = Math.round((info.size / 1e6) * 1e1) / 1e1;
  data.href = info.url;

  return data;
}

async function checkOwner(req) {
  const foundUser = await User.findById(req.user._id);
  const parsedVideos = foundUser.videos.map(id => id.toString());

  if (parsedVideos.includes(req.params.videoId) || req.user.isAdmin)
    return foundUser;

  return null;
}

function removeVideoData(req, video, user) {
  video.remove();

  user.videos = user.videos.filter(Id => Id != req.params.videoId);
  user.save();
}

function validateVideoPost(videoParams) {
  const schema = {
    link: joi.string().required(),
    title: joi.string(),
    artist: joi.string(),
    altAlbumArt: joi.string()
  };

  return joi.validate(videoParams, schema);
}

function validateVideoPut(videoParams) {
  const schema = {
    title: joi.string(),
    artist: joi.string()
  };

  return joi.validate(videoParams, schema, { abortEarly: false });
}

module.exports = router;
