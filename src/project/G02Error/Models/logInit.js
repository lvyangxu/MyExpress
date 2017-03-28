let log = require("./log");
let logNameArr = ["server"];
let loggerJson = log(logNameArr);
global.log = loggerJson;
module.exports = "";
