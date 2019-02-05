const fs = require("fs").promises;
const path = require("path");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const files = await fs.readdir(path.join(__dirname, "../static/files"));
  res.send(files.filter(file => !file.startsWith(".")));
});

router.delete("/:file", auth, async (req, res) => {
  try {
    await fs.unlink(path.join(__dirname, "../static/files/" + req.params.file));
  } catch (error) {
    res.status(404).send({ msg: "File not found!", info: "No file deleted." });
  }

  res.send("File deleted.");
});

module.exports = router;
