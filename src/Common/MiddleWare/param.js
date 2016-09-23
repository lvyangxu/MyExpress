"use strict";

module.exports = function (req, res, next) {
    for (var k in req.query) {
        req.query[k] = req.query[k].urlBase64Decode();
    }
    for (var _k in req.body) {
        req.body[_k] = req.body[_k].urlBase64Decode();
    }
    next();
};

//# sourceMappingURL=param.js.map