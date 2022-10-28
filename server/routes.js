'use strict'

// Import important Node modules
const cookieParser = require('cookie-parser');
const express = require('express');
const async = require('async');
const fetch = require('node-fetch');

module.exports = function(app, home) {
	app.use(cookieParser()); // Give express the ability to read user cookies.
	app.use(express.json()); // Give express the ability to parse POST requests.
	app.use(function(req, res, next) {
	    // Completely disable caching.
		res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next();
	});

    /* BEGIN GET REQUESTS */
    app.get("/time", function(req, res){
        // Simple GET request: return the current time.
        res.send("The time is : " + new Date());
    })
};