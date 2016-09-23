"use strict";

module.exports = {
    success: function success(res, message) {
        message = message == undefined ? "" : message;
        res.send({ success: "true", message: message });
    },
    fail: function fail(res, message) {
        message = message == undefined ? "" : message;
        res.send({ success: "false", message: message });
    }
};

//# sourceMappingURL=response.js.map