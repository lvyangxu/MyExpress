"use strict";

var Koa = require('koa');
var app = new Koa();

//koa-router
var koaRouter = require("koa-router")();
app.use(koaRouter.routes()).use(koaRouter.allowedMethods());
global.router = koaRouter;

//koa-static
var serve = require("koa-static");
app.use(serve("client"));

var xml = require("../../util/xml");
var mysql = require("../../util/mysql");

//init mysql
xml.read("./server/config/mysql.xml").then(function (d) {
    mysql.init("localhost", d.root.user[0], d.root.password[0], d.root.database[0]);
    console.log("mysql init success");

    var route = require("./route");
    app.use(route);

    app.listen(3000);
}).catch(function (d) {
    throw d;
});

// response
//     app.use(ctx => {
//         ctx.body = 'Hello Koa';
//     });

//# sourceMappingURL=main1.js.map