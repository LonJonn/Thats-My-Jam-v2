const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const morgan = require('morgan')
const path = require("path");
const socket = require("socket.io");

const app = express();
// app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../static")));

const server = app.listen(process.env.PORT || 8081);
const io = socket(server);

const mongodb_conn_module = require("./mongodbConnModule"); //import the mongodb connection function
mongodb_conn_module.connect(); //connect to mongo database

// --------------------Socket--------------------
io.on("connection", function(client) {
  console.log("User connected:", client.id);
  client.on("disconnect", () => {
    console.log("User disconnected:", client.id);
  });

  client.on("startVideoDownload", function(link) {
    jamifyModule.downloadVideo(link, client);
  });
});
// ------------------End Socket------------------

const fileModule = require("./fileModule");
const jamifyModule = require("./jamifyModule");

// ---------------------Files--------------------
app.get("/api/get_files", async (req, res) => {
  const response = await fileModule.readDir("../static/files");
  res.send(response);
});

app.delete("/api/delete_file/:file", async (req, res) => {
  try {
    const file = await fileModule.deleteFile(req.params.file);
    console.log("[File Deleted]", file); // log deleted file on server
    res.send("[File Deleted] " + file); // response (if I need to use on client)
    io.emit("getFiles");
  } catch (error) {
    console.error(error); // if error, log error
    res.status(404).send("File not found!\nNo file deleted.");
  }
});
// ------------------End Files-------------------

// -------------------Jammify--------------------
app.post("/api/check_link", async (req, res) => {
  const result = await jamifyModule.checkLink(req.body.link);
  res.send(result);
});
// -----------------End Jammify------------------
