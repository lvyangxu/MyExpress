let mysql = require("../../util/mysql");
let response = require("./response");
let tableMap = require("./tableMap");

module.exports = {
    read: (req, res, table, map)=> {
        let {sqlCommand, values} = map;
        mysql.excuteQuery(sqlCommand, values).then(d=> {
            d = tableMap.dataMap(table, d);
            response.success(res, d);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    }
};