let log4js = require('log4js');
module.exports = (logNameArr)=> {
    let appenders = logNameArr.map(d=> {
        return {
            type: "file",
            filename: `server/log/${d}.log`,
            pattern: ".yyyy-MM-dd",
            category: d
        }
    });

    log4js.configure({
        appenders: appenders
    });

    let loggerJson = {};
    logNameArr.forEach(d=>{
        loggerJson[d] = log4js.getLogger(d);
    });
    return loggerJson;
};