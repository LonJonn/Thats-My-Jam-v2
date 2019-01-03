const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const response = await readDir("../static/files");
  res.send(response);
});

router.delete("/:file", (req, res) => {
  try {
    fs.unlinkSync(path.join(__dirname, "../static/files/" + req.params.file));
    res.send("[File Deleted] " + req.params.file);
  } catch (error) {
    res.status(404).send("File not found!\nNo file deleted.");
  }
});

function readDir(dir) {
  return new Promise(resolve => {
    let filesClean = new Array();
    fs.readdir(path.join(__dirname, dir), (err, files) => {
      files.forEach(file => {
        if (!file.startsWith(".")) filesClean.push(file);
      });
      resolve(filesClean);
    });
  });
}

module.exports = router;
