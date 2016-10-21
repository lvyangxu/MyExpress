"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    relogin: function relogin(req, res) {
        var _map = ["username", "password"].map(function (d) {
            d = req.cookies[global.accountConfig[d + "Cookie"]];
            return d;
        });

        var _map2 = _slicedToArray(_map, 2);

        var username = _map2[0];
        var password = _map2[1];

        if (username == global.accountConfig.username.md5Encode() && password == global.accountConfig.password.md5Encode()) {
            //set session
            req.session.username = global.accountConfig.username;
            return true;
        } else {
            return false;
        }
    }
};

//# sourceMappingURL=account.js.map