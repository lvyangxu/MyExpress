var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');
var webpack = require("webpack");
var webpackStream = require('webpack-stream');
var hash_src = require("gulp-hash-src");
let xml = require("karl-xml");
var fs = require('fs');
var path = require('path');

let project = process.argv[6].replace("--project=", "");

let isProduction = false;
let mysqlConfig = {
    Review: {
        user: "root",
        password: "root",
        database: "Review"
    },
    Maintence: {
        user: "root",
        password: "root",
        database: "MaintenceSystem"
    },
    G02log: {
        user: "root",
        password: "root",
        database: "G02log"
    },
    G02DataAnalysis: {
        host: ["localhost", "localhost", "localhost"],
        user: ["root", "root", "root"],
        password: ["root", "root", "root"],
        database: ["log_nuclear", "raw", "res", "mid"]
    }
};
let accountConfig = {
    Review: {
        username: "business",
        password: "business",
        loginRedirect: "display"
    },
    Maintence: {
        username: "radiumme",
        password: "radiumme",
        loginRedirect: "manage"
    },
    G02log: {
        username: "radiumme",
        password: "radiumme",
        loginRedirect: "display"
    },
    G02DataAnalysis: {
        username: "radiumme",
        password: "radiumme",
        loginRedirect: "display"
    }
};
let portConfig = {
    G02DataAnalysis: 3001
};

process.env.NODE_ENV = (isProduction) ? "production" : "development";
if (isProduction) {
    mysqlConfig.Review.password = "kMXWy16GHVXlsEhXtwKh";
    mysqlConfig.Maintence.password = "kMXWy16GHVXlsEhXtwKh";
    mysqlConfig.G02log.password = "kMXWy16GHVXlsEhXtwKh";
    mysqlConfig.G02DataAnalysis.user = ["nuclear", "nuclear", "nuclear"];
    mysqlConfig.G02DataAnalysis.password = ["wozhinengkan", "wozhinengkan", "wozhinengkan"];
}

gulp.task("build", ["async-task", "sync-task"], () => {
    // gulp.task();
    console.log("all done");
});

/**
 * 可异步执行的任务
 */
gulp.task("async-task", () => {
    //app
    gulp.src("src/app.js")
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    if(isProduction && portConfig.hasOwnProperty(project)){
        gulp.src("src/bin/www")
            .pipe(replace(/3000/g, portConfig[project]))
            .pipe(gulp.dest("dist/" + project + "/server/js"));
    }else{
        gulp.src("src/bin/www")
            .pipe(gulp.dest("dist/" + project + "/server/js"));
    }

    //init
    gulp.src(["src/Common/Init/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //middleware
    gulp.src(["src/Common/MiddleWare/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //models
    gulp.src(["src/Common/Models/*.js", "src/Projects/" + project + "/Models/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //config
    gulp.src([`src/Projects/${project}/Config/*`])
        .pipe(gulp.dest(`dist/${project}/server/config`));

    if (Array.isArray(mysqlConfig[project].user)) {
        let json = mysqlConfig[project];
        if (!json.hasOwnProperty("host")) {
            let hostArr = [];
            for (let i = 0; i < json.user.length; i++) {
                hostArr.push("localhost");
            }
            json.host = hostArr;
        }

        let mysqlPath = "./dist/" + project + "/server/config/mysql.xml";
        xml.write(json, mysqlPath);
    } else {
        //config
        let stream = gulp.src("src/Common/Config/mysql.xml");
        if (mysqlConfig[project].hasOwnProperty("host")) {
            stream = stream.pipe(replace(/\{host}/g, mysqlConfig[project].host));
        } else {
            stream = stream.pipe(replace(/\{host}/g, "localhost"));
        }
        stream = stream.pipe(replace(/\{user}/g, mysqlConfig[project].user))
            .pipe(replace(/\{password}/g, mysqlConfig[project].password))
            .pipe(replace(/\{database}/g, mysqlConfig[project].database));
        stream.pipe(gulp.dest("dist/" + project + "/server/config"));
    }

    gulp.src("src/Common/Config/account.xml")
        .pipe(replace(/\{project}/g, project))
        .pipe(replace(/\{username}/g, accountConfig[project].username))
        .pipe(replace(/\{password}/g, accountConfig[project].password))
        .pipe(replace(/\{loginRedirect}/g, accountConfig[project].loginRedirect))
        .pipe(gulp.dest("dist/" + project + "/server/config"));

    //controller
    gulp.src(["src/Common/Controllers/*.js", "src/Projects/" + project + "/Controllers/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //util
    gulp.src("src/Common/Utils/*.js")
        .pipe(gulp.dest("dist/" + project + "/util"));
    //icon
    gulp.src("src/Common/Icon/favicon.ico")
        .pipe(gulp.dest("dist/" + project + "/client"));
    //package.json
    gulp.src("package.json")
        .pipe(replace(/"name": "MyExpress"/g, "\"name\":\"" + project + "\""))
        .pipe(gulp.dest("dist/" + project));
    //html
    gulp.src(["src/Common/Views/*/*.html", "src/Projects/" + project + "/Views/*/*.html"])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(hash_src({build_dir: "dist/" + project + "/client", src_path: "src/Projects/" + project + "/Views"}))
        .pipe(gulp.dest("dist/" + project + "/client"));
});

let clientPath = "dist/" + project + "/client";
let views = [];

/**
 * 必须同步执行的任务
 */
gulp.task("sync-task", ["compile-jsx"], () => {
    //最终删除不需要的文件
    return del([clientPath + "/common/", clientPath + "/*/*.css", clientPath + "/*/*.scss", clientPath + "/*/*.jsx", "!" + clientPath + "/*/bundle.css"]);

});

gulp.task("move-table", ()=> {
    let stream = gulp.src(["src/index.*"])
        .pipe(gulp.dest("dist/" + project + "/client/table"));
    return stream;
});

/**
 * 移动.jsx文件
 */
gulp.task("move-jsx", ["move-table"], () => {
    let stream = gulp.src(["src/Common/Views/*/*.jsx", "src/Projects/" + project + "/Views/*/*.jsx"])
        .pipe(gulp.dest("dist/" + project + "/client"));
    return stream;
});

/**
 * 移动.scss文件
 */
gulp.task("move-scss", () => {
    let stream = gulp.src(["src/Common/Views/*/*.scss", "src/Projects/" + project + "/Views/*/*.scss"])
        .pipe(gulp.dest("dist/" + project + "/client"));
    return stream;
});

/**
 * 获取所有视图的名称
 */
gulp.task("get-views", ["move-jsx", "move-scss"], ()=> {
    //get all view
    views = fs.readdirSync(clientPath).filter(d=> {
        return fs.statSync(path.join(clientPath, d)).isDirectory();
    });
});

/**
 * 编译.scss
 */
gulp.task("compile-scss", ["get-views"], () => {
    let promiseArr = [];
    views.forEach(d=> {
        let promise = new Promise((resolve, reject)=> {
            gulp.src(clientPath + "/" + d + "/*.scss")
                .pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest(clientPath + "/" + d))
                .on("end", ()=> {
                    resolve();
                });
        });
        promiseArr.push(promise);
    });
    return Promise.all(promiseArr);
});

/**
 * 合并css
 */
gulp.task("concat-css", ["compile-scss"], ()=> {
    let promiseArr = [];
    views.forEach(d=> {
        let promise = new Promise((resolve, reject)=> {
            gulp.src([clientPath + "/" + d + "/*.css", "dist/" + project + "/client/common/*.css"])
                .pipe(concatCss("bundle.css", {rebaseUrls: false}))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest("dist/" + project + "/client/" + d))
                .on("end", ()=> {
                    resolve();
                });
        });
        promiseArr.push(promise);
    });
    return Promise.all(promiseArr);
})

/**
 * 编译jsx文件
 */
gulp.task("compile-jsx", ["concat-css"], ()=> {
    let webpackConfig = require('./webpack.config.js');
    if(isProduction){
        //压缩
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    let promiseArr = [];
    views.forEach(d=> {
        let promise = new Promise((resolve, reject)=> {
            gulp.src(clientPath + "/" + d + "/main.jsx")
                .pipe(webpackStream(webpackConfig))
                .pipe(gulp.dest(clientPath + "/" + d))
                .on("end", ()=> {
                    resolve();
                });
        });
        promiseArr.push(promise);
    });
    return Promise.all(promiseArr);
})