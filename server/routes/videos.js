const ytdl = require("youtube-dl");
const _ = require("lodash");
const { Video } = require("../models/videoModel");
const { User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.post("/check", async (req, res) => {
  const result = await checkLink(req.body.link);
  res.send(result);
});

router.post("/", async (req, res) => {
  const newVideo = new Video(
    _.pick(req.body, [
      "_owner",
      "title",
      "description",
      "artist",
      "albumArtLink",
      "videoID",
      "length"
    ])
  );

  await newVideo.save();

  const foundUser = await User.findOne({ _id: req.body._owner });
  foundUser.videos.push(newVideo._id);

  await foundUser.save();

  res.send("Video Added.");
});

router.post("/findUser", async (req, res) => {
  const foundUser = await User.findOne({
    username: req.body.username
  }).populate("videos", "-_owner"); // populate without owner
  res.send(foundUser);
});

router.post("/findVideo", async (req, res) => {
  const foundVideo = await Video.findOne({
    title: req.body.title
  }).populate("_owner", ["-videos", "-password"]);
  res.send(foundVideo);
});

function checkLink(url) {
  return new Promise(resolve => {
    ytdl.getInfo(url, error => {
      if (error) resolve(false);
      resolve(true);
    });
  });
}

module.exports = router;
