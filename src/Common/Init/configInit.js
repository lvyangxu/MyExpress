let xml = require("karl-xml");
let jwt = require("karl-jwt");

let loadConfig = async() => {
    try {

        //set global account
        let accountConfig = await xml.read("./server/config/account.xml");
        accountConfig = accountConfig.root;
        global.accountConfig = {
            project: accountConfig.project[0],
            username: accountConfig.username[0],
            password: accountConfig.password[0],
            loginRedirect: accountConfig.loginRedirect[0]
        };

        //set global jwt
        global.jwt = new jwt({
            secret: "Radiumme-" + global.accountConfig.project
        });

        //init mysql
        let mysqlConfig = await xml.read("./server/config/mysql.xml");
        mysqlConfig = mysqlConfig.root;
        let mysql = require("../../util/mysql");

        global.pool = [];
        for (let i = 0; i < mysqlConfig.user.length; i++) {
            let pool = mysql.init(mysqlConfig.host[i], mysqlConfig.user[i], mysqlConfig.password[i], mysqlConfig.database[i]);
            global.pool.push({database: mysqlConfig.database[i], pool: pool});
        }

        console.log("mysql init success");
        global.log.server.info("mysql init success");

        global.dbStruct = [];
        for (let i = 0; i < global.pool.length; i++) {
            //get all table names
            let {database, pool} = global.pool[i];
            let showTables = await mysql.excuteQuery({
                pool: pool,
                sqlCommand: "show tables"
            });
            let tableNames = showTables.map(d => {
                let tableName;
                for (let k in d) {
                    tableName = d[k];
                    break;
                }
                return tableName;
            });

            //set global table struct
            for (let i = 0; i < tableNames.length; i++) {
                let table = tableNames[i];
                let fields = await mysql.excuteQuery({
                    pool: pool,
                    sqlCommand: "desc " + table
                });
                global.dbStruct.push({
                    database: database,
                    table: table,
                    fields: fields
                });
            }
        }
        console.log("get database structure successfully");
        global.log.server.info("get database structure successfully");

    } catch (e) {
        console.log("init config failed:" + e.message);
        global.log.error.info("init config failed:" + e.message);
    }


};

loadConfig();

module.exports = "";