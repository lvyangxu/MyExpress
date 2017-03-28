"use strict";

var tcpClient = require("../karl-tcp-client/index");
require("babel-polyfill");

var tcpClient1 = new tcpClient({
    port: 80,
    hostname: "127.0.0.1",
    endCallback: function endCallback() {
        console.log("tcp client connect end");
    },
    receiveCallback: function receiveCallback(d) {
        console.log("receive server message:" + d);
    }
});

tcpClient1.connect();

//# sourceMappingURL=client.js.map