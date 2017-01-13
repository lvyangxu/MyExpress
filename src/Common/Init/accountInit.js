let xml = require("karl-xml");
let jwt = require("karl-jwt");

let load = async()=> {
    try {
        //set global account
        let accountConfig = await xml.read("./server/config/account.xml");
        accountConfig = accountConfig.root;
        global.accountConfig = {
            project: accountConfig.project[0],
            username: accountConfig.username[0],
            password: accountConfig.password[0],
            loginRedirect: accountConfig.loginRedirect[0]
        };

        //set global jwt
        global.jwt = new jwt({
            secret: "Radiumme-" + global.accountConfig.project
        });
    } catch (e) {
        console.log("init account failed:" + e.message);
        global.log.error.info("init account failed:" + e.message);
    }
};

load();

module.exports = "";