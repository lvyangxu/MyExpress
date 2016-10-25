let mysqljs = require('mysql');
let mysql = {
    pool: null,
    init: (host, user, password, database)=> {
        let pool = mysqljs.createPool({
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
    excuteQuery: (sqlCommand, values)=> {
        values = (values == undefined) ? {} : values;
        return new Promise((resolve, reject)=> {
            mysql.pool.query(sqlCommand, values, function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows, {
                        sqlCommand: sqlCommand,
                        values: values,
                        fields: fields
                    });
                }
            });
        })
    }
};

module.exports = mysql;