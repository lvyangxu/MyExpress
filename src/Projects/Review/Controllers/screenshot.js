"use strict";

var fs = require("fs");
var response = require("./response");
module.exports = {
    getNames: function getNames(req, res) {
        var dirArr = [];
        global.mysql.excuteQuery("select id from game where name='" + req.body.name + "'").then(function (d) {
            var id = d[0].id;
            try {
                dirArr = fs.readdirSync("client/data/game/" + id + "/");
                dirArr = dirArr.map(function (d1) {
                    d1 = { id: id, imageName: d1 };
                    return d1;
                });
            } catch (e) {
                console.log("read dir failed:" + req.body.id);
                console.log(e);
            }
            res.send({ success: "true", message: dirArr });
        }).catch(function (d) {
            res.send({ success: "true", message: dirArr });
        });
    }
};

//# sourceMappingURL=screenshot.js.map