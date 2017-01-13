let xml = require("karl-xml");
let fs = require("fs");

let load = async()=> {
    try {
        //如果不存在mysql.xml,则跳过mysql初始化
        let path = "./server/config/mysql.xml";
        if(fs.existsSync(path)){
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
            console.log("get mysql database structure successfully");
            global.log.server.info("get mysql database structure successfully");
        }else{
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