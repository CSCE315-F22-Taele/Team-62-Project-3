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
        /**
        order: {
            discount: Number,
            productList:[{
                id:Number,
                selectedItems:[Number]
            }]
        }
        */
       cmd = "";
       cmd += toString(order.productList).replace("[", "{").replace("]", "}") + "', ";
       cmd += order.discount + ", ";
       cmd += order.subtotal + ", ";
       cmd += order.total + ", ";
       cmd += "'" + order.date + "'";
       full = "INSERT INTO orders VALUES (" + cmd + ")";
       this.sendQuery(full);
    }
}

module.exports = dbConnection;
