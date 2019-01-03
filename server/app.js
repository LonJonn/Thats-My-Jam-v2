const config = require("config");
const mongoose = require("mongoose");
const socket = require("socket.io");
const files = require("./routes/files");
const videos = require("./routes/videos");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPriavteKey is not defined.");
  process.exit(1);
}

mongoose.set("useNewUrlParser", true).set("useCreateIndex", true);
mongoose
  .connect("mongodb://localhost/ThatsMyJam")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.error("Could not connect to MongoDB"));

app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use("/api/videos", videos.router);
app.use("/api/files", files);
app.use("/api/users", users);
app.use("/api/auth", auth);

const server = app.listen(process.env.PORT || 8081);
const io = socket(server);

// --------------------Socket--------------------
io.on("connection", function(client) {
  console.log("User connected:", client.id);
  client.on("disconnect", () => {
    console.log("User disconnected:", client.id);
  });

  client.on("startVideoDownload", function(link) {
    videos.download(link, client);
  });
});
// ------------------End Socket------------------
