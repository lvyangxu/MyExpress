"use strict";

var table = require("./table");
var tableMap = require("./tableMap");
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
    if (table[action] == undefined || tableMap[action] == undefined) {
        console.log("unknown action:table/" + name + "/" + action);
        response.fail(res, "unknown action");
    } else {
        if (action == "dataMap") {
            response.fail(res, "unknown action");
        } else {
            var map = tableMap[action](req, res, name);
            table[action](req, res, name, map);
        }
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
        } else {}
    }
});

module.exports = router;

//# sourceMappingURL=route.js.map