'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
require('babel-polyfill');
var app = express();

//my init
require("./init");

// view engine setup
app.set('views', path.join(__dirname, "../../client"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, "../../client")));

//log morgan for http request console
var morgan = require('morgan');
app.use(morgan('dev'));

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

//cookie and session
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
app.use(cookieParser());
app.use(cookieSession({
    keys: ["username", "password"]
}));
app.use(function (req, res, next) {
    req.cookieSession = cookieSession;
    next();
});

//session check
var session = require("./session");
app.use(session);

//route
var route = require("./route");
app.use("/", route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log("server error:");
    console.log(err);
    res.render('error/');
});

module.exports = app;

//# sourceMappingURL=app.js.map