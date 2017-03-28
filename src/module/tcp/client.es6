let tcpClient = require("../karl-tcp-client/index");
require("babel-polyfill");

let tcpClient1 = new tcpClient({
    port: 80,
    hostname: "127.0.0.1",
    endCallback: () => {
        console.log("tcp client connect end");
    },
    receiveCallback:(d)=>{
        console.log("receive server message:"+d);
    }
});

tcpClient1.connect();