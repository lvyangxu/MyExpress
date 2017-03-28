let response = require("./response");
let express = require('express');
let router = express.Router();
require("karl-extend");

//controller router
router.route("/data/collection").get((req, res, next) => {
    let json = {};
    let keys = ["agent", "channel", "os", "deviceid", "scope", "point", "timestamp", "dataBuryVersion"];
    let isValid = keys.every(d => {
        return req.query[d] != undefined;
    });
    if (isValid) {
        let token1 = req.query.token;
        token1 = token1.urlDecode().base64Decode();
        token1 = token1.toLowerCase();
        let token2 = keys.map(d=>{
            d = req.query[d].urlDecode().base64Decode();
            return d;
        }).join("_");
        token2 = token2.md5Encode();

        if(token1 == token2){
            for (let key in req.query) {
                if(key != "token"){
                    json[key] = req.query[key].urlDecode().base64Decode();
                }
            }
            json.ip = req.ip;
            global.log.server.info(JSON.stringify(json));
        }
    }
    res.contentType("application/xml")
    res.send("<root></root>");
});

module.exports = router;
