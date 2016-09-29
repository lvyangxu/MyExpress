"use strict";

var account = require("./account");
var response = require("./response");
module.exports = function (req, res, next) {
    var urlArr = req.originalUrl.split("/");
    if (urlArr.length == 4 && urlArr[1] == "table") {
        if (req.session.username == undefined) {
            //try relogin
            console.log("try relogin");
            var isSuccess = account.relogin(req, res);
            if (isSuccess) {
                console.log("relogin successfully");
                next();
                return;
            } else {
                console.log("unauthorized");
                response.fail(res, "unauthorized");
                return;
            }
        }
    }
    next();
};

//# sourceMappingURL=session.js.map