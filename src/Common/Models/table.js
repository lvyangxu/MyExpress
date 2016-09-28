"use strict";

var response = require("./response");
var tableMap = require("./tableMap");

module.exports = {
    init: function init(req, res, table, map) {
        var d = tableMap.init(table);
        if (d.length == 0) {
            response.fail(res, "unknown table");
        } else {
            response.success(res, d);
        }
    },
    create: function create(req, res, table, map) {
        var sqlCommand = map.sqlCommand;
        var values = map.values;

        global.mysql.excuteQuery(sqlCommand, values).then(function (d) {
            response.success(res);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    update: function update(req, res, table, map) {
        var sqlCommandArr = map.sqlCommand;
        var valuesArr = map.values;

        var promiseArr = [];
        for (var i = 0; i < sqlCommandArr.length; i++) {
            var sqlCommand = sqlCommandArr[i];
            var values = valuesArr[i];
            promiseArr.push(global.mysql.excuteQuery(sqlCommand, values));
        }
        Promise.all(promiseArr).then(function (d) {
            response.success(res);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommandArr);
            console.log(valuesArr);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    read: function read(req, res, table, map) {
        var sqlCommand = map.sqlCommand;
        var values = map.values;

        global.mysql.excuteQuery(sqlCommand, values).then(function (d) {
            d = tableMap.dataMap(table, d);
            response.success(res, d);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    delete: function _delete(req, res, table, map) {
        var sqlCommand = "delete from " + table + " where id in (" + req.body.id + ")";
        global.mysql.excuteQuery(sqlCommand, {}).then(function (d) {
            response.success(res, d);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    }
};

//# sourceMappingURL=table.js.map