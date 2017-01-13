let xml = require("karl-xml");
let fs = require("fs");

let load = async()=> {
    try {
        //如果不存在mysql.xml,则跳过mysql初始化
        let path = "./server/config/mongodb.xml";
        if (fs.existsSync(path)) {


            var MongoClient = require('mongodb').MongoClient
                , assert = require('assert');

// Connection URL
            var url = 'mongodb://localhost:27017/g02_log';

// Use connect method to connect to the server
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                console.log("Connected successfully to server");

                db.close();
            });


            console.log("get database structure successfully");
            global.log.server.info("get database structure successfully");
        } else {
            console.log("there is no need to init mysql");
            global.log.server.info("there is no need to init mysql");
        }
    } catch (e) {
        console.log("init mysql failed:" + e.message);
        global.log.error.info("init mysql failed:" + e.message);
    }
};

load();

module.exports = "";