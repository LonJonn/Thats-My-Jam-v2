const fs = require('fs');
const path = require('path');

module.exports = {
    readDir: function (dir) {
        let filesClean = new Array
        fs.readdirSync(path.join(__dirname, dir)).forEach( file => {
            if (!file.startsWith('.')) filesClean.push(file)
        })
        return filesClean
    }
}

// MAKE IT ASYNC!!!
// readDir: function (dir) {
//     let filesClean = new Array
//     fs.readdir(path.join(__dirname, dir), (err, files) => {
//         files.forEach( file => {
//             if (!file.startsWith('.')) filesClean.push(file)
//         })
//     })
//     return filesClean
// }