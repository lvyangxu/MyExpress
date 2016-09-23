let response = require("./response");
module.exports = {
    getCookieName: (req, res)=> {
        response.success(res, {
            username: global.accountConfig.usernameCookie,
            password: global.accountConfig.passwordCookie,
            loginRedirect: global.accountConfig.loginRedirect
        });
    },
    login: (req, res)=> {
        let username = req.body.username;
        let password = req.body.password;
        if (username == global.accountConfig.username && password == global.accountConfig.password) {
            //set session
            req.session.username = username;
            response.success(res);
        } else {
            response.fail(res, "invalid username or password");
        }
    },
    logout: ()=> {

    },
    relogin: ()=> {
        let username = req.cookies[global.accountConfig.usernameCookie];
        let password = req.cookies[global.accountConfig.passwordCookie];
        if (username == global.accountConfig.username && password == global.accountConfig.password) {
            //set session
            req.session.username = username;
            return true;
        } else {
            return false;
        }
    }
};