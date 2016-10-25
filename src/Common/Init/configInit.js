"use strict";

var xml = require("karl-xml");
var promise1 = xml.read("./server/config/account.xml");
var promise2 = xml.read("./server/config/mysql.xml");
Promise.all([promise1, promise2]).then(function (d) {
    global.accountConfig = {
        username: d[0].root.username[0],
        password: d[0].root.password[0],
        usernameCookie: d[0].root.usernameCookie[0],
        passwordCookie: d[0].root.passwordCookie[0],
        loginRedirect: d[0].root.loginRedirect[0]
    };

    var mysql = require("../../util/mysql");
    mysql.init("localhost", d[1].root.user[0], d[1].root.password[0], d[1].root.database[0]);
    console.log("mysql init success");
    global.log.server.info("mysql init success");

    mysql.excuteQuery("show tables").then(function (d) {
        var tableNames = d.map(function (d1) {
            var tableName = void 0;
            for (var k in d1) {
                tableName = d1[k];
                break;
            }
            return tableName;
        });
        var descTablePromise = [];
        tableNames.map(function (d1) {
            descTablePromise.push(mysql.excuteQuery("desc " + d1));
        });
        global.dbStruct = [];
        Promise.all(descTablePromise).then(function (d1) {
            for (var i = 0; i < d1.length; i++) {
                var tableName = tableNames[i];
                var tableDesc = d1[i];
                global.dbStruct.push({ id: tableName, fields: tableDesc });
            }
            console.log("get database structure successfully");
            global.log.server.info("get database structure successfully");
        }).catch(function (d1) {
            console.log("get table structure failed:");
            console.log(d1);
            global.log.error.info("get table structure failed:");
            global.log.error.info(d1);
        });
    }).catch(function (d) {
        console.log("get database structure failed:");
        console.log(d);
        global.log.error.info("get database structure failed:");
        global.log.error.info(d);
    });
}).catch(function (d) {
    console.log(d);
    global.log.error.info(d);
});

module.exports = "";

//# sourceMappingURL=configInit.js.map