"use strict";

module.exports = function (req, res, next) {
    for (var k in req.query) {
        if (req.query[k].includes(",")) {
            req.query[k] = req.query[k].split(",").map(function (d) {
                return d.urlBase64Decode();
            });
        } else {
            req.query[k] = req.query[k].urlBase64Decode();
        }
    }
    for (var _k in req.body) {
        if (req.body[_k].includes(",")) {
            req.body[_k] = req.body[_k].split(",").map(function (d) {
                return d.urlBase64Decode();
            });
        } else {
            req.body[_k] = req.body[_k].urlBase64Decode();
        }
    }
    next();
};

//# sourceMappingURL=param.js.map