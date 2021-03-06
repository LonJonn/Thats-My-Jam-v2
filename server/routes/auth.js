const joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { userObj, User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

// logging in
router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body); // form validation
  if (error) return res.status(400).send(_.map(error.details, "message")); // returns an array of errors

  const foundUser = await User.findOne({ username: req.body.username });
  if (!foundUser)
    return res.status(400).send(["Invalid username or password."]);

  const validPass = await bcrypt.compare(req.body.password, foundUser.password);
  if (!validPass)
    return res.status(400).send(["Invalid username or password."]);

  const JWToken = foundUser.generateAuthToken();
  res.send(JWToken);
});

function validateLogin(info) {
  const schema = {
    username: joi
      .string()
      .min(userObj.username.minlength)
      .max(userObj.username.maxlength),
    password: joi
      .string()
      .min(userObj.password.minlength)
      .max(userObj.password.maxlength)
  };

  return joi.validate(info, schema, { abortEarly: false });
}

module.exports = router;
