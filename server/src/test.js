const fs = require("fs");
const path = require("path");

let dir = "../static/files";

function logDir() {
  return new Promise(resolve => {
    let filesClean = new Array();
    fs.readdir(path.join(__dirname, dir), (err, files) => {
      files.forEach(file => {
        if (!file.startsWith(".")) filesClean.push(file);
      });
      resolve(filesClean);
    });
  });
}

async function test() {
  let clean = new Array();
  fs.readdirSync(path.join(__dirname, dir)).forEach(file => {
    if (!file.startsWith(".")) clean.push(file);
  });
  return clean;
}

async function init1() {
  let x = await logDir();
  console.log(x);
}

async function init2() {
  let x = await test();
  console.log(x);
}
