"use strict";

module.exports = {
    dataMap: function dataMap(table, d) {
        switch (table) {
            case "getGames":
                d = d.map(function (d1) {
                    return d1.name;
                });
                break;
            case "getPublishers":
                d = d.map(function (d1) {
                    return d1.publisher;
                });
                break;
            case "getDevelopers":
                d = d.map(function (d1) {
                    return d1.developer;
                });
                break;
        }
        return d;
    },
    init: function init(table) {
        var d = [];
        switch (table) {
            case "server_info":
                d = [{ id: "id", name: "id", checked: false }, { id: "serverRoom", name: "公司名称", checked: true }, { id: "businessType", name: "业务类型", checked: true }, { id: "area", name: "业务地区", checked: true }, { id: "address", name: "所在地", checked: true }, { id: "productType", name: "主要产品类型", checked: true }, { id: "contactMan", name: "联系人", checked: true }, { id: "duty", name: "职位", checked: true }, { id: "contactWay", name: "联系方式", checked: true }, { id: "website", name: "网站", checked: true }, { id: "appannie", name: "App Annie", checked: true }, { id: "manager", name: "负责人", checked: true }, { id: "note", name: "备注", checked: true }];
                break;
        }
        return d;
    },
    create: function create(req, res, table) {
        var sqlCommand = "";
        var tableStruct = global.dbStruct.filter(function (d) {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            (function () {
                var defaultValues = [{ tableName: "game", createTime: "now()", updateTime: "now()" }];

                var fields = tableStruct[0].fields;
                var noIdFields = fields.filter(function (d) {
                    return d.Field != "id";
                });
                var columnNameStr = noIdFields.map(function (d) {
                    return d.Field;
                }).join(",");
                var rowLengthArr = [];
                for (var i = 0; i < req.body.requestRowsLength; i++) {
                    rowLengthArr.push(i);
                }
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
                            value = req.body[id].split(",")[i];
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
                                value = req.body[id].split(",")[i];
                                values[id] = value;
                            }
                        } else {
                            value = req.body[id].split(",")[i];
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
                    var sqlCommand = "update " + table + " set " + defaultStr + "? where id=" + req.body.id.split(",")[i];
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