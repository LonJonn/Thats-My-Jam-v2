/*jshint esversion: 6 */

const fs = require('fs');
const path = require('path');
const ytdl = require('youtube-dl');
const sanitise = require('sanitize-filename');
const http = require('http');

module.exports = {
    download: function (link) {
        downloading = false;
        downloaded = toDownload = percentage = 0;
        let url = link;
        let thumbSaveDir = path.join(__dirname, '../static/files/');
        let videoSaveDir = path.join(__dirname, '../static/files/');
        [thumbSaveDir, videoSaveDir].forEach((n) => {
            if (!fs.existsSync(n)) fs.mkdirSync(n);
        })

        let jam = ytdl(url);

        jam.on('info', function (info) {
            cleanTitle = sanitise(info.title);
            console.log('\nDownload started:', cleanTitle);
            let sizeMb = info.size / 1048576;
            console.log('Size:', sizeMb.toFixed(2), 'mb');

            let videoFile = videoSaveDir + cleanTitle + '.mp4';

            let oldDir = thumbSaveDir + 'temp.jpg';
            let newDir = thumbSaveDir + cleanTitle + '.jpg';

            let thumbLink = info.thumbnail.replace('https', 'http');
            var request = http.get(thumbLink, (res) => {
                res.pipe(fs.createWriteStream('static/files/temp.jpg')).on('finish', () => {
                    fs.renameSync(oldDir, newDir);
                    console.log('Thumbnail downloaded.');
                })
            })

            jam.pipe(fs.createWriteStream(videoFile));
            downloading = true;

            let downloadInfo = setInterval(function () {
                downloaded = (fs.statSync(videoFile).size / 1048576).toFixed(0);
                toDownload = ((info.size - fs.statSync(videoFile).size) / 1048576).toFixed(0);
                percentage = ((downloaded / sizeMb) * 100).toFixed(0);
                console.log('To download:', toDownload, 'mb -', percentage + '% complete');
            }, 500);

            jam.on('end', function () {
                clearInterval(downloadInfo);
                console.log('Download Finished!');
                downloading = false;
            });
        });
    },
    downloadInfo: function () {
        try {
            if (downloading) {
                return {
                    filename: cleanTitle,
                    percentage: percentage.toString(),
                    downloaded: downloaded.toString(),
                    toDownload: toDownload.toString(),
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
