"use strict";

var response = require("./response");
var tableMap = require("./tableMap");
var fs = require("fs");

module.exports = {
    init: function init(req, res, table) {
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