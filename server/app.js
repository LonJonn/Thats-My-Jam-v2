const config = require("config");
const mongoose = require("mongoose");
const socket = require("socket.io");
const downloadVideo = require("./functions/downloadVideo");
const filesRoute = require("./routes/files");
const videosRoute = require("./routes/videos");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPriavteKey is not defined.");
  process.exit(1);
}

mongoose.set("useNewUrlParser", true).set("useCreateIndex", true);
mongoose
  .connect(
    "mongodb+srv://LonJonn:LonMongoDB181@jammify-mfcaa.gcp.mongodb.net/Jammify?retryWrites=true"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use("/api/videos", videosRoute);
app.use("/api/files", filesRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

const server = app.listen(process.env.PORT || 8081);
const io = socket(server, {
  pingTimeout: 60000 // socket 2.2.0 timeout is off
});

// --------------------Socket--------------------
io.on("connection", function(client) {
  console.log("User connected:", client.id);
  client.on("disconnect", () => {
    console.log("User disconnected:", client.id);
  });

  client.on("startVideoDownload", function(link) {
    downloadVideo(link, client);
  });
});
// ------------------End Socket------------------
