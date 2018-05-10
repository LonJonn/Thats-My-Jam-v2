const fs = require('fs');
const path = require('path');

module.exports = {
    readDir: function (dir) {
        fs.readdir(path.join(__dirname, dir), (err, files) => {
            let filesClean = new Array
            files.forEach( file => {
                if (!file.startsWith('.')) filesClean.push(file)
            })
            console.log(filesClean);
            
            return filesClean
        })
    }
}