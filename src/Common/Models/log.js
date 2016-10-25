"use strict";

var log4js = require('log4js');
module.exports = function (logNameArr) {
    var appenders = logNameArr.map(function (d) {
        return {
            type: "file",
            filename: "server/log/" + d + ".log",
            pattern: ".yyyy-MM-dd",
            category: d
        };
    });

    log4js.configure({
        appenders: appenders
    });

    var loggerJson = {};
    logNameArr.forEach(function (d) {
        loggerJson[d] = log4js.getLogger(d);
    });
    return loggerJson;
};

//# sourceMappingURL=log.js.map