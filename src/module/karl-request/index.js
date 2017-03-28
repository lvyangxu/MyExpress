let http = require("http");
let https = require("https");

let httpRequest = options=> {
    let promise = new Promise((resolve, reject)=> {
        let req = http.request(options, res=> {
            res.setEncoding('utf8');
            let message = "";
            res.on('data', (chunk) => {
                message += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    header: res.headers,
                    message: message
                });
            });
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        req.end();
    });
    return promise;
};

let httpsRequest = options => {
    let promise = new Promise((resolve, reject)=> {
        let req = https.request(options, res=> {
            res.setEncoding('utf8');
            let message = "";
            res.on('data', (chunk) => {
                message += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    header: res.headers,
                    message: message
                });
            });
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        req.end();
    });
    return promise;
}

module.exports = {
    /**
     * node服务端http请求
     * @param options json格式的参数，分别有host，hostname，port，method，path，headers等
     */
    async doHttp(options){
        let data;
        try {
            data = await httpRequest(options);
        } catch (e) {
            data = await httpRequest(options);
        }
        return data;
    },
    /**
     * node服务端https请求
     * @param options json格式的参数，分别有host，hostname，port，method，path，headers等
     */
    async doHttps(options){
        let data;
        try {
            data = await httpsRequest(options);
        } catch (e) {
            data = await httpsRequest(options);
        }
        return data;
    }
};