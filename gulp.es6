var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var replace = require('gulp-replace');

let project = "Review";
let viewModules = ["login", "display", "manage"];
let mysqlConfig = {
    user: "root",
    password: "root",
    database: "Review"
};
let accountConfig = {
    username: "radiumme",
    password: "radiumme",
    usernameCookie: "reviewUsername",
    passwordCookie: "reviewPassword",
    loginRedirect:"display"
};

gulp.task("build", ["build-util", "build-server", "build-client"], ()=> {


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
        .pipe(replace(/\{user}/g, mysqlConfig.user))
        .pipe(replace(/\{password}/g, mysqlConfig.password))
        .pipe(replace(/\{database}/g, mysqlConfig.database))
        .pipe(gulp.dest("dist/" + project + "/server/config"));
    gulp.src("src/Common/Config/account.xml")
        .pipe(replace(/\{username}/g, accountConfig.username))
        .pipe(replace(/\{password}/g, accountConfig.password))
        .pipe(replace(/\{usernameCookie}/g, accountConfig.usernameCookie))
        .pipe(replace(/\{passwordCookie}/g, accountConfig.passwordCookie))
        .pipe(replace(/\{loginRedirect}/g, accountConfig.loginRedirect))
        .pipe(gulp.dest("dist/" + project + "/server/config"));
});

gulp.task("build-util", ()=> {
    //component
    let componentArr = ["login","radio"];
    componentArr.map(d=>{
        gulp.src("src/Common/Components/"+d+"/*.js")
            .pipe(gulp.dest("dist/" + project + "/util"));
    });


    //util
    gulp.src("src/Common/Utils/*.js")
        .pipe(gulp.dest("dist/" + project + "/util"));

});

gulp.task("build-client", ()=> {
    //views js
    gulp.src(["src/Common/Views/*/*.js", "src/Projects/" + project + "/Views/*/*.js"])
        .pipe(gulp.dest("dist/" + project + "/browserify"));
    //views html minify
    gulp.src(["src/Common/Views/*/*.html", "src/Projects/" + project + "/Views/*/*.html"])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/" + project + "/client"));
    //views css bundle and minify
    viewModules.map(d=> {
        let srcArr = [];
        switch (d) {
            case "login":
                srcArr = ["src/Common/Views/" + d + "/*.css", "src/Common/Components/login/login.css"]
                break;
            case "display":
                srcArr = ["src/Projects/" + project + "/Views/" + d + "/*.css", "src/Common/Components/*/*.css", "src/Common/Views/common/*.css"];
                break;
            case "manage":
                srcArr = ["src/Projects/" + project + "/Views/" + d + "/*.css", "src/Common/Components/*/*.css", "src/Common/Views/common/*.css"];
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
});

gulp.task("release", ()=> {
    //client js minify
    gulp.src("dist/" + project + "/client/*/bundle.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/" + project + "/client"));
});
