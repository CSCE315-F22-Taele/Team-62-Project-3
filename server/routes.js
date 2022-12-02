'use strict'

const { default: async } = require('async');
// Import important Node modules
const cookieParser = require('cookie-parser');
const express = require('express');
const fetch = require('node-fetch');
const session = require('express-session');

module.exports = function(app, home, db) {
	app.use(cookieParser()); // Give express the ability to read user cookies.
	app.use(express.json()); // Give express the ability to parse POST requests.
    app.use(session({secret: "Shh, its a secret!"}));
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
        if (sess.email != "") {
            //console.log("is signed in");
            let isManager = await db.sendQuery("SELECT ismanager FROM email WHERE email='" + sess.email + "'");
            if (isManager.rowCount == 0) { // if you're not in the database
                res.redirect("/nopermission");
                return;
            }
            if (!isManager.rows[0].ismanager) { // if you're in the database but not a manager
                res.redirect("/nopermission");
                return;
            }
        } else { // if you're not signed in at all
            res.redirect("/nopermission");
            return;
        }
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
        // console.log(cmd);
		let results = await db.sendQuery(cmd);
        res.render("manager/orders.ejs", {orders:results.rows});

    });


    app.get("/manager/items", async function(req, res){
        let results = await db.sendQuery("SELECT id, name, quantity, units FROM item ORDER BY id ASC");
        let results2 = await db.sendQuery("SELECT id, name, price FROM productdef");
        res.render("manager/items.ejs", {items:results.rows,productdef:results2.rows});
    });

    app.get("/server", async (req, res) => {
        //console.log("in server sign in");
        if (sess.email != "") {
            //console.log("is signed in");
            let isServer = await db.sendQuery("SELECT isserver FROM email WHERE email='" + sess.email + "'");
            if (isServer.rowCount == 0) { // if you're not in the database
                res.redirect("/nopermission");
                return;
            }
            if (!isServer.rows[0].isserver) { // if you're in the database but not a manager
                res.redirect("/nopermission");
                return;
            }
        } else { // if you're not signed in at all
            res.redirect("/nopermission");
            return;
        }
        let items = await db.sendQuery("SELECT id, name FROM item");
		let productDefs = await db.sendQuery("SELECT id, name, optionalItemList, optionalPortionList, price FROM productdef");

        res.render("server.ejs", {items:items.rows, productDefs:productDefs.rows});
    })

    app.get("/customer", async (req, res) => {
        let items = await db.sendQuery("SELECT id, name, categoryid from item");
		let productDefs = await db.sendQuery("SELECT id, name, optionalItemList, optionalPortionList, price FROM productdef");
        let categories = await db.sendQuery("SELECT id, name, description, color FROM category");

        res.render("customer.ejs", {items:items.rows, productDefs:productDefs.rows, categories:categories.rows})
        
    })

    app.get("/nopermission", (req, res) => {
        res.render("nopermission.ejs");
    });

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
    app.post("/customerOrder", async function(req, res){
        res.status(400);
        req.body.discount = 0;
        await db.addOrderToDatabase(req.body);
        res.send(200);
    });

    var sess = {};
    sess.email = "";
    app.post("/login", async function(req, res) {
        //console.log("in login");
        sess = req.session;
        //console.log(req.body);
        var token = req.body.token;
        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client("1001480195333-8c7osehemrrpbkpl72ptme7n69s8h3up.apps.googleusercontent.com");
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "1001480195333-8c7osehemrrpbkpl72ptme7n69s8h3up.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            // If request specified a G Suite domain:
            // const domain = payload['hd']
            //console.log(payload);
            //console.log(payload.email);
            sess.email = payload.email;
            //console.log(sess.email);
        }
        verify().catch(console.error);
        res.send(200);
    });
};
