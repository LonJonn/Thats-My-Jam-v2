const fs = require('fs')
const path = require('path')

module.exports = {
  readDir: function(dir) {
    return new Promise((resolve, reject) => {
      let filesClean = new Array()
      fs.readdir(path.join(__dirname, dir), (err, files) => {
        files.forEach(file => {
          if (!file.startsWith('.')) filesClean.push(file)
        })
        resolve(filesClean)
      })
    })
  },
  deleteFile: function(file) {
    return new Promise((resolve, reject) => {
      fs.unlink(path.join(__dirname, '../static/files/' + file), err => {
        if (err) reject(err)

        resolve(file)
      })
    })
  }
}
