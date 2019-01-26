const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const response = await readDir(path.join(__dirname, "../static/files"));
  res.send(response);
});

router.delete("/:file", (req, res) => {
  try {
    fs.unlinkSync(path.join(__dirname, "../static/files/" + req.params.file));
    res.send("File deleted.");
  } catch (error) {
    res.status(404).send("File not found!\nNo file deleted.");
  }
});

function readDir(dir) {
  return new Promise(resolve => {
    fs.readdir(dir, (error, files) => {
      resolve(files.filter(file => !file.startsWith(".")));
    });
  });
}

module.exports = router;
