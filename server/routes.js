'use strict'

const { default: async } = require('async');
// Import important Node modules
const cookieParser = require('cookie-parser');
const express = require('express');
const fetch = require('node-fetch');

module.exports = function(app, home, db) {
	app.use(cookieParser()); // Give express the ability to read user cookies.
	app.use(express.json()); // Give express the ability to parse POST requests.
    app.set('view engine', 'ejs');

    app.use(function(req, res, next) {
	    // Completely disable caching.
		res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next();
	});

    app.get("/", function(req, res){
        res.render("index.ejs");
    });

    /* BEGIN GET REQUESTS */
    app.get("/time", function(req, res){
        // Simple GET request: return the current time.
        var d = new Date();
        res.send("The time is : " + d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
    });

    app.get("/manager/summary", async function(req, res){
		let results = await db.sendQuery("SELECT SUM(total) FROM orders");
		let salesNum = results.rows[0].sum;
        res.render("manager/summary.ejs", {sales:salesNum});
    });

    
    
    app.get("/manager/orders", async function(req, res){
        // Find the 100 most recent orders
        if(Object.keys(req.body).length === 0){
        var d = new Date();
        var cur = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
		let results = await db.sendQuery("SELECT total, date from orders where (date >= '"+cur+"' AND date <= '" + cur + "')");
        res.render("manager/orders.ejs", {orders:results.rows});
        }
        else{
            let results = await db.sendQuery("SELECT total, date from orders where (date >= '"+req.body.low+"' AND date <= '" + req.body.high + "')");
        res.render("manager/orders.ejs", {orders:results.rows});
        }
    });


    app.get("/manager/items", async function(req, res){
        let results = await db.sendQuery("SELECT id, name, quantity, units FROM item ORDER BY id ASC");
        let results2 = await db.sendQuery("SELECT id, name, price FROM productdef");
        res.render("manager/items.ejs", {items:results.rows,productdef:results2.rows});
    });

    app.get("/manager/server", async (req, res) => {
        // let results = await db.sendQuery()
        res.render("manager/server.ejs")
    })

    app.post("/item", async function(req, res){
        res.status(400);
        let id = req.body.id;
        let amount = parseFloat(req.body.amount);
        if(isNaN(amount)){
            return res.send("Invalid amount.");
        }
        let results = await db.sendQuery("UPDATE item SET quantity = quantity+" + amount + " WHERE id = " + id + " RETURNING quantity");
        res.status(200);
        res.send("" + results.rows[0].quantity);
    });

    app.get("/manager/dateorders", async function(req, res){
        if(Object.keys(req.body).length > 0){
        let results = await db.sendQuery("SELECT total, date from orders where (date >= '"+"2022-9-1"+"' AND date <= '" + "2022-9-3" + "')");
        var ans = "";
        
        
        for(let order of results.rows) {
            ans+=(order.total + " " + order.date +"\n");
    
        }
        res.send(ans);
    }
});

};
