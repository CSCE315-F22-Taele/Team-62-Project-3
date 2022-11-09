'use strict'
const {Client} = require('pg');
const async = require('async');

class dbConnection{
    #client;
    constructor(){
        this.#client = new Client();
    }
    async connect(){
        await this.#client.connect();
    }
    async sendQuery(cmd){
        return await this.#client.query(cmd);
    }
    async addOrderToDatabase(order){
        console.log("hello world")
        /**
        order: {
            discount: Number,
            productList:[{
                id:Number,
                selectedItems:[Number]
            }]
        }
        */
       orderId = this.findNewId("orders");
       for (product of order.productList) {
            let productDef = await db.sendQuery("SELECT id, name, price FROM productdef WHERE id=" + product.id);
            let cmd = "";
            id = await this.findNewId("products");
            cmd += id + ", ";
            cmd += "'" + productDef.name + "', ";
            cmd += (productDef.price + ", ");
            let itemlist = productDef.baseitemlist.concat(product.selectedItem);
            cmd += "'" + Array.toString(itemlist).replace("[", "{").replace("]", "}") + "', ";
            selectedItemPortions = [];
            for (let item of product.selectedItems) {
                let i = productDef.optionalitemlist.indexof(item);
                let size = productDef.optionalportionlist[i];
                selectedItemPortions.push(size);
            }
            let portionlist = productDef.baseportionlist.concat(selectedItemPortions);
            cmd += "'" + Array.toString(portionlist).replace("[", "{").replace("]", "}") + "', ";
            cmd += "'" + this.getSQLDate() + "',";
            cmd += orderId;
            let full = "INSERT INTO products VALUES (" + cmd + ")";
            this.sendQuery(full);
       }


    //    cmd = "";
    //    cmd += toString(order.productList).replace("[", "{").replace("]", "}") + "', ";
    //    cmd += order.discount + ", ";
    //    cmd += order.subtotal + ", ";
    //    cmd += order.total + ", ";
    //    cmd += "'" + order.date + "'";
    //    full = "INSERT INTO orders VALUES (" + cmd + ")";
    //    this.sendQuery(full);
    }
    async findNewId(table){
        // Returns the ID of the new product when done.
        let id = 0;
            let r = await this.sendQuery("SELECT MAX(id) FROM " + table);
            id = r.rows[0].max;
        return id;
    }

    getSQLDate() {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let dbDate = year+"-"+month+"-"+day
        return dbDate;
    }
}

module.exports = dbConnection;
