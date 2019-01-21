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
    required: true,
    maxlength: 30
  },
  description: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true,
    maxlength: 30
    // default to channel name
  },
  albumArtLink: {
    type: String,
    required: true
  },
  alternateAlbumArtLink: {
    use: {
      type: Boolean,
      default: false
    },
    link: {
      type: String
    }
  },
  videoID: {
    type: String,
    required: true
  },
  length: {
    // in seconds
    type: Number,
    required: true
  }
};

const VideoSchema = new mongoose.Schema(videoObj);

const Video = mongoose.model("Video", VideoSchema); // create a model with that schema to "Video" collection

exports.videoObj = videoObj;
exports.Video = Video;
