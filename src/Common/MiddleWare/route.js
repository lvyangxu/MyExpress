"use strict";

var table = require("./table");
var tableConfig = require("./tableConfig");
var response = require("./response");
var account = require("./account");

var express = require('express');
var router = express.Router();

//upload
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, './server/upload/');
    },
    filename: function filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

//default page
router.route('/').get(function (req, res) {
    res.redirect('/login/');
});

//account router
router.route("/account/:action").post(function (req, res, next) {
    var action = req.params.action;
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
router.route("/table/:name/:action").post(upload.any(), function (req, res, next) {
    var action = req.params.action;
    var name = req.params.name;
    if (!table.hasOwnProperty(action)) {
        console.log("unknown action:table/" + name + "/" + action);
        response.fail(res, "unknown action");
    } else {
        //find config by table id
        var config = tableConfig(req).find(function (d) {
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
router.route("/controller/:name/:action").post(upload.any(), function (req, res, next) {
    var action = req.params.action;
    var name = req.params.name;
    try {
        var controller = require("./" + name);
        var func = controller[action];
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

//# sourceMappingURL=route.js.map