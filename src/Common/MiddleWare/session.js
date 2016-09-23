"use strict";

var account = require("./account");
var response = require("./response");
module.exports = function (req, res, next) {
    if (req.session.username == undefined) {
        //try relogin
        var isSuccess = account.relogin();
        if (isSuccess) {
            next();
        } else {
            response.fail(res, "unauthorized");
        }
    }
};

//# sourceMappingURL=session.js.map