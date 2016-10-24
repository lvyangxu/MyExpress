"use strict";

var response = require("./response");
var tableConfig = require("./tableConfig");
var fs = require("fs");

module.exports = {
    init: function init(req, res, config) {
        response.success(res, config.columns);
    },
    create: function create(req, res, config) {
        //find table struct
        var tableStruct = global.dbStruct.find(function (d) {
            return d.id == table;
        });
        if (tableStruct == undefined) {
            response.fail(res, "unknown table");
            return;
        }

        //columns exclude id
        var noIdFields = tableStruct.fields.filter(function (d) {
            return d.Field != "id";
        });

        //add every row by param requestRowsLength
        var rowArr = [];

        var _loop = function _loop(i) {
            var row = "(";
            row += noIdFields.map(function (d) {
                var id = d.Field;
                var type = d.Type;
                var value = void 0;

                if (config.hasOwnProperty("create")) {
                    //if default value exist

                } else {
                        //if default value do not exist

                    }

                var defaultValue = defaultValues.filter(function (d) {
                    return d.tableName == table;
                });
                if (defaultValue.length != 0 && defaultValue[0][id]) {
                    value = defaultValue[0][id];
                } else {
                    value = req.body[id][i];
                    if (!type.includes("int") && type != "float" && type != "double") {
                        value = "'" + value + "'";
                    }
                }
                return value;
            }).join(",");
            row += ")";
            rowArr.push(row);
        };

        for (var i = 0; i < req.body.requestRowsLength; i++) {
            _loop(i);
        }

        //build sqlCommand
        var columnIdSqlStr = noIdFields.map(function (d) {
            return d.Field;
        }).filter(function (d) {
            //if default value exist and is undefined,then exclude it
            if (config.hasOwnProperty("create") && config.create.hasOwnProperty(d) && config.create.d == undefined) {
                return false;
            } else {
                return true;
            }
        }).join(",");
        columnIdSqlStr = "(" + columnIdSqlStr + ")";
        var valuesSqlStr = rowArr.join(",");

        var sqlCommand = "insert into " + table + " " + columnIdSqlStr + " values " + valuesSqlStr;

        global.mysql.excuteQuery(sqlCommand, {}).then(function (d) {
            response.success(res);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            console.log(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    update: function update(req, res, table, map) {
        var _ref = [map.sqlCommand, map.values];
        var sqlCommandArr = _ref[0];
        var valuesArr = _ref[1];

        var promiseArr = [];
        for (var i = 0; i < sqlCommandArr.length; i++) {
            var sqlCommand = sqlCommandArr[i];
            var _values = valuesArr[i];
            promiseArr.push(global.mysql.excuteQuery(sqlCommand, _values));
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
    delete: function _delete(req, res, table) {
        var sqlCommand = "delete from " + table + " where id in (" + req.body.id + ")";
        global.mysql.excuteQuery(sqlCommand, {}).then(function (d) {
            response.success(res, d);
        }).catch(function (d) {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    attachmentRead: function attachmentRead(req, res, table) {
        var path = "./client/data/" + table + "/" + req.body.id + "/";
        if (fs.existsSync(path)) {
            var attachementList = fs.readdirSync(path);
            attachementList = attachementList.map(function (d) {
                d = d.base64Encode();
                return d;
            });
            response.success(res, attachementList);
        } else {
            response.success(res, []);
        }
    },
    attachmentDelete: function attachmentDelete(req, res, table) {
        var name = req.body.name;
        var path = "./client/data/" + table + "/" + req.body.id + "/";
        if (fs.existsSync(path)) {
            fs.unlinkSync(path + name);
            response.success(res);
        } else {
            response.fail(res, "dir do not exist");
        }
    },
    attachmentUpload: function attachmentUpload(req, res, table) {
        if (req.files.length == 0) {
            response.fail("no file");
            return;
        }
        var sourcePath = "./server/upload/";
        var destPath = "./client/data/" + table + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        destPath += req.query.id + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        req.files.forEach(function (d) {
            var filename = d.filename;
            fs.renameSync(sourcePath + filename, destPath + filename);
        });
        response.success(res);
    }
};

//# sourceMappingURL=table.js.map