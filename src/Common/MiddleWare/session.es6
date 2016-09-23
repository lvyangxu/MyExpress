let account = require("./account");
let response = require("./response");
module.exports = (req, res, next)=> {
    if (req.session.username == undefined) {
        //try relogin
        let isSuccess = account.relogin();
        if (isSuccess) {
            next();
        } else {
            response.fail(res, "unauthorized");
        }
    }
};