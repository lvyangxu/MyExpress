let response = require("./response");
let tableConfig = require("./tableConfig");
let fs = require("fs");

module.exports = {
    init: (req, res, config)=> {
        response.success(res, config.columns);
    },
    create: (req, res, config)=> {
        //find table struct
        let tableStruct = global.dbStruct.find(d=> {
            return d.id == table;
        });
        if (tableStruct == undefined) {
            response.fail(res, "unknown table");
            return;
        }

        //columns exclude id
        let noIdFields = tableStruct.fields.filter(d=> {
            return d.Field != "id";
        });

        //add every row by param requestRowsLength
        let rowArr = [];
        for (let i = 0; i < req.body.requestRowsLength; i++) {
            let row = "(";
            row += noIdFields.map(d=> {
                let id = d.Field;
                let type = d.Type;
                let value;

                if (config.hasOwnProperty("create")) {
                    //if default value exist

                } else {
                    //if default value do not exist

                }

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
            rowArr.push(row);
        }

        //build sqlCommand
        let columnIdSqlStr = noIdFields.map(d=> {
            return d.Field;
        }).filter(d=> {
            //if default value exist and is undefined,then exclude it
            if (config.hasOwnProperty("create") && config.create.hasOwnProperty(d) && config.create.d == undefined) {
                return false;
            }else{
                return true;
            }
        }).join(",");
        columnIdSqlStr = `(${columnIdSqlStr})`;
        let valuesSqlStr = rowArr.join(",");

        let sqlCommand = `insert into ${table} ${columnIdSqlStr} values ${valuesSqlStr}`;

        global.mysql.excuteQuery(sqlCommand, {}).then(d=> {
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
    delete: (req, res, table)=> {
        let sqlCommand = "delete from " + table + " where id in (" + req.body.id + ")";
        global.mysql.excuteQuery(sqlCommand, {}).then(d=> {
            response.success(res, d);
        }).catch(d=> {
            console.log("mysql excuteQuery error:" + d);
            console.log(sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    attachmentRead: (req, res, table)=> {
        let path = "./client/data/" + table + "/" + req.body.id + "/";
        if (fs.existsSync(path)) {
            let attachementList = fs.readdirSync(path);
            attachementList = attachementList.map(d=> {
                d = d.base64Encode();
                return d;
            });
            response.success(res, attachementList);
        } else {
            response.success(res, []);
        }
    },
    attachmentDelete: (req, res, table)=> {
        let name = req.body.name;
        let path = "./client/data/" + table + "/" + req.body.id + "/";
        if (fs.existsSync(path)) {
            fs.unlinkSync(path + name);
            response.success(res);
        } else {
            response.fail(res, "dir do not exist");
        }

    },
    attachmentUpload: (req, res, table)=> {
        if (req.files.length == 0) {
            response.fail("no file");
            return;
        }
        let sourcePath = "./server/upload/";
        let destPath = "./client/data/" + table + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        destPath += req.query.id + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        req.files.forEach(d=> {
            let filename = d.filename;
            fs.renameSync(sourcePath + filename, destPath + filename);
        });
        response.success(res);
    },
};