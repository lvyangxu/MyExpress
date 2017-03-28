let gulp = require("gulp");
let exec = require("child_process").exec;
let rename = require("gulp-rename");
let htmlmin = require("gulp-htmlmin");
let del = require("del");
let sass = require("gulp-sass");
let concatCss = require("gulp-concat-css");
let cleanCSS = require("gulp-clean-css");
let replace = require("gulp-replace");
let webpack = require("webpack");
let webpackStream = require("webpack-stream");
let hash_src = require("gulp-hash-src");
let xml = require("karl-xml");
let fs = require("fs");
let path = require("path");

let project = process.argv[6].replace("--project=", "");

let config = {
    isProduction: true,
    mysql: {
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
            host: ["localhost", "localhost", "localhost", "localhost"],
            user: ["root", "root", "root", "root"],
            password: ["root", "root", "root", "root"],
            database: ["log_nuclear", "raw", "res", "mid"]
        },
        BI: {
            user: "root",
            password: "root",
            database: "BI"
        }
    },
    mongodb: {
        G02DataAnalysis: {
            host: ["localhost"],
            port: [27017],
            database: ["g02_log"]
        }
    },
    account: {
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
        },
        BI: {
            username: "radiumme",
            password: "radiumme",
            loginRedirect: "display"
        },
    },
    port: {
        G02DataAnalysis: 3001,
        G02Error: 3002
    }
};

if (config.isProduction) {
    config.mysql.Review.password = "kMXWy16GHVXlsEhXtwKh";
    config.mysql.Maintence.password = "kMXWy16GHVXlsEhXtwKh";
    config.mysql.G02log.password = "kMXWy16GHVXlsEhXtwKh";
    config.mysql.G02DataAnalysis.user = ["nuclear", "nuclear", "nuclear", "nuclear"];
    config.mysql.G02DataAnalysis.password = ["wozhinengkan", "wozhinengkan", "wozhinengkan", "wozhinengkan"];
}

gulp.task("build", ["move", "compile"], () => {
    console.log("gulp build done");
});

//移动
gulp.task("move", ["move-client", "move-server"]);
//清理上次生成的文件
gulp.task("clean-up", ()=> {
    let promise = new Promise((resolve, reject)=> {
        exec("netstat -ano | findstr 3000", (error, stdout) => {
            if (error) {
                //端口没有使用
                del.sync([`dist/${project}`]);
                resolve();
            } else {
                //端口已占用
                console.log("端口已占用,强行终止进程");
                let regex = /LISTENING +\d+/;
                let matchArr = stdout.match(regex);
                if (matchArr != null) {
                    let pid = matchArr[0];
                    pid = pid.replace(/ /g, "").replace(/LISTENING/g, "");
                    exec(`taskkill /f /pid ${pid}`, ()=> {
                        del.sync([`dist/${project}`]);
                        resolve();
                    });
                } else {
                    resolve();
                }
            }
        });
    });
    return promise;
});
//移动server部分
gulp.task("move-server", ["move-project-server", "move-package.json"]);
gulp.task("move-package.json", ["clean-up"], ()=> {
    let stream = gulp.src([
        `package.json`,
    ]).pipe(gulp.dest(`dist/${project}/`));
    return stream;
});
gulp.task("move-common-server", ["build-mysql", "build-mongodb", "build-account", "move-common-js"]);
//mysql.xml
gulp.task("build-mysql", ["clean-up"], ()=> {
    let promise = new Promise(resolve=> {
        if (config.mysql.hasOwnProperty(project)) {
            if (Array.isArray(config.mysql[project].user)) {
                let json = config.mysql[project];
                //host默认值为localhost
                if (!json.hasOwnProperty("host")) {
                    let hostArr = [];
                    for (let i = 0; i < json.user.length; i++) {
                        hostArr.push("localhost");
                    }
                    json.host = hostArr;
                }
                let path = `./dist/${project}/server/config/mysql.xml`;
                xml.write(json, path);
                resolve();
            } else {
                let stream = gulp.src("src/common/server/config/mysql.xml");
                if (config.mysql[project].hasOwnProperty("host")) {
                    stream = stream.pipe(replace(/\{host}/g, config.mysql[project].host));
                } else {
                    //host默认值为localhost
                    stream = stream.pipe(replace(/\{host}/g, "localhost"));
                }
                stream.pipe(replace(/\{user}/g, config.mysql[project].user))
                    .pipe(replace(/\{password}/g, config.mysql[project].password))
                    .pipe(replace(/\{database}/g, config.mysql[project].database))
                    .pipe(gulp.dest(`./dist/${project}/server/config`))
                    .on("end", ()=> {
                        resolve();
                    });
            }
        } else {
            resolve();
        }
    });
    return promise;
});
//mongodb.xml
gulp.task("build-mongodb", ["clean-up"], ()=> {
    let promise = new Promise(resolve=> {
        if (config.mongodb.hasOwnProperty(project)) {
            if (Array.isArray(config.mongodb[project].host)) {
                let json = config.mongodb[project];
                let path = `./dist/${project}/server/config/mongodb.xml`;
                xml.write(json, path);
                resolve();
            } else {
                gulp.src("src/common/server/config/mongodb.xml")
                    .pipe(replace(/\{host}/g, config.mongodb[project].host))
                    .pipe(replace(/\{port}/g, config.mongodb[project].port))
                    .pipe(replace(/\{database}/g, config.mongodb[project].database))
                    .pipe(gulp.dest(`./dist/${project}/server/config`))
                    .on("end", ()=> {
                        resolve();
                    });
            }
        } else {
            resolve();
        }
    });
    return promise;
});
//account.xml
gulp.task("build-account", ["clean-up"], ()=> {
    let promise = new Promise(resolve=> {
        if (config.account.hasOwnProperty(project)) {
            gulp.src("src/common/server/config/account.xml")
                .pipe(replace(/\{project}/g, project))
                .pipe(replace(/\{username}/g, config.account[project].username))
                .pipe(replace(/\{password}/g, config.account[project].password))
                .pipe(replace(/\{loginRedirect}/g, config.account[project].loginRedirect))
                .pipe(gulp.dest(`dist/${project}/server/config`))
                .on("end", ()=> {
                    resolve();
                });
        } else {
            resolve();
        }
    });
});
//移动js
gulp.task("move-common-js", ["clean-up", "move-common-www"], ()=> {
    let stream = gulp.src([
        `src/common/server/*.js`,
        `src/common/server/init/*.js`,
        `src/common/server/middleware/*.js`,
        `src/common/server/model/*.js`,
        `src/common/server/route/*.js`,
        `src/common/server/util/*.js`,
    ]).pipe(gulp.dest(`dist/${project}/server/js/`));
    return stream;
});
gulp.task("move-common-www", ["clean-up"], ()=> {
    let stream;
    if (config.isProduction && config.port.hasOwnProperty(project)) {
        stream = gulp.src("src/common/server/www")
            .pipe(replace(/3000/g, config.port[project]))
            .pipe(gulp.dest(`dist/${project}/server/js/`));
    } else {
        stream = gulp.src("src/common/server/www")
            .pipe(gulp.dest(`dist/${project}/server/js/`));
    }
    return stream;
});

gulp.task("move-project-server", ["move-common-server"], ()=> {
    let stream = gulp.src([
        `src/project/${project}/server/*.js`,
        `src/project/${project}/server/init/*.js`,
        `src/project/${project}/server/middleware/*.js`,
        `src/project/${project}/server/model/*.js`,
        `src/project/${project}/server/route/*.js`,
        `src/project/${project}/server/util/*.js`,
    ]).pipe(gulp.dest(`dist/${project}/server/js/`));
    return stream;
});
//移动client部分
gulp.task("move-view", ["clean-up"], ()=> {
    let stream = gulp.src([
        `src/project/${project}/client/**`,
        "src/common/client/**",
        `!src/project/${project}/client/*/*.html`,
        "!src/common/client/*/*.html",
        "!src/common/client/*"
    ]).pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
gulp.task("move-client", ["move-view"], ()=> {
    let stream = gulp.src(["src/common/client/*/*.html", `src/project/${project}/client/*/*.html`])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(hash_src({build_dir: `dist/${project}/client`, src_path: `src/project/${project}/client`}))
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});

//编译
gulp.task("compile", ["compile-clean"]);
//编译scss为css
gulp.task("compile-scss", ["move"], () => {
    let stream = gulp.src(`dist/${project}/client/*/*.scss`)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(`dist/${project}/client`));
    return stream;
});
//获取视图模块
let views = [];
gulp.task("get-views", ["move"], () => {
    let promise = new Promise(resolve=> {
        views = fs.readdirSync(`dist/${project}/client`).filter(d=> {
            return fs.statSync(path.join(`dist/${project}/client`, d)).isDirectory() && d != "common" && d != "data";
        });
        resolve();
    });
    return promise;
});
//合并css为bundle.css
gulp.task("concat-css", ["compile-scss", "get-views"], ()=> {
    let promiseArr = views.map(d=> {
        let promise = new Promise(resolve=> {
            gulp.src([`dist/${project}/client/${d}/*.css`, `dist/${project}/client/common/*.css`])
                .pipe(concatCss("bundle.css", {rebaseUrls: false}))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest(`dist/${project}/client/${d}`))
                .on("end", ()=> {
                    resolve();
                });
        });
        return promise;
    });
    return Promise.all(promiseArr);
});
//编译jsx
gulp.task("compile-jsx", ["concat-css"], () => {
    let webpackConfig = require('./webpack.config.js');
    if (config.isProduction) {
        //压缩
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    }
    let promiseArr = views.map(d=> {
        let promise = new Promise(resolve=> {
            gulp.src(`dist/${project}/client/${d}/main.jsx`)
                .pipe(webpackStream(webpackConfig))
                .pipe(gulp.dest(`dist/${project}/client/${d}`))
                .on("end", ()=> {
                    resolve();
                });
        });
        return promise;
    });
    return Promise.all(promiseArr);
});
//删除编译前的文件
gulp.task("compile-clean", ["compile-jsx"], () => {
    return del([
        `dist/${project}/client/common`,
        `dist/${project}/client/*/*.scss`,
        `dist/${project}/client/*/*.css`,
        `dist/${project}/client/*/*.jsx`,
        `!dist/${project}/client/*/bundle.css`
    ]);
});