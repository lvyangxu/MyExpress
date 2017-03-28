"use strict";

var tcpServer = require("../karl-tcp-server/index");
require("babel-polyfill");
var tcpServer1 = new tcpServer({
    port: 80,
    hostname: "localhost",
    startCallback: function startCallback() {
        console.log("tcp server start");
    },
    errorCallback: function errorCallback(d) {
        console.log("tcp error:" + d);
    },
    connectCallback: function connectCallback(d) {
        var s = function s() {
            tcpServer1.send(d, "haha");
            setTimeout(s, 5000);
        };
        s();
    }
});

tcpServer1.listen();

//# sourceMappingURL=server.js.map