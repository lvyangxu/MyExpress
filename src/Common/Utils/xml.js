'use strict';

var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();
module.exports = {
    read: function read(path) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, function (err, data) {
                if (err) {
                    reject("read xml error:" + err);
                    return;
                }
                parser.parseString(data, function (err1, result) {
                    if (err1) {
                        reject("parse xml error:" + err1);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
    }
};

//# sourceMappingURL=xml.js.map