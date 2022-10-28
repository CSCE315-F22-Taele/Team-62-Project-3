'use strict'

// Import important Node modules
const cookieParser = require('cookie-parser');
const express = require('express');
const fetch = require('node-fetch');

module.exports = function(app, home, db) {
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
    });
    
    app.get("/sales", async function(req, res){
		let results = await db.sendQuery("SELECT SUM(total) FROM orders");
		res.send("Total Sales in database: $" + results.rows[0].sum);
    });
};