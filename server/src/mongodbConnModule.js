var mongoose = require('mongoose');

module.exports.connect = function() {	//export connect function for app.js
	mongoose.connect('mongodb://localhost:27017/notes');	//connect to db
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){	//once connected successfully
	  console.log("Database Connection Succeeded");
	});
}