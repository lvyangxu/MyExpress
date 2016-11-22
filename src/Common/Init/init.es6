//extend
require("karl-extend");

//dir
require("./dirInit");

//log4js
require("./logInit");

//account and mysql config
require("./configInit");

let net = require("net");

class tcp {
    constructor(ip, port) {
        let server = net.Server();
        server.listen(port, ip);
        console.log('Server listening on ' +
            server.address().address + ':' + server.address().port);
    }

    send() {
        let promise = new Promise((resolve, reject) => {

        });
        return promise;
    }

    receive() {
        let promise = new Promise((resolve, reject) => {

        });
        return promise;
    }

}

module.exports = tcp;

module.exports = "";