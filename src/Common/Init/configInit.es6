let xml = require("karl-xml");
let promise1 = xml.read("./server/config/account.xml");
let promise2 = xml.read("./server/config/mysql.xml");
Promise.all([promise1, promise2]).then(d=> {
    global.accountConfig = {
        username: d[0].root.username[0],
        password: d[0].root.password[0],
        usernameCookie: d[0].root.usernameCookie[0],
        passwordCookie: d[0].root.passwordCookie[0],
        loginRedirect: d[0].root.loginRedirect[0]
    };

    let mysql = require("../../util/mysql");
    mysql.init("localhost", d[1].root.user[0], d[1].root.password[0], d[1].root.database[0]);
    console.log("mysql init success");
    global.log.server.info("mysql init success");

    mysql.excuteQuery("show tables").then(function (d) {
        let tableNames = d.map(d1=> {
            let tableName;
            for (let k in d1) {
                tableName = d1[k];
                break;
            }
            return tableName;
        });
        let descTablePromise = [];
        tableNames.map(d1=> {
            descTablePromise.push(mysql.excuteQuery("desc " + d1));
        });
        global.dbStruct = [];
        Promise.all(descTablePromise).then(d1=> {
            for (let i = 0; i < d1.length; i++) {
                let tableName = tableNames[i];
                let tableDesc = d1[i];
                global.dbStruct.push({id: tableName, fields: tableDesc});
            }
            console.log("get database structure successfully");
            global.log.server.info("get database structure successfully");
        }).catch(d1=> {
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
}).catch(d=> {
    console.log(d);
    global.log.error.info(d);
});

module.exports = "";