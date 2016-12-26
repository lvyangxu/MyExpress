let response = require("./response");
module.exports = (req, res, next)=> {
    let urlArr = req.originalUrl.split("/");
    //只对table和controller做jwt认证
    if (urlArr.length >= 2 && (urlArr[1] == "table" || urlArr[1] == "controller")) {
        if (!req.body.hasOwnProperty("jwt")) {
            console.log("lack of jwt param");
            response.fail(res, "unauthorized");
            return;
        }

        try {
            let {header, payload, signature} = JSON.parse(global.jwt.decryptJWT(req.body.jwt));
            header = JSON.parse(header);
            payload = JSON.parse(payload);
            if (!header.hasOwnProperty("exp") || !payload.hasOwnProperty("exp") || header.exp != payload.exp) {
                console.log("header exp != payload.exp");
                response.fail(res, "unauthorized");
                return;
            }
            let isValidHeader = header.alg == "aes192" && header.typ != "JWT" && header.exp > new Date().getTime();
            if (!isValidHeader) {
                console.log("header is not valid");
                response.fail(res, "unauthorized");
                return;
            }
            let isValidPayload = payload.user == global.accountConfig.username && payload.exp > new Date().getTime();
            if (!isValidPayload) {
                console.log("payload is not valid");
                response.fail(res, "unauthorized");
                return;
            }
            let isValidSignature = signature == global.jwt.encrypt(header + "." + payload);
            if (!isValidSignature) {
                console.log("signature is not valid");
                response.fail(res, "unauthorized");
                return;
            }
            next();
        } catch (e) {
            console.log("decrypt error:" + e);
            response.fail(res, "unauthorized");
        }
    } else {
        next();
    }


};