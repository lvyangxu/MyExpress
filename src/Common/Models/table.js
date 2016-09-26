"use strict";

var mysql = require("../../util/mysql");
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
    read: function read(req, res, table, map) {
        var sqlCommand = map.sqlCommand;
        var values = map.values;

        mysql.excuteQuery(sqlCommand, values).then(function (d) {
            d = tableMap.dataMap(table, d);
            response.success(res, d);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    }
};

//# sourceMappingURL=table.js.map