var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// require('babel-polyfill');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, "../../client"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, "../../client")));

//log
var logger = require('morgan');
app.use(logger('dev'));

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//cookie and session
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
app.use(cookieParser());
app.use(cookieSession({
    keys: ["username", "password"]
}));
app.use((req, res, next)=> {
    req.cookieSession = cookieSession;
    next();
});

//string extend
let myString = require("../../util/myString");
myString.extend();

//param url and base64 decode
let param = require("./param");
app.use(param);

let session = require("./session");
app.use(session);

//route
let route = require("./route");
app.use("/", route);

//upload dir
let fs = require("fs");
if(!fs.existsSync("./server/upload/")){
    fs.mkdirSync("./server/upload/");
}

//global config
let xml = require("../../util/xml");
let promise1 = xml.read("./server/config/account.xml");
let promise2 = xml.read("./server/config/mysql.xml");
Promise.all([promise1, promise2]).then(d=> {
    global.accountConfig = {
        username: d[0].root.username[0],
        password: d[0].root.password[0],
        usernameCookie: d[0].root.usernameCookie[0],
        passwordCookie: d[0].root.passwordCookie[0],
        loginRedirect: d[0].root.loginRedirect[0]
    };


    let mysql = require("../../util/mysql");
    mysql.init("localhost", d[1].root.user[0], d[1].root.password[0], d[1].root.database[0]);
    console.log("mysql init success");

    mysql.excuteQuery("show tables", {}).then(function (d) {
        let tableNames = d.map(d1=> {
            let tableName;
            for (let k in d1) {
                tableName = d1[k];
                break;
            }
            return tableName;
        });
        let descTablePromise = [];
        tableNames.map(d1=> {
            descTablePromise.push(mysql.excuteQuery("desc " + d1));
        });
        global.dbStruct = [];
        Promise.all(descTablePromise).then(d1=> {
            for (let i = 0; i < d1.length; i++) {
                let tableName = tableNames[i];
                let tableDesc = d1[i];
                global.dbStruct.push({id: tableName, fields: tableDesc});
            }
            console.log("get database structure successfully");
        }).catch(d1=> {
            console.log("get table structure failed:")
            console.log(d1);
        });
    }).catch(function (d) {
        console.log("get database structure failed:");
        console.log(d);
    });

}).catch(d=> {
    console.log(d);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log("server error:");
        console.log(err);
        res.render('error/');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log("server error:");
    console.log(err);
    res.render('error/');
});


module.exports = app;
