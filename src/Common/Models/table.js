"use strict";

var response = require("./response");
var fs = require("fs");

module.exports = {
    init: function init(req, res, config) {
        response.success(res, config.columns);
    },
    create: function create(req, res, config) {
        var table = config.id;
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
            row += noIdFields.filter(function (d) {
                //filter default undefined value
                var id = d.Field;
                if (config.hasOwnProperty("create") && config.create.hasOwnProperty(id) && config.create[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).map(function (d) {
                var id = d.Field;
                var type = d.Type;
                var value = void 0;
                if (config.hasOwnProperty("create") && config.create.hasOwnProperty(id)) {
                    //if default value exist and default value has property id
                    value = config.create[id];
                } else {
                    //if default value do not exist
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
            if (config.hasOwnProperty("create") && config.create.hasOwnProperty(d) && config.create[d] == undefined) {
                return false;
            } else {
                return true;
            }
        }).join(",");
        columnIdSqlStr = "(" + columnIdSqlStr + ")";
        var valuesSqlStr = rowArr.join(",");

        //do mysql excute
        var sqlCommand = "insert into " + table + " " + columnIdSqlStr + " values " + valuesSqlStr;
        global.mysql.excuteQuery(sqlCommand).then(function (d) {
            global.log.table.info("create done:" + sqlCommand);
            response.success(res);
        }).catch(function (d) {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    update: function update(req, res, config) {
        var table = config.id;
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

        var promiseArr = [];
        var sqlCommandArr = [];
        var valuesArr = [];

        var _loop2 = function _loop2(i) {
            var defaultValueStrArr = [];
            var values = {};
            noIdFields.filter(function (d) {
                //filter default undefined value
                var id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id) && config.update[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).forEach(function (d) {
                var id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id)) {
                    //if default value exist and default value has property id
                    defaultValueStrArr.push(id + "=" + config.update[id]);
                } else {
                    //if default value do not exist
                    values[id] = req.body[id][i];
                }
            });
            var defaultValueStr = defaultValueStrArr.join(",");
            if (defaultValueStr != "") {
                var n = 0;
                for (var k in values) {
                    n++;
                }
                if (n != 0) {
                    defaultValueStr += ",";
                }
            }

            var sqlCommand = "update " + config.id + " set " + defaultValueStr + " ? where id=" + req.body.id[i];
            promiseArr.push(global.mysql.excuteQuery(sqlCommand, values));
            sqlCommandArr.push(sqlCommand);
            valuesArr.push(values);
        };

        for (var i = 0; i < req.body.requestRowsLength; i++) {
            _loop2(i);
        }

        Promise.all(promiseArr).then(function (d) {
            global.log.table.info("update done:");
            for (var _i = 0; _i < sqlCommandArr.length; _i++) {
                global.log.table.info("update " + _i + " " + sqlCommandArr[_i]);
                global.log.table.info(valuesArr[_i]);
            }
            response.success(res);
        }).catch(function (d) {
            global.log.error.info("mysql excuteQuery error:" + d);
            for (var _i2 = 0; _i2 < sqlCommandArr.length; _i2++) {
                global.log.error.info("update " + _i2 + " " + sqlCommandArr[_i2]);
                global.log.error.info(valuesArr[_i2]);
            }
            response.fail(res, "mysql excuteQuery error");
        });
    },
    read: function read(req, res, config) {
        var table = config.id;
        var sqlCommand = config.hasOwnProperty("read") ? typeof config.read == "function" ? config.read(req) : config.read : "select * from " + table;
        var values = config.hasOwnProperty("readValue") ? config.readValue : {};
        global.mysql.excuteQuery(sqlCommand, values).then(function (d) {
            if (config.hasOwnProperty("readMap")) {
                d = d.map(function (d1) {
                    d1 = config.readMap(d1);
                    return d1;
                });
            }
            global.log.table.info("read done:" + sqlCommand);
            global.log.table.info(values);
            response.success(res, d);
        }).catch(function (d) {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(sqlCommand);
            global.log.error.info(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    delete: function _delete(req, res, config) {
        var table = config.id;
        var idStr = req.body.id.join(",");
        var sqlCommand = "delete from " + table + " where id in (" + idStr + ")";
        global.mysql.excuteQuery(sqlCommand).then(function (d) {
            global.log.table.info("delete done:" + sqlCommand);
            response.success(res, d);
        }).catch(function (d) {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    attachmentRead: function attachmentRead(req, res, config) {
        var table = config.id;
        var path = "./client/data/" + table + "/" + req.body.id + "/";
        if (fs.existsSync(path)) {
            var attachementList = fs.readdirSync(path);
            response.success(res, attachementList);
        } else {
            response.success(res, []);
        }
    },
    attachmentDelete: function attachmentDelete(req, res, config) {
        var table = config.id;
        var path = "./client/data/" + table + "/" + req.body.id + "/";
        var name = req.body.name;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path + name);
            response.success(res);
        } else {
            response.fail(res, "dir do not exist");
        }
    },
    attachmentUpload: function attachmentUpload(req, res, config) {
        if (req.files.length == 0) {
            response.fail("no file upload");
            return;
        }
        var table = config.id;
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
            global.log.upload.info("upload done:" + destPath + filename);
        });
        response.success(res);
    }
};

//# sourceMappingURL=table.js.map