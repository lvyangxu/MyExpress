let fs = require("fs");
let table = require("./table");
let tableConfig = fs.existsSync("server/js/tableConfig.js") ? require("./tableConfig") : "";
let response = require("./response");
let account = require("./account");

let express = require('express');
let router = express.Router();

//upload
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
let upload = multer({storage: storage});

//default page
router.route('/').get(function (req, res) {
    res.redirect('/login/');
});

//account router
router.route("/account/:action").post((req, res, next)=> {
    let action = req.params.action;
    if (!account.hasOwnProperty(action)) {
        console.log("unknown action:account " + action);
        response.fail(res, "unknown action");
    } else {
        account[action](req, res);
    }
});

//table router
router.route("/table/:name/:action").post(upload.any(), (req, res, next)=> {
    let action = req.params.action;
    let name = req.params.name;
    if (!table.hasOwnProperty(action)) {
        console.log("unknown action:table/" + name + "/" + action);
        response.fail(res, "unknown action");
    } else {
        //find config by table id
        let config = tableConfig(req).find(d=> {
            return d.id == name;
        });
        if (config == undefined) {
            response.fail(res, "unknown table " + name);
            return;
        }

        //do table action
        table[action](req, res, config);
    }
});

//controller router
router.route("/controller/:name/:action").post(upload.any(), (req, res, next)=> {
    let action = req.params.action;
    let name = req.params.name;
    try {
        let controller = require("./" + name);
        let func = controller[action];
        if (func == undefined) {
            response.fail(res, "action not found");
            return;
        }
        func(req, res);
    } catch (e) {
        if (e.code == "MODULE_NOT_FOUND") {
            response.fail(res, "controller not found");
        } else {
            response.fail(res, e.code);
        }
    }
});

module.exports = router;
