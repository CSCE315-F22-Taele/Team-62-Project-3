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
        res.send("The time is : " + new Date());
    });

    app.get("/manager/summary", async function(req, res){
		let results = await db.sendQuery("SELECT SUM(total) FROM orders");
		let salesNum = results.rows[0].sum;
        res.render("manager/summary.ejs", {sales:salesNum});
    });

    app.get("/manager/orders", async function(req, res){
        // Find the 100 most recent orders
        let quantifier = "";
        if(req.query.s && req.query.e){
            quantifier = " WHERE date BETWEEN '" + req.query.s + "' AND '" + req.query.e + "'";
        }
        else if(req.query.s){
            quantifier = " WHERE date >= '" + req.query.s + "'";
        }
        else if(req.query.e){
            quantifier = " WHERE date <= '" + req.query.e + "'";
        }
        let cmd = "SELECT id, date, total FROM orders" + quantifier + " ORDER BY date DESC LIMIT 100";
        console.log(cmd);
		let results = await db.sendQuery(cmd);
        res.render("manager/orders.ejs", {orders:results.rows});

    });


    app.get("/manager/items", async function(req, res){
        let results = await db.sendQuery("SELECT id, name, quantity, units FROM item ORDER BY id ASC");
        let results2 = await db.sendQuery("SELECT id, name, price FROM productdef");
        res.render("manager/items.ejs", {items:results.rows,productdef:results2.rows});
    });

    app.get("/server", async (req, res) => {
        let items = await db.sendQuery("SELECT id, name FROM item");
		let productDefs = await db.sendQuery("SELECT id, name, optionalItemList, optionalPortionList, price FROM productdef");

        res.render("server.ejs", {items:items.rows, productDefs:productDefs.rows});
    })

    app.get("/customer", async (req, res) => {
        let items = await db.sendQuery("SELECT id, name from item");
		let productDefs = await db.sendQuery("SELECT id, name, optionalItemList, optionalPortionList, price FROM productdef");
        res.render("customer.ejs", {items:items.rows, productDefs:productDefs.rows})
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

    app.post("/order", async function(req, res){
        res.status(400);
        await db.addOrderToDatabase(req.body);
        res.send(200);
    });

};
