const fs = require("fs");
const path = require("path");
const ytdl = require("youtube-dl");
const sanitise = require("sanitize-filename");
const http = require("http");

module.exports = {
  /**
   * Checks a url for valid video.
   * returns wether the link was valid and id of video
   * @param url link of video.
   */
  checkLink: function(url) {
    return new Promise(resolve => {
      ytdl.getInfo(url, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
};
