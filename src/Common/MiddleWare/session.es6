let account = require("./account");
let response = require("./response");
module.exports = (req, res, next)=> {
    let urlArr = req.originalUrl.split("/");
    if(urlArr.length == 4 && urlArr[1] == "table"){
        if (req.session.username == undefined) {
            //try relogin
            console.log("try relogin");
            let isSuccess = account.relogin(req, res);
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