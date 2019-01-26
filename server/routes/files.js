const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  fs.readdir(path.join(__dirname, "../static/files"), (err, files) => {
    res.send(files.filter(file => !file.startsWith(".")));
  });
});

router.delete("/:file", (req, res) => {
  try {
    fs.unlinkSync(path.join(__dirname, "../static/files/" + req.params.file));
  } catch (error) {
    res.status(404).send("File not found!\nNo file deleted.");
  }

  res.send("File deleted.");
});

module.exports = router;
