let fs = require("fs");
let response = require("./response");
let sizeOf = require('image-size');
module.exports = {
    getNames: (req, res) => {
        let dirArr = [];
        global.mysql.excuteQuery({
            sqlCommand: "select id from game where name='" + req.body.name + "'"
        }).then(d => {
            let id = d[0].id;
            let isLandscape = true;
            try {
                dirArr = fs.readdirSync("client/data/game/" + id + "/");
                dirArr = dirArr.map((d1, i) => {
                    if (i == 0) {
                        let size = sizeOf("client/data/game/" + id + "/" + d1);
                        isLandscape = size.width > size.height;
                    }
                    d1 = {id: id, imageName: d1};
                    return d1;
                });
            } catch (e) {

            }
            res.send({success: "true", message: {dir: dirArr, isLandscape: isLandscape}});
        }).catch(d => {
            res.send({success: "true", message: {dir: dirArr, isLandscape: isLandscape}});
        });
    }
};