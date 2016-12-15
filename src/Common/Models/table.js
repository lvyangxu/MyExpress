let response = require("./response");
let fs = require("fs");


module.exports = {
    init: (req, res, config) => {
        response.success(res, config.columns);
    },
    create: (req, res, config) => {
        //find table struct
        let table = config.id;
        let database, pool;
        if (config.hasOwnProperty("database")) {
            database = config.database;
            pool = global.pool.find(d => {
                return d.database == database;
            })
        } else {
            database = global.pool[0].database;
            pool = global.pool[0].pool;
        }

        let tableStruct = global.dbStruct.find(d => {
            return d.table == table && d.database == database;
        });
        if (tableStruct == undefined) {
            response.fail(res, "unknown table");
            return;
        }

        //columns exclude id
        let noIdFields = tableStruct.fields.filter(d => {
            return d.Field != "id";
        });

        //add every row by param requestRowsLength
        let rowArr = [];
        for (let i = 0; i < req.body.requestRowsLength; i++) {
            let row = "(";
            row += noIdFields.filter(d => {
                //filter default undefined value
                let id = d.Field;
                if (config.hasOwnProperty("create") && config.create.hasOwnProperty(id) && config.create[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).map(d => {
                let id = d.Field;
                let type = d.Type;
                let value;
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
        }

        //build sqlCommand
        let columnIdSqlStr = noIdFields.map(d => {
            return d.Field;
        }).filter(d => {
            //if default value exist and is undefined,then exclude it
            if (config.hasOwnProperty("create") && config.create.hasOwnProperty(d) && config.create[d] == undefined) {
                return false;
            } else {
                return true;
            }
        }).join(",");
        columnIdSqlStr = `(${columnIdSqlStr})`;
        let valuesSqlStr = rowArr.join(",");

        //do mysql excute
        let sqlCommand = `insert into ${table} ${columnIdSqlStr} values ${valuesSqlStr}`;
        global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        }).then(d => {
            global.log.table.info(`create done:${database},${sqlCommand}`);
            response.success(res);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(database + "," + sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    update: (req, res, config) => {
        //find table struct
        let table = config.id;
        let database, pool;
        if (config.hasOwnProperty("database")) {
            database = config.database;
            pool = global.pool.find(d => {
                return d.database == database;
            })
        } else {
            database = global.pool[0].database;
            pool = global.pool[0].pool;
        }

        let tableStruct = global.dbStruct.find(d => {
            return d.table == table && d.database == database;
        });
        if (tableStruct == undefined) {
            response.fail(res, "unknown table");
            return;
        }

        //columns exclude id
        let noIdFields = tableStruct.fields.filter(d => {
            return d.Field != "id";
        });

        let promiseArr = [];
        let sqlCommandArr = [];
        let valuesArr = [];
        for (let i = 0; i < req.body.requestRowsLength; i++) {
            let defaultValueStrArr = [];
            let values = {};
            noIdFields.filter(d => {
                //filter default undefined value
                let id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id) && config.update[id] == undefined) {
                    return false;
                } else {
                    return true;
                }
            }).forEach(d => {
                let id = d.Field;
                if (config.hasOwnProperty("update") && config.update.hasOwnProperty(id)) {
                    //if default value exist and default value has property id
                    defaultValueStrArr.push(id + "=" + config.update[id]);
                } else {
                    //if default value do not exist
                    values[id] = req.body[id][i];
                }
            });
            let defaultValueStr = defaultValueStrArr.join(",");
            if (defaultValueStr != "") {
                let n = 0;
                for (let k in values) {
                    n++;
                }
                if (n != 0) {
                    defaultValueStr += ",";
                }
            }

            let sqlCommand = `update ${config.id} set ${defaultValueStr} ? where id=${req.body.id[i]}`;
            promiseArr.push(global.mysql.excuteQuery({
                pool: pool,
                sqlCommand: sqlCommand,
                values: values
            }));
            sqlCommandArr.push(sqlCommand);
            valuesArr.push(values);
        }

        Promise.all(promiseArr).then(d => {
            global.log.table.info("update done:");
            for (let i = 0; i < sqlCommandArr.length; i++) {
                global.log.table.info(`update ${i} ${database} ${sqlCommandArr[i]}`);
                global.log.table.info(valuesArr[i]);
            }
            response.success(res);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            for (let i = 0; i < sqlCommandArr.length; i++) {
                global.log.error.info(`update ${i} ${database} ${sqlCommandArr[i]}`);
                global.log.error.info(valuesArr[i]);
            }
            response.fail(res, "mysql excuteQuery error");
        });
    },
    read: (req, res, config) => {
        let table = config.id;
        let database, pool;
        if (config.hasOwnProperty("database")) {
            database = config.database;
            pool = global.pool.find(d => {
                return d.database == database;
            })
        } else {
            database = global.pool[0].database;
            pool = global.pool[0].pool;
        }

        let sqlCommand = config.hasOwnProperty("read") ?
            (typeof(config.read) == "function" ? config.read(req) : config.read) : `select * from ${table}`;
        let values = config.hasOwnProperty("readValue") ?
            config.readValue : {};
        global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand,
            values: values
        }).then(d => {
            if (config.hasOwnProperty("readMap")) {
                d = d.map(d1 => {
                    d1 = config.readMap(d1);
                    return d1;
                });
            }
            global.log.table.info(`read done:${database},${sqlCommand}`);
            global.log.table.info(values);
            response.success(res, d);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(database + "," + sqlCommand);
            global.log.error.info(values);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    delete: (req, res, config) => {
        let table = config.id;
        let database, pool;
        if (config.hasOwnProperty("database")) {
            database = config.database;
            pool = global.pool.find(d => {
                return d.database == database;
            })
        } else {
            database = global.pool[0].database;
            pool = global.pool[0].pool;
        }

        let idStr = req.body.id.join(",");
        let sqlCommand = `delete from ${table} where id in (${idStr})`;
        global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        }).then(d => {
            global.log.table.info(`delete done:${database},${sqlCommand}`);
            response.success(res, d);
        }).catch(d => {
            global.log.error.info("mysql excuteQuery error:" + d);
            global.log.error.info(database + "," + sqlCommand);
            response.fail(res, "mysql excuteQuery error");
        });
    },
    attachmentRead: (req, res, config) => {
        let table = config.id;
        let path = `./client/data/${table}/${req.body.id}/`;
        if (fs.existsSync(path)) {
            let attachementList = fs.readdirSync(path);
            response.success(res, attachementList);
        } else {
            response.success(res, []);
        }
    },
    attachmentDelete: (req, res, config) => {
        let table = config.id;
        let path = `./client/data/${table}/${req.body.id}/`;
        let name = req.body.name;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path + name);
            response.success(res);
        } else {
            response.fail(res, "dir do not exist");
        }
    },
    attachmentUpload: (req, res, config) => {
        if (req.files.length == 0) {
            response.fail("no file upload");
            return;
        }
        let table = config.id;
        let sourcePath = "./server/upload/";
        let destPath = `./client/data/${table}/`;
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        destPath += req.query.id + "/";
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        req.files.forEach(d => {
            let filename = d.filename;
            fs.renameSync(sourcePath + filename, destPath + filename);
            global.log.upload.info("upload done:" + destPath + filename);
        });
        response.success(res);
    },
};