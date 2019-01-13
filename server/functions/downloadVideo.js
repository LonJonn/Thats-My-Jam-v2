const fs = require("fs");
const path = require("path");
const sanitise = require("sanitize-filename");
const http = require("http");
const ytdl = require("youtube-dl");

async function downloadVideo(url, client) {
  const saveDir = path.join(__dirname, "../static/files/");

  const video = ytdl(url);
  video.on("info", info => {
    const cleanTitle = sanitise(info.title);
    const sizeMb = Math.round((info.size / 1e6) * 1e1) / 1e1;
    console.log("\x1b[35m%s\x1b[0m", "[Download Started]\n" + cleanTitle);
    console.log("Size:", sizeMb, "mb");

    const videoDir = saveDir + cleanTitle + ".mp4";
    const thumbDir = saveDir + cleanTitle + ".jpg";

    const thumbLink = info.thumbnail.replace("https", "http");
    http.get(thumbLink, res => {
      res.pipe(fs.createWriteStream(thumbDir));
    });

    video.pipe(fs.createWriteStream(videoDir));

    const downloadInfo = setInterval(() => {
      let currentVideoSize = fs.statSync(videoDir).size;
      let downloadedMB = Math.round((currentVideoSize / 1e6) * 1e1) / 1e1;

      client.emit("downloadInfo", {
        filename: cleanTitle,
        size: sizeMb,
        downloaded: downloadedMB,
        percentage: Math.round((downloadedMB / sizeMb) * 100)
      });
    }, 500);

    video.on("end", () => {
      clearInterval(downloadInfo);
      client.emit("downloadFinished");
      console.log("\x1b[36m%s\x1b[0m", "[Download Finished]");
    });
  });
}

module.exports = downloadVideo;
