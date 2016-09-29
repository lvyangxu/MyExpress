let table = require("./table");
let tableMap = require("./tableMap");
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
    switch (action) {
        case "login":
            account.login(req, res);
            break;
        case "logout":
            account.logout(req, res);
            break;
        case "getCookieName":
            account.getCookieName(req, res);
            break;
        default:
            response.fail(res, "unknown action");
            break;
    }
});

//table router
router.route("/table/:name/:action").post(upload.any(), (req, res, next)=> {
    let action = req.params.action;
    let name = req.params.name;
    if (table[action] == undefined || tableMap[action] == undefined) {
        console.log("unknown action:table/" + name + "/" + action);
        response.fail(res, "unknown action");
    } else {
        if (action == "dataMap") {
            response.fail(res, "unknown action");
        } else {
            let map = tableMap[action](req, res, name);
            table[action](req, res, name, map);
        }
    }
});

//controller router
router.route("/controller/:name/:action").post(upload.any(), (req, res, next)=> {
    let action = req.params.action;
    let name = req.params.name;
    try {
        let controller = require("./"+name);
        let func = controller[action];
        if(func == undefined){
            response.fail(res,"action not found");
            return;
        }
        func(req,res);
    } catch (e) {
        if (e.code == "MODULE_NOT_FOUND") {
             response.fail(res,"controller not found");
        }else{

        }
    }
});

module.exports = router;
