let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
require('babel-polyfill');
let app = express();

//my init
require("./init");

// view engine setup
app.set('views', path.join(__dirname, "../../client"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, "../../client")));
//certbot https认证
app.use("/.well-known", express.static(path.join(__dirname, "../../.well-known")));

//log morgan for http request console
let morgan = require('morgan');
app.use(morgan('dev'));

//body parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type:"application/json"}));

//cookie and session
// let cookieParser = require('cookie-parser');
// let cookieSession = require('cookie-session');
// app.use(cookieParser());
// app.use(cookieSession({
//     keys: ["username", "password"]
// }));
// app.use((req, res, next)=> {
//     req.cookieSession = cookieSession;
//     next();
// });

//authenticate
let authenticate = require("./authenticate");
app.use(authenticate);

//route
let route = require("./route");
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
