const config = require("../config.json");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userObj = {
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video"
    }
  ]
};

const userSchema = new mongoose.Schema(userObj);

userSchema.methods.generateAuthToken = function() {
  const JWToken = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.jwtPrivateKey
  );
  return JWToken;
};

const User = mongoose.model("User", userSchema);

exports.userObj = userObj;
exports.User = User;
