let tcpServer = require("../karl-tcp-server/index");
require("babel-polyfill");
let tcpServer1 = new tcpServer({
    port: 80,
    hostname: "localhost",
    startCallback: () => {
        console.log("tcp server start");
    },
    errorCallback: d => {
        console.log("tcp error:" + d);
    },
    connectCallback: d => {
        let s = () => {
            tcpServer1.send(d, "haha");
            setTimeout(s, 5000);
        };
        s();

    }
});

tcpServer1.listen();





