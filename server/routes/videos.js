const ytdl = require("youtube-dl");
const _ = require("lodash");
const joi = require("joi");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { videoObj, Video } = require("../models/videoModel");
const { User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.post("/check", async (req, res) => {
  const result = await checkLink(req.body.link);
  res.send(result);
});

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

  req.body._owner = req.user._id;

  const newVideo = await new Video(
    _.pick(req.body, [
      "_owner",
      "title",
      "description",
      "artist",
      "albumArtLink",
      "alternateAlbumArtLink",
      "videoId",
      "length"
    ])
  ).save();

  const foundUser = await User.findById(req.body._owner);
  foundUser.videos.push(newVideo._id);
  await foundUser.save();

  res.send(newVideo);
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

  foundVideo.remove();

  foundUser.videos = foundUser.videos.filter(Id => Id != req.params.videoId);
  foundUser.save();

  res.end();
});

function checkLink(url) {
  return new Promise(resolve => {
    ytdl.getInfo(url, error => {
      if (error) resolve(false);
      resolve(true);
    });
  });
}

function validateVideo(video) {
  const schema = {
    title: joi
      .string()
      .max(videoObj.title.maxlength)
      .required(),
    description: joi.string().required(),
    artist: joi
      .string()
      .max(videoObj.artist.maxlength)
      .required(),
    albumArtLink: joi.string().required(),
    alternateAlbumArtLink: joi.object(),
    videoId: joi.string().required(),
    length: joi.number().required()
  };

  return joi.validate(video, schema, { abortEarly: false });
}

module.exports = router;
