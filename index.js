require('dotenv').config();

var express = require('express');
var path = require("path")
var app = express();
var server = require('http').createServer(app);
var home = __dirname + "/public/";

if (process.env.DEVMODE) {
    // Dev mode assumes there is no reverse proxy, so node must serve static files itself.
    console.log("Server running in developer mode.");
	app.use(express.static('public'));
}

// Define routes for the express app
require('./server/routes.js')(app, home);
console.log("routes have been defined...");

server.listen(process.env.PORT);
console.log("Listening on port " + process.env.PORT);