"use strict";

var fs = require("fs");
var response = require("./response");
var sizeOf = require('image-size');
module.exports = {
    getNames: function getNames(req, res) {
        var dirArr = [];
        global.mysql.excuteQuery("select id from game where name='" + req.body.name + "'").then(function (d) {
            var id = d[0].id;
            var isLandscape = true;
            try {
                dirArr = fs.readdirSync("client/data/game/" + id + "/");
                dirArr = dirArr.map(function (d1, i) {
                    if (i == 0) {
                        var size = sizeOf("client/data/game/" + id + "/" + d1);
                        isLandscape = size.width > size.height;
                    }
                    d1 = { id: id, imageName: d1 };
                    return d1;
                });
            } catch (e) {
                console.log("read dir failed:" + req.body.id);
                console.log(e);
            }
            res.send({ success: "true", message: { dir: dirArr, isLandscape: isLandscape } });
        }).catch(function (d) {
            res.send({ success: "true", message: { dir: dirArr, isLandscape: isLandscape } });
        });
    }
};

//# sourceMappingURL=screenshot.js.map