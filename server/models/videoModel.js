var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VideoSchema = new Schema({
  // create new schema for database document
  title: String,
  description: String,
  artist: String, // channel if default
  albumArtLink: String,
  alternateArtLink: { use: Boolean, link: String },
  videoID: String,
  length: Number // in seconds
});

var Video = mongoose.model("Video", VideoSchema); // create a model with that schema to "Video" collection
module.exports = Video; // export the model
