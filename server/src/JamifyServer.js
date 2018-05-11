/*jshint esversion: 6 */

const fs = require('fs');
const path = require('path');
const ytdl = require('youtube-dl');
const sanitise = require('sanitize-filename');
const http = require('http');

module.exports = {
    download: function (url) {
        return new Promise((resolve, reject) => {
            downloaded = sizeMb = percentage = 0;
            let thumbSaveDir = path.join(__dirname, '../static/files/');
            let videoSaveDir = path.join(__dirname, '../static/files/');
            [thumbSaveDir, videoSaveDir].forEach((n) => {
                if (!fs.existsSync(n)) fs.mkdirSync(n);
            })
            
            let jam = ytdl(url);
    
            jam.on('info', function (info) {
                
                cleanTitle = sanitise(info.title);
                console.log('\x1b[35m%s\x1b[0m', '\n[Download Started]\n' + cleanTitle);
                sizeMb = (info.size / 1048576).toFixed(1);
                console.log('Size:', sizeMb, 'mb');
    
                let videoFile = videoSaveDir + cleanTitle + '.mp4';
    
                let oldDir = thumbSaveDir + 'temp.jpg';
                let newDir = thumbSaveDir + cleanTitle + '.jpg';
    
                let thumbLink = info.thumbnail.replace('https', 'http');
                http.get(thumbLink, (res) => {
                    res.pipe(fs.createWriteStream('static/files/temp.jpg')).on('finish', () => {
                        fs.renameSync(oldDir, newDir);
                        console.log('Thumbnail downloaded.');
                    })
                })
    
                jam.pipe(fs.createWriteStream(videoFile));
                downloading = true;
    
                let downloadInfo = setInterval(function () {
                    downloaded = (fs.statSync(videoFile).size / 1048576).toFixed(1);
                    percentage = ((downloaded / sizeMb) * 100).toFixed(0);
                }, 250);
    
                jam.on('end', function () {
                    clearInterval(downloadInfo);
                    console.log('\x1b[36m%s\x1b[0m', '[Download Finished]');
                    downloading = false;
                    resolve('note: pass back video info')   // to add to database
                });
            });
        })
    },
    downloadInfo: function () {
        try {
            if (downloading) {
                return {
                    filename: cleanTitle,
                    percentage: percentage.toString(),
                    downloaded: downloaded.toString(),
                    size: sizeMb.toString(),
                    downloading: downloading
                }
            } else {
                return { downloading: downloading }
            }
        } catch (error) {
            return { downloading: false }
        }
    }
}