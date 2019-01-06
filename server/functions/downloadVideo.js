const fs = require("fs");
const path = require("path");
const sanitise = require("sanitize-filename");
const http = require("http");
const ytdl = require("youtube-dl");

async function downloadVideo(url, client) {
  const saveDir = path.join(__dirname, "../static/files/");
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);

  const video = ytdl(url);
  return video.on("info", function(info) {
    const cleanTitle = sanitise(info.title);
    const sizeMb = (info.size / 1048576).toFixed(1);
    console.log("\x1b[35m%s\x1b[0m", "[Download Started]\n" + cleanTitle);
    console.log("Size:", sizeMb, "mb");

    let videoFile = saveDir + cleanTitle + ".mp4";
    let thumbDir = saveDir + cleanTitle + ".jpg";

    let thumbLink = info.thumbnail.replace("https", "http");
    http.get(thumbLink, res => {
      res.pipe(fs.createWriteStream(thumbDir));
    });

    video.pipe(fs.createWriteStream(videoFile));

    let downloadInfo = setInterval(function() {
      let downloadedMB = (fs.statSync(videoFile).size / 1048576).toFixed(1);
      client.emit("downloadInfo", {
        downloading: true,
        size: sizeMb,
        filename: cleanTitle,
        downloaded: downloadedMB,
        percentage: ((downloadedMB / sizeMb) * 100).toFixed(0)
      });
    }, 500);

    video.on("end", function() {
      clearInterval(downloadInfo);
      console.log("\x1b[36m%s\x1b[0m", "[Download Finished]");
      client.emit("downloadFinished");
    });
  });
}

module.exports = downloadVideo;
