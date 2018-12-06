const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const morgan = require('morgan')
const path = require("path");

const app = express();
// app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../static")));

const mongodb_conn_module = require("./mongodbConnModule"); //import the mongodb connection function
mongodb_conn_module.connect(); //connect to mongo database

const fileModule = require("./fileModule");

app.get("/get_files", async (req, res) => {
  let response = await fileModule.readDir("../static/files");
  res.send(response);
});

app.listen(process.env.PORT || 8081);
