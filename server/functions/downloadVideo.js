const fs = require("fs");
const path = require("path");
const request = require("request");

async function downloadVideo(metadata, client) {
  const saveDir = path.join(__dirname, "../static/files/");
  let { title, size, _id, albumArt, alternateAlbumArt, href } = metadata;
  if (alternateAlbumArt) albumArt = alternateAlbumArt;

  console.log("\x1b[35m%s\x1b[0m", "[Download Started]\n" + title);
  console.log("Size:", size, "mb");

  const videoDir = saveDir + _id + ".mp4";
  const thumbDir = saveDir + _id + ".jpg";

  request(albumArt).pipe(fs.createWriteStream(thumbDir));
  const video = request(href).pipe(fs.createWriteStream(videoDir));

  const downloadInfo = setInterval(() => {
    let currentVideoSize = fs.statSync(videoDir).size;
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
