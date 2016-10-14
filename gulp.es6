var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');
var browserify = require('gulp-browserify');

let project = "Maintence";
// let project = "Review";
let isProduction = false;
let viewModules = {
    Review: ["login", "display", "manage"],
    Maintence:["login","manage"]
};
let mysqlConfig = {
    Review: {
        user: "root",
        password: "root",
        database: "Review"
    },
    Maintence:{
        user: "root",
        password: "root",
        database: "MaintenceSystem"
    }
};
let accountConfig = {
    Review: {
        username: "radiumme",
        password: "radiumme",
        usernameCookie: "reviewUsername",
        passwordCookie: "reviewPassword",
        loginRedirect: "display"
    },
    Maintence:{
        username: "radiumme",
        password: "radiumme",
        usernameCookie: "maintenceUsername",
        passwordCookie: "maintencePassword",
        loginRedirect: "manage"
    }
};
process.env.NODE_ENV = (isProduction) ? "production" : "development";
if (isProduction) {
    mysqlConfig.Review.password = "kMXWy16GHVXlsEhXtwKh";
    mysqlConfig.Maintence.password = "kMXWy16GHVXlsEhXtwKh";
}

gulp.task("build", ["build-util", "build-server","build-client"], ()=> {
    // gulp.task();

});

gulp.task("build-server", ()=> {
    //app
    gulp.src(["src/app.js", "src/bin/www"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //middleware
    gulp.src(["src/Common/MiddleWare/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //models
    gulp.src(["src/Common/Models/*.js", "src/Projects/" + project + "/Models/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));
    //config
    gulp.src("src/Common/Config/mysql.xml")
        .pipe(replace(/\{user}/g, mysqlConfig[project].user))
        .pipe(replace(/\{password}/g, mysqlConfig[project].password))
        .pipe(replace(/\{database}/g, mysqlConfig[project].database))
        .pipe(gulp.dest("dist/" + project + "/server/config"));
    gulp.src("src/Common/Config/account.xml")
        .pipe(replace(/\{username}/g, accountConfig[project].username))
        .pipe(replace(/\{password}/g, accountConfig[project].password))
        .pipe(replace(/\{usernameCookie}/g, accountConfig[project].usernameCookie))
        .pipe(replace(/\{passwordCookie}/g, accountConfig[project].passwordCookie))
        .pipe(replace(/\{loginRedirect}/g, accountConfig[project].loginRedirect))
        .pipe(gulp.dest("dist/" + project + "/server/config"));
    //controller
    gulp.src(["src/Common/Controllers/*.js", "src/Projects/" + project + "/Controllers/*.js"])
        .pipe(gulp.dest("dist/" + project + "/server/js"));

});

gulp.task("build-util", ()=> {
    //component
    let componentArr = ["login", "radio", "select", "table"];
    componentArr.map(d=> {
        gulp.src("src/Common/Components/" + d + "/*.js")
            .pipe(gulp.dest("dist/" + project + "/util"));
    });

    //util
    gulp.src("src/Common/Utils/*.js")
        .pipe(gulp.dest("dist/" + project + "/util"));

});

gulp.task("build-client", ()=> {
    //views js
    gulp.src(["src/Common/Views/*/*.js", "src/Projects/" + project + "/Views/*/*.js"])
        .pipe(gulp.dest("dist/" + project + "/browserify"))
        .on("end",()=>{
            if (isProduction) {
                gulp.src("dist/" + project + "/browserify/*/main.js")
                    .pipe(browserify({
                        insertGlobals: true,
                        debug: !gulp.env.production
                    }))
                    .pipe(rename({basename: "bundle"}))
                    .pipe(gulp.dest("dist/" + project + "/browserify"))
                    .pipe(uglify())
                    .pipe(gulp.dest("dist/" + project + "/client"));
            }else{
                gulp.src("dist/" + project + "/browserify/*/main.js")
                    .pipe(browserify({
                        insertGlobals: true,
                        debug: !gulp.env.production
                    }))
                    .pipe(rename({basename: "bundle"}))
                    .pipe(gulp.dest("dist/" + project + "/browserify"))
                    .pipe(gulp.dest("dist/" + project + "/client"));
            }
        });


    //views html minify
    gulp.src(["src/Common/Views/*/*.html", "src/Projects/" + project + "/Views/*/*.html"])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/" + project + "/client"));
    //views css bundle and minify
    viewModules[project].map(d=> {
        let srcArr = [];
        switch (d) {
            case "login":
                srcArr = ["src/Common/Views/" + d + "/*.css", "src/Common/Components/login/login.css"]
                break;
            case "display":
                srcArr = ["src/Projects/" + project + "/Views/" + d + "/*.css",
                    "src/Common/Components/*/*.css",
                    "src/Common/Views/common/*.css",
                    "src/Projects/" + project + "/Views/common/*.css"
                ];
                break;
            case "manage":
                srcArr = ["src/Projects/" + project + "/Views/" + d + "/*.css",
                    "src/Common/Components/*/*.css",
                    "src/Common/Views/common/*.css",
                    "src/Projects/" + project + "/Views/common/*.css"
                ];
                break;
        }
        gulp.src(srcArr)
            .pipe(concatCss("bundle.css", {rebaseUrls: false}))
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest("dist/" + project + "/client/" + d));
    });
    //icon
    gulp.src("src/Common/Icon/favicon.ico")
        .pipe(gulp.dest("dist/" + project + "/client"));
    //fontawesome
    gulp.src("src/Common/Fontawesome/*/*")
        .pipe(gulp.dest("dist/" + project + "/client/fontawesome"));
    //package.json
    gulp.src("package.json")
        .pipe(gulp.dest("dist/" + project));


});