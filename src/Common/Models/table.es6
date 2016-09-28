let response = require("./response");
let tableMap = require("./tableMap");

module.exports = {
    init: (req, res, table, map)=> {
        let d = tableMap.init(table);
        if (d.length == 0) {
            response.fail(res, "unknown table");
        } else {
            response.success(res, d);
        }
    },
    create: (req, res, table, map)=> {
        let {sqlCommand, values} = map;
        global.mysql.excuteQuery(sqlCommand, values).then(d=> {
            response.success(res);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    update: (req, res, table, map)=> {
        let [sqlCommandArr, valuesArr] = [map.sqlCommand, map.values];
        let promiseArr = [];
        for (let i = 0; i < sqlCommandArr.length; i++) {
            let sqlCommand = sqlCommandArr[i];
            let values = valuesArr[i];
            promiseArr.push(global.mysql.excuteQuery(sqlCommand, values));
        }
        Promise.all(promiseArr).then(d=> {
            response.success(res);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommandArr);
            console.log(valuesArr);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    read: (req, res, table, map)=> {
        let {sqlCommand, values} = map;
        global.mysql.excuteQuery(sqlCommand, values).then(d=> {
            d = tableMap.dataMap(table, d);
            response.success(res, d);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    delete: (req, res, table, map)=> {
        let sqlCommand = "delete from " + table + " where id in (" + req.body.id + ")";
        global.mysql.excuteQuery(sqlCommand, {}).then(d=> {
            response.success(res, d);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    }
};