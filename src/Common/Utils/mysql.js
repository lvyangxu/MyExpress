'use strict';

var mysqljs = require('mysql');
var mysql = {
    pool: null,
    init: function init(host, user, password, database) {
        var pool = mysqljs.createPool({
            connectionLimit: 10,
            host: host,
            user: user,
            password: password,
            database: database,
            dateStrings: true
        });
        mysql.pool = pool;
        global.mysql = mysql;
    },
    excuteQuery: function excuteQuery(sqlCommand, values) {
        return new Promise(function (resolve, reject) {
            mysql.pool.query(sqlCommand, values, function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows, fields);
                }
            });
        });
    }
};

module.exports = mysql;

//# sourceMappingURL=mysql.js.map