"use strict";

var response = require("./response");
module.exports = {
    getCookieName: function getCookieName(req, res) {
        response.success(res, {
            username: global.accountConfig.usernameCookie,
            password: global.accountConfig.passwordCookie,
            loginRedirect: global.accountConfig.loginRedirect
        });
    },
    login: function login(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (username == global.accountConfig.username && password == global.accountConfig.password) {
            //set session
            req.session.username = username;
            response.success(res);
        } else {
            response.fail(res, "invalid username or password");
        }
    },
    logout: function logout() {},
    relogin: function relogin() {
        var username = req.cookies[global.accountConfig.usernameCookie];
        var password = req.cookies[global.accountConfig.passwordCookie];
        if (username == global.accountConfig.username && password == global.accountConfig.password) {
            //set session
            req.session.username = username;
            return true;
        } else {
            return false;
        }
    }
};

//# sourceMappingURL=account.js.map