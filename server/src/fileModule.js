const fs = require('fs');
const path = require('path');

module.exports = {
    readDir: function (dir) {
        let filesClean = new Array
        fs.readdir(path.join(__dirname, dir), (err, files) => {
            files.forEach( file => {
                if (!file.startsWith('.')) filesClean.push(file)
            })
        })
        return filesClean
    }
}