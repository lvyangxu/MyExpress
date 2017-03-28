let response = require("./response");
let express = require('express');
let router = express.Router();
require("karl-extend");

//controller router
router.route("/data/collection").post((req, res, next) => {
    global.log.server.info(req.headers);
    global.log.server.info(req.body);
    res.send({en:"0"});
});

router.route("/data/collection").get((req, res, next) => {
    res.send({en:"1"});
});

module.exports = router;
