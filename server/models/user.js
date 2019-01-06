const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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
  }
};

const userSchema = new mongoose.Schema(userObj);

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(userObj.username.minlength)
      .max(userObj.username.maxlength)
      .required(),
    email: Joi.string()
      .min(userObj.email.minlength)
      .max(userObj.email.maxlength)
      .required()
      .email(),
    password: Joi.string()
      .min(userObj.password.minlength)
      .max(userObj.password.maxlength)
      .required(),
    isAdmin: Joi.bool().required()
  };

  return Joi.validate(user, schema);
}

exports.userObj = userObj;
exports.User = User;
exports.validate = validateUser;
