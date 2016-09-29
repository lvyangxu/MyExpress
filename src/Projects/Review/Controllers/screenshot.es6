let fs = require("fs");
let response = require("./response");
module.exports = {
    getNames: (req, res)=> {
        let dirArr = [];
        global.mysql.excuteQuery("select id from game where name='" + req.body.name + "'").then(d=> {
            let id = d[0].id;
            try {
                dirArr = fs.readdirSync("client/data/game/" + id + "/");
                dirArr = dirArr.map(d1=> {
                    d1 = {id: id, imageName: d1};
                    return d1;
                });
            } catch (e) {
                console.log("read dir failed:" + req.body.id);
                console.log(e);
            }
            res.send({success: "true", message: dirArr});
        }).catch(d=> {
            res.send({success: "true", message: dirArr});
        });


    }
}