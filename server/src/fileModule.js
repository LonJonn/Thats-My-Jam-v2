const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * returns an array of all files in a directory.
   * @param dir path to directory.
   */
  readDir: function(dir) {
    return new Promise(resolve => {
      let filesClean = new Array();
      fs.readdir(path.join(__dirname, dir), (err, files) => {
        files.forEach(file => {
          if (!file.startsWith(".")) filesClean.push(file);
        });
        resolve(filesClean);
      });
    });
  },
  /**
   * Deletes file on server.
   * @param filePath path to file.
   */
  deleteFile: function(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(path.join(__dirname, "../static/files/" + filePath), err => {
        if (err) reject(err);

        resolve(filePath);
      });
    });
  }
};
