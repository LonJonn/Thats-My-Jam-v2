const mongoose = require("mongoose");

const videoObj = {
  // https://codeburst.io/things-i-wish-i-new-before-i-started-working-with-mongodb-c089d4b593db
  // https://mongoosejs.com/docs/populate.html
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
    // default to channel name
  },
  albumArt: {
    type: String,
    required: true
  },
  alternateAlbumArt: {
    type: String
  },
  videoId: {
    type: String,
    required: true
  },
  length: {
    // in seconds
    type: Number,
    required: true
  },
  size: {
    // in mb
    type: Number,
    required: true
  },
  href: {
    type: String,
    required: true
  }
};

const videoSchema = new mongoose.Schema(videoObj);

const Video = mongoose.model("Video", videoSchema); // create a model with that schema to "Video" collection

exports.videoObj = videoObj;
exports.Video = Video;
