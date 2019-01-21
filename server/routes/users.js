const joi = require("joi");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { userObj, User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const foundUser = await User.findById(req.user._id).select([
    "-password",
    "-videos"
  ]);
  if (foundUser) return res.send(foundUser);
  res.status(404).send("User doesn't exist.");
});

router.post("/usernameAvailable", async (req, res) => {
  const foundUser = await User.findOne({ username: req.body.username });
  if (foundUser) return res.send(false);
  res.send(true);
});

router.post("/", async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(_.map(error.details, "message"));

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) return res.status(400).send("User already registered.");

  foundUser = await User.findOne({ username: req.body.username });
  if (foundUser) return res.status(400).send("Username already taken.");

  let newUser = new User(
    _.pick(req.body, ["username", "email", "password", "isAdmin"])
  );
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save();

  const JWToken = newUser.generateAuthToken();
  res
    .header("x-auth-token", JWToken)
    .send(_.pick(newUser, ["_id", "username", "email", "isAdmin"]));
});

function validateRegister(user) {
  const schema = {
    username: joi
      .string()
      .min(userObj.username.minlength)
      .max(userObj.username.maxlength)
      .required(),
    email: joi
      .string()
      .min(userObj.email.minlength)
      .max(userObj.email.maxlength)
      .required()
      .email(),
    password: joi
      .string()
      .min(userObj.password.minlength)
      .max(userObj.password.maxlength)
      .required(),
    isAdmin: joi.bool().required()
  };

  return joi.validate(user, schema, { abortEarly: false });
}

module.exports = router;
