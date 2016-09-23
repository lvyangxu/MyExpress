let $ = require("jquery");

class http {
    /**
     * do ajax with jquery,fit ie
     * @param url
     * @param httpRequestType
     * @param requestTimeOutSecond
     * @param requestParaData
     * @param successCallback
     * @param failureCallback
     * @returns {*}
     */
    static doAjaxInJquery(url, httpRequestType, requestTimeOutSecond, requestParaData, successCallback, failureCallback) {
        let request = $.ajax({
            type: httpRequestType,
            url: url,
            cache: false,
            timeout: requestTimeOutSecond * 1000,
            data: requestParaData,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "text"
        }).done(function (data) {
            successCallback(data);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            failureCallback(textStatus);
        });
        return request;
    };

    /**
     * do post action,all param will be base64UrlEncode
     * @param url
     * @param requestParaData
     */
    static post(url, requestParaData) {
        let promise = new Promise((resolve, reject)=> {
            requestParaData = (requestParaData == undefined) ? {} : requestParaData;
            for(let k in requestParaData){
                requestParaData[k] = requestParaData[k].base64UrlEncode();
            }
            http.doAjaxInJquery(url, "post", 30, requestParaData, (d)=>{
                try {
                    d = d.toJson();
                } catch (e) {
                    reject("invalid json string:" + d);
                    return;
                }
                if (d.success == undefined || d.message == undefined) {
                    reject("unexpected json string:" + d);
                    return;
                }
                if (d.success == "true") {
                    resolve(d.message);
                } else {
                    if (d.message == "unauthorized") {
                        window.location.href = "../login/";
                        return;
                    }
                    reject(d.message);
                }
            }, function (result) {
                reject("Client Error,Please Check Your Network:"+result);
            });
        });
        return promise;
    }

    static get(url,requestParaData){
        let promise = new Promise((resolve, reject)=> {
            requestParaData = (requestParaData == undefined) ? {} : requestParaData;
            for(let k in requestParaData){
                requestParaData[k] = requestParaData[k].base64UrlEncode();
            }
            http.doAjaxInJquery(url, "get", 30, requestParaData, (d)=>{
                try {
                    d = d.toJson();
                } catch (e) {
                    reject("invalid json string:" + d);
                    return;
                }
                if (d.success == undefined || d.message == undefined) {
                    reject("unexpected json string:" + d);
                    return;
                }
                if (d.success == "true") {
                    resolve(d.message);
                } else {
                    if (d.message == "unauthorized") {
                        window.location.href = "../login/";
                        return;
                    }
                    reject(d.message);
                }
            }, function (result) {
                reject("Client Error,Please Check Your Network");
            });
        });
        return promise;
    }
}

module.exports = http;