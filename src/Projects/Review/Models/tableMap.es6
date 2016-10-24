module.exports = {
    create: (req, res, table)=> {
        let sqlCommand = "";

        if (tableStruct.length != 0) {
            let defaultValues = [{tableName: "game", createTime: "now()", updateTime: "now()"}];

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
                            if(Array.isArray(req.body[id])){
                                value = req.body[id][i];
                            }else{
                                value = req.body[id];
                            }
                            values[id] = value;
                        }
                    } else {
                        if(Array.isArray(req.body[id])){
                            value = req.body[id][i];
                        }else{
                            value = req.body[id];
                        }
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
                let sqlCommand = "update " + table + " set " + defaultStr + "? where id=" + req.body.id[i];
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
            case "getGameNamesByPublisher":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.publisher};
                break;
            case "getGameNamesByDeveloper":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.developer};
                break;
            case "followLog":
                sqlCommand = "select * from contact where ? order by contactDate";
                values = {name: req.body.name};
                break;
            case "contactByName":
                sqlCommand = "select * from contact where ?";
                values = {name: req.body.name};
                break;
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