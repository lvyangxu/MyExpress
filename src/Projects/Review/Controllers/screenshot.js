"use strict";

var fs = require("fs");
var response = require("./response");
module.exports = {
    getNames: function getNames(req, res) {
        var dirArr = [];
        try {
            dirArr = fs.readdirSync("client/data/game/" + req.body.name + "/");
            dirArr = dirArr.map(function (d) {
                d = { game: req.body.name, imageName: d };
                return d;
            });
        } catch (e) {
            console.log("read dir failed:" + req.body.name);
            console.log(e);
        }
        res.send({ success: "true", message: dirArr });
    }
};

//# sourceMappingURL=screenshot.js.map