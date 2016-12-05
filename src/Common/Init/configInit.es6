let xml = require("karl-xml");

let loadConfig = async() => {
    try {
        //set global account
        let accountConfig = await xml.read("./server/config/account.xml");
        accountConfig = accountConfig.root;
        global.accountConfig = {
            username: accountConfig.username[0],
            password: accountConfig.password[0],
            usernameCookie: accountConfig.usernameCookie[0],
            passwordCookie: accountConfig.passwordCookie[0],
            loginRedirect: accountConfig.loginRedirect[0]
        };

        //init mysql
        let mysqlConfig = await xml.read("./server/config/mysql.xml");
        mysqlConfig = mysqlConfig.root;
        let mysql = require("../../util/mysql");
        mysql.init("localhost", mysqlConfig.user[0], mysqlConfig.password[0], mysqlConfig.database[0]);
        console.log("mysql init success");
        global.log.server.info("mysql init success");

        //get all table names
        let showTables = await mysql.excuteQuery("show tables");
        let tableNames = showTables.map(d => {
            let tableName;
            for (let k in d) {
                tableName = d[k];
                break;
            }
            return tableName;
        });

        //set global table struct
        global.dbStruct = tableNames.map(async d=>{
            let fields = await mysql.excuteQuery("desc " + d);
            return {id: d, fields: fields}
        });

        console.log("get database structure successfully");
        global.log.server.info("get database structure successfully");
    } catch (e) {
        console.log("init config failed:" + e.message);
        global.log.error.info("init config failed:" + e.message);
    }


};

loadConfig();

module.exports = "";