"use strict";

var xml = require("karl-xml");

var loadConfig = function _callee() {
    var accountConfig, mysqlConfig, mysql, i, pool, _i, _global$pool$_i, database, _pool, showTables, tableNames, _i2, table, fields;

    return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return regeneratorRuntime.awrap(xml.read("./server/config/account.xml"));

                case 3:
                    accountConfig = _context.sent;

                    accountConfig = accountConfig.root;
                    global.accountConfig = {
                        username: accountConfig.username[0],
                        password: accountConfig.password[0],
                        usernameCookie: accountConfig.usernameCookie[0],
                        passwordCookie: accountConfig.passwordCookie[0],
                        loginRedirect: accountConfig.loginRedirect[0]
                    };

                    //init mysql
                    _context.next = 8;
                    return regeneratorRuntime.awrap(xml.read("./server/config/mysql.xml"));

                case 8:
                    mysqlConfig = _context.sent;

                    mysqlConfig = mysqlConfig.root;
                    mysql = require("../../util/mysql");


                    global.pool = [];
                    for (i = 0; i < mysqlConfig.user.length; i++) {
                        pool = mysql.init(mysqlConfig.host[i], mysqlConfig.user[i], mysqlConfig.password[i], mysqlConfig.database[i]);

                        global.pool.push({ database: mysqlConfig.database[i], pool: pool });
                    }

                    console.log("mysql init success");
                    global.log.server.info("mysql init success");

                    global.dbStruct = [];
                    _i = 0;

                case 17:
                    if (!(_i < global.pool.length)) {
                        _context.next = 38;
                        break;
                    }

                    //get all table names
                    _global$pool$_i = global.pool[_i];
                    database = _global$pool$_i.database;
                    _pool = _global$pool$_i.pool;
                    _context.next = 23;
                    return regeneratorRuntime.awrap(mysql.excuteQuery({
                        pool: _pool,
                        sqlCommand: "show tables"
                    }));

                case 23:
                    showTables = _context.sent;
                    tableNames = showTables.map(function (d) {
                        var tableName = void 0;
                        for (var k in d) {
                            tableName = d[k];
                            break;
                        }
                        return tableName;
                    });

                    //set global table struct

                    _i2 = 0;

                case 26:
                    if (!(_i2 < tableNames.length)) {
                        _context.next = 35;
                        break;
                    }

                    table = tableNames[_i2];
                    _context.next = 30;
                    return regeneratorRuntime.awrap(mysql.excuteQuery({
                        pool: _pool,
                        sqlCommand: "desc " + table
                    }));

                case 30:
                    fields = _context.sent;

                    global.dbStruct.push({
                        database: database,
                        table: table,
                        fields: fields
                    });

                case 32:
                    _i2++;
                    _context.next = 26;
                    break;

                case 35:
                    _i++;
                    _context.next = 17;
                    break;

                case 38:
                    console.log("get database structure successfully");
                    global.log.server.info("get database structure successfully");

                    _context.next = 46;
                    break;

                case 42:
                    _context.prev = 42;
                    _context.t0 = _context["catch"](0);

                    console.log("init config failed:" + _context.t0.message);
                    global.log.error.info("init config failed:" + _context.t0.message);

                case 46:
                case "end":
                    return _context.stop();
            }
        }
    }, null, undefined, [[0, 42]]);
};

loadConfig();

module.exports = "";
