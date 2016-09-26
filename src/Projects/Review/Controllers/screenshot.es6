let fs = require("fs");
let response = require("./response");
module.exports = {
    getNames: (req, res)=> {
        let dirArr = [];
        try {
            dirArr = fs.readdirSync("client/data/game/" + req.body.name + "/");
            dirArr = dirArr.map(d=> {
                d = {game: req.body.name, imageName: d};
                return d;
            });
        } catch (e) {
            console.log("read dir failed:" + req.body.name);
            console.log(e);
        }
        res.send({success: "true", message: dirArr});
    }
}