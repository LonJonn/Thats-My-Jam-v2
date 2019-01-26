const jwt = require("jsonwebtoken");
const config = require("../config.json");

module.exports = function(req, res, next) {
  const JWToken = req.header("x-auth-token");
  if (!JWToken) return res.status(401).send("Access Denied. No auth token.");

  try {
    const decodedInfo = jwt.verify(JWToken, config.jwtPrivateKey);
    req.user = decodedInfo;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
