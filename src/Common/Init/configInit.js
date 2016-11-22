"use strict";

var xml = require("karl-xml");

var loadConfig = function _callee3() {
    return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return regeneratorRuntime.awrap(function _callee2() {
                        var accountConfig, mysqlConfig, mysql, showTables, tableNames;
                        return regeneratorRuntime.async(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        _context2.next = 2;
                                        return regeneratorRuntime.awrap(xml.read("./server/config/account.xml"));

                                    case 2:
                                        accountConfig = _context2.sent;

                                        accountConfig = accountConfig.root;
                                        global.accountConfig = {
                                            username: accountConfig.username[0],
                                            password: accountConfig.password[0],
                                            usernameCookie: accountConfig.usernameCookie[0],
                                            passwordCookie: accountConfig.passwordCookie[0],
                                            loginRedirect: accountConfig.loginRedirect[0]
                                        };

                                        //init mysql
                                        _context2.next = 7;
                                        return regeneratorRuntime.awrap(xml.read("./server/config/mysql.xml"));

                                    case 7:
                                        mysqlConfig = _context2.sent;

                                        mysqlConfig = mysqlConfig.root;
                                        mysql = require("../../util/mysql");

                                        mysql.init("localhost", mysqlConfig.user[0], mysqlConfig.password[0], mysqlConfig.database[0]);
                                        console.log("mysql init success");
                                        global.log.server.info("mysql init success");

                                        //get all table names
                                        _context2.next = 15;
                                        return regeneratorRuntime.awrap(mysql.excuteQuery("show tables"));

                                    case 15:
                                        showTables = _context2.sent;
                                        tableNames = showTables.map(function (d) {
                                            var tableName = void 0;
                                            for (var k in d) {
                                                tableName = d[k];
                                                break;
                                            }
                                            return tableName;
                                        });

                                        //set global table struct

                                        global.dbStruct = tableNames.map(function _callee(d) {
                                            var fields;
                                            return regeneratorRuntime.async(function _callee$(_context) {
                                                while (1) {
                                                    switch (_context.prev = _context.next) {
                                                        case 0:
                                                            _context.next = 2;
                                                            return regeneratorRuntime.awrap(mysql.excuteQuery("desc " + d));

                                                        case 2:
                                                            fields = _context.sent;
                                                            return _context.abrupt("return", { id: d, fields: fields });

                                                        case 4:
                                                        case "end":
                                                            return _context.stop();
                                                    }
                                                }
                                            }, null, undefined);
                                        });

                                        console.log("get database structure successfully");
                                        global.log.server.info("get database structure successfully");

                                    case 20:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, null, undefined);
                    }());

                case 3:
                    _context3.next = 9;
                    break;

                case 5:
                    _context3.prev = 5;
                    _context3.t0 = _context3["catch"](0);

                    console.log("init config failed:" + _context3.t0.message);
                    global.log.error.info("init config failed:" + _context3.t0.message);

                case 9:
                case "end":
                    return _context3.stop();
            }
        }
    }, null, undefined, [[0, 5]]);
};

loadConfig();

module.exports = "";

//# sourceMappingURL=configInit.js.map