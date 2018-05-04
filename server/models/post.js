var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({ //create new schema for database document
  title: String,
  description: String
});

var Post = mongoose.model("Post", PostSchema);  //create a model with that schema
module.exports = Post;  //export the model
