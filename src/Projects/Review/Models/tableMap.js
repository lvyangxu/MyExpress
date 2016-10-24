"use strict";

module.exports = {
    create: function create(req, res, table) {
        var sqlCommand = "";

        if (tableStruct.length != 0) {
            (function () {
                var defaultValues = [{ tableName: "game", createTime: "now()", updateTime: "now()" }];

                var rowValueStr = rowLengthArr.map(function (i) {
                    var row = "(";
                    row += noIdFields.map(function (d) {
                        var id = d.Field;
                        var type = d.Type;
                        var value = void 0;
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
                    return row;
                }).join(",");
                sqlCommand = "insert into " + table + " (" + columnNameStr + ") values " + rowValueStr;
            })();
        }
        return { sqlCommand: sqlCommand, values: {} };
    },
    update: function update(req, res, table) {
        var sqlCommandArr = [];
        var valuesArr = [];
        var tableStruct = global.dbStruct.filter(function (d) {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            (function () {
                var defaultValues = [{ tableName: "game", createTime: null, updateTime: "now()" }];

                var fields = tableStruct[0].fields;
                var noIdFields = fields.filter(function (d) {
                    return d.Field != "id";
                });
                var rowLengthArr = [];
                for (var i = 0; i < req.body.requestRowsLength; i++) {
                    rowLengthArr.push(i);
                }
                rowLengthArr.forEach(function (i) {
                    var defaultStrArr = [];
                    var values = {};
                    noIdFields.forEach(function (d) {
                        var id = d.Field;
                        var value = void 0;
                        var defaultValue = defaultValues.filter(function (d) {
                            return d.tableName == table;
                        });
                        if (defaultValue.length != 0) {
                            if (defaultValue[0].hasOwnProperty(id)) {
                                value = defaultValue[0][id];
                                if (value != null) {
                                    defaultStrArr.push(id + "=" + value);
                                }
                            } else {
                                if (Array.isArray(req.body[id])) {
                                    value = req.body[id][i];
                                } else {
                                    value = req.body[id];
                                }
                                values[id] = value;
                            }
                        } else {
                            if (Array.isArray(req.body[id])) {
                                value = req.body[id][i];
                            } else {
                                value = req.body[id];
                            }
                            values[id] = value;
                        }
                    });
                    var defaultStr = defaultStrArr.join(",");
                    var valueKeyLength = 0;
                    for (var k in values) {
                        valueKeyLength++;
                    }

                    if (defaultStrArr.length != 0 && valueKeyLength != 0) {
                        defaultStr = defaultStr + ",";
                    }
                    var sqlCommand = "update " + table + " set " + defaultStr + "? where id=" + req.body.id[i];
                    sqlCommandArr.push(sqlCommand);
                    valuesArr.push(values);
                });
            })();
        }
        return { sqlCommand: sqlCommandArr, values: valuesArr };
    },
    read: function read(req, res, table) {
        var sqlCommand = "";
        var values = {};
        switch (table) {
            case "getGameNamesByPublisher":
                sqlCommand = "select * from game where ?";
                values = { publisher: req.body.publisher };
                break;
            case "getGameNamesByDeveloper":
                sqlCommand = "select * from game where ?";
                values = { publisher: req.body.developer };
                break;
            case "followLog":
                sqlCommand = "select * from contact where ? order by contactDate";
                values = { name: req.body.name };
                break;
            case "contactByName":
                sqlCommand = "select * from contact where ?";
                values = { name: req.body.name };
                break;
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return { sqlCommand: sqlCommand, values: values };
    },
    delete: function _delete(req, res, table) {},
    attachmentRead: function attachmentRead(req, res, table) {},
    attachmentDelete: function attachmentDelete(req, res, table) {},
    attachmentUpload: function attachmentUpload(req, res, table) {}
};

//# sourceMappingURL=tableMap.js.map