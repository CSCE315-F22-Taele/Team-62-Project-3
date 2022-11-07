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
    }
}

module.exports = dbConnection;
