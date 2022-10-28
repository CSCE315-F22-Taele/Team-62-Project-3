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
}

module.exports = dbConnection;