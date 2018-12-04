const fs = require("fs");
const path = require("path");
const ytdl = require("youtube-dl");
const sanitise = require("sanitize-filename");
const http = require("http");

module.exports = {
  /**
   * Downloads video from URL: returns video information.
   * @param url link to video.
   */
  download: function(url) {
    console.log(url);
    return new Promise(resolve => {
      downloaded = sizeMb = percentage = 0;
      let thumbSaveDir = path.join(__dirname, "../static/files/");
      let videoSaveDir = path.join(__dirname, "../static/files/");
      [thumbSaveDir, videoSaveDir].forEach(n => {
        if (!fs.existsSync(n)) fs.mkdirSync(n);
      });

      let video = ytdl(url);

      video.on("info", function(info) {
        cleanTitle = sanitise(info.title);
        console.log("\x1b[35m%s\x1b[0m", "[Download Started]\n" + cleanTitle);
        sizeMb = (info.size / 1048576).toFixed(1);
        console.log("Size:", sizeMb, "mb");

        let videoFile = videoSaveDir + cleanTitle + ".mp4";

        let oldThumbDir = thumbSaveDir + "temp.jpg";
        let newThumbDir = thumbSaveDir + cleanTitle + ".jpg";

        let thumbLink = info.thumbnail.replace("https", "http");
        http.get(thumbLink, res => {
          res
            .pipe(fs.createWriteStream("static/files/temp.jpg"))
            .on("finish", () => {
              fs.renameSync(oldThumbDir, newThumbDir);
              console.log("Thumbnail downloaded.");
            });
        });

        video.pipe(fs.createWriteStream(videoFile));
        downloading = true;

        let downloadInfo = setInterval(function() {
          downloaded = (fs.statSync(videoFile).size / 1048576).toFixed(1);
          percentage = (downloaded / sizeMb * 100).toFixed(0);
        }, 500);

        video.on("end", function() {
          clearInterval(downloadInfo);
          console.log("\x1b[36m%s\x1b[0m", "[Download Finished]");
          downloading = false;
          resolve({ video: "info" }); // to add to database
        });
      });
    });
  },
  /**
   * Returns current download information.
   */
  downloadInfo: function() {
    try {
      if (downloading) {
        return {
          filename: cleanTitle,
          percentage: percentage.toString(),
          downloaded: downloaded.toString(),
          size: sizeMb.toString(),
          downloading: true
        };
      } else {
        return { downloading: false };
      }
    } catch (error) {
      return { downloading: false };
    }
  },
  /**
   * Checks a url for valid video.
   * returns wether the link was valid and id of video
   * @param url link of video.
   */
  checkLink: function(url) {
    return new Promise((resolve, reject) => {
      ytdl.getInfo(url, (err, info) => {
        if (err) {
          reject({ validLink: false });
        } else {
          resolve({
            validLink: true,
            id: info.id
          });
        }
      });
    });
  }
};
