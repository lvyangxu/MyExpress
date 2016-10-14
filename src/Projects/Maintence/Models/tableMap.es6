module.exports = {
    dataMap: (table, d)=> {
        switch (table) {
            case "getGames":
                d = d.map(d1=> {
                    return d1.name;
                });
                break;
            case "getPublishers":
                d = d.map(d1=> {
                    return d1.publisher;
                });
                break;
            case "getDevelopers":
                d = d.map(d1=> {
                    return d1.developer;
                });
                break;
        }
        return d;
    },
    init: (table)=> {
        let d = [];
        switch (table) {
            case "server_info":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "serverRoom", name: "公司名称", checked: true},
                    {id: "businessType", name: "业务类型", checked: true},
                    {id: "area", name: "业务地区", checked: true},
                    {id: "address", name: "所在地", checked: true},
                    {id: "productType", name: "主要产品类型", checked: true},
                    {id: "contactMan", name: "联系人", checked: true},
                    {id: "duty", name: "职位", checked: true},
                    {id: "contactWay", name: "联系方式", checked: true},
                    {id: "website", name: "网站", checked: true},
                    {id: "appannie", name: "App Annie", checked: true},
                    {id: "manager", name: "负责人", checked: true},
                    {id: "note", name: "备注", checked: true}
                ];
                break;
        }
        return d;
    },
    create: (req, res, table)=> {
        let sqlCommand = "";
        let tableStruct = global.dbStruct.filter(d=> {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            let defaultValues = [{tableName: "game", createTime: "now()", updateTime: "now()"}];

            let fields = tableStruct[0].fields;
            let noIdFields = fields.filter(d=> {
                return d.Field != "id";
            });
            let columnNameStr = noIdFields.map(d=> {
                return d.Field;
            }).join(",");
            let rowLengthArr = [];
            for (let i = 0; i < req.body.requestRowsLength; i++) {
                rowLengthArr.push(i);
            }
            let rowValueStr = rowLengthArr.map(i=> {
                let row = "(";
                row += noIdFields.map(d=> {
                    let id = d.Field;
                    let type = d.Type;
                    let value;
                    let defaultValue = defaultValues.filter(d=> {
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
        }
        return {sqlCommand: sqlCommand, values: {}};
    },
    update: (req, res, table)=> {
        let sqlCommandArr = [];
        let valuesArr = [];
        let tableStruct = global.dbStruct.filter(d=> {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            let defaultValues = [{tableName: "game", createTime: null, updateTime: "now()"}];

            let fields = tableStruct[0].fields;
            let noIdFields = fields.filter(d=> {
                return d.Field != "id";
            });
            let rowLengthArr = [];
            for (let i = 0; i < req.body.requestRowsLength; i++) {
                rowLengthArr.push(i);
            }
            rowLengthArr.forEach(i=> {
                let defaultStrArr = [];
                let values = {};
                noIdFields.forEach(d=> {
                    let id = d.Field;
                    let value;
                    let defaultValue = defaultValues.filter(d=> {
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
                let defaultStr = defaultStrArr.join(",");
                let valueKeyLength = 0;
                for (let k in values) {
                    valueKeyLength++;
                }

                if (defaultStrArr.length != 0 && valueKeyLength != 0) {
                    defaultStr = defaultStr + ",";
                }
                let sqlCommand = "update " + table + " set " + defaultStr + "? where id=" + req.body.id.split(",")[i];
                sqlCommandArr.push(sqlCommand);
                valuesArr.push(values);
            });
        }
        return {sqlCommand: sqlCommandArr, values: valuesArr};
    },
    read: (req, res, table)=> {
        let sqlCommand = "";
        let values = {};
        switch (table) {
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return {sqlCommand: sqlCommand, values: values};
    },
    delete: (req, res, table)=> {

    },
    attachmentRead: (req, res, table)=> {

    },
    attachmentDelete: (req, res, table)=> {

    },
    attachmentUpload: (req, res, table)=> {

    },
};