const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const response = await readDir("../static/files");
  res.send(response);
});

router.delete("/:file", async (req, res) => {
  try {
    const file = await deleteFile(req.params.file);
    res.send("[File Deleted] " + file); // response (if I need to use on client)
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

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, "../static/files/" + filePath), err => {
      if (err) reject(err);
      resolve(filePath);
    });
  });
}

module.exports = router;
