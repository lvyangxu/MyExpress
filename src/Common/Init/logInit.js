"use strict";

var log = require("./log");
var logNameArr = ["server", "mysql", "table", "business", "login", "error", "download", "upload"];
var loggerJson = log(logNameArr);
global.log = loggerJson;
module.exports = "";

//# sourceMappingURL=logInit.js.map