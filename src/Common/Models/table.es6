let response = require("./response");
let tableMap = require("./tableMap");
let fs = require("fs");

module.exports = {
    init: (req, res, table)=> {
        let d = tableMap.init(table);
        if (d.length == 0) {
            response.fail(res, "unknown table");
        } else {
            response.success(res, d);
        }
    },
    create: (req, res, table, map)=> {
        let {sqlCommand, values} = map;
        global.mysql.excuteQuery(sqlCommand, values).then(d=> {
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
        if (req.files[0] == undefined) {
            response.fail("no file");
            return;
        }
        let sourcePath = "./server/upload/";
        let destPath = "./client/data/" + table + "/";
        if(!fs.existsSync(destPath)){
            fs.mkdirSync(destPath);
        }
        destPath += req.query.id + "/";
        if(!fs.existsSync(destPath)){
            fs.mkdirSync(destPath);
        }
        let filename = req.files[0].filename;
        fs.renameSync(sourcePath + filename, destPath + filename);
        response.success(res);
    },
};