const fs = require("fs").promises;
const write = require("fs").createWriteStream;
const path = require("path");
const fetch = require("node-fetch");

async function downloadVideo(metadata, client) {
  let { title, size, _id, albumArt, alternateAlbumArt, href } = metadata;
  if (alternateAlbumArt) albumArt = alternateAlbumArt;

  console.log("\x1b[35m%s\x1b[0m", "[Download Started]\n" + title);
  console.log("Size:", size, "mb");

  const videoDir = path.join(__dirname, "../static/files/", _id + ".mp4");
  const thumbDir = path.join(__dirname, "../static/files/", _id + ".jpg");

  (await fetch(albumArt)).body.pipe(write(thumbDir));
  const video = (await fetch(href)).body.pipe(write(videoDir));

  const downloadInfo = setInterval(async () => {
    let currentVideoSize = (await fs.stat(videoDir)).size;
    let downloaded = Math.round((currentVideoSize / 1e6) * 1e1) / 1e1;

    client.emit("downloadInfo", {
      filename: title,
      size: size,
      downloaded: downloaded,
      percentage: Math.round((downloaded / size) * 100)
    });
  }, 500);

  video.on("close", () => {
    clearInterval(downloadInfo);
    client.emit("downloadFinished");
    console.log("\x1b[36m%s\x1b[0m", "[Download Finished]");
  });
}

module.exports = downloadVideo;
