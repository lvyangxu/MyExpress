"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//extend
require("karl-extend");

//dir
require("./dirInit");

//log4js
require("./logInit");

//account and mysql config
require("./configInit");

var net = require("net");

var tcp = function () {
    function tcp(ip, port) {
        _classCallCheck(this, tcp);

        var server = net.Server();
        server.listen(port, ip);
        console.log('Server listening on ' + server.address().address + ':' + server.address().port);
    }

    _createClass(tcp, [{
        key: "send",
        value: function send() {
            var promise = new Promise(function (resolve, reject) {});
            return promise;
        }
    }, {
        key: "receive",
        value: function receive() {
            var promise = new Promise(function (resolve, reject) {});
            return promise;
        }
    }]);

    return tcp;
}();

module.exports = tcp;

module.exports = "";

//# sourceMappingURL=init.js.map