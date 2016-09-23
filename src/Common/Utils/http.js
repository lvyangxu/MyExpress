"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require("jquery");

var http = function () {
    function http() {
        _classCallCheck(this, http);
    }

    _createClass(http, null, [{
        key: "doAjaxInJquery",

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
        value: function doAjaxInJquery(url, httpRequestType, requestTimeOutSecond, requestParaData, successCallback, failureCallback) {
            var request = $.ajax({
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
        }
    }, {
        key: "post",


        /**
         * do post action,all param will be base64UrlEncode
         * @param url
         * @param requestParaData
         */
        value: function post(url, requestParaData) {
            var promise = new Promise(function (resolve, reject) {
                requestParaData = requestParaData == undefined ? {} : requestParaData;
                for (var k in requestParaData) {
                    requestParaData[k] = requestParaData[k].base64UrlEncode();
                }
                http.doAjaxInJquery(url, "post", 30, requestParaData, function (d) {
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
                    reject("Client Error,Please Check Your Network:" + result);
                });
            });
            return promise;
        }
    }, {
        key: "get",
        value: function get(url, requestParaData) {
            var promise = new Promise(function (resolve, reject) {
                requestParaData = requestParaData == undefined ? {} : requestParaData;
                for (var k in requestParaData) {
                    requestParaData[k] = requestParaData[k].base64UrlEncode();
                }
                http.doAjaxInJquery(url, "get", 30, requestParaData, function (d) {
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
    }]);

    return http;
}();

module.exports = http;

//# sourceMappingURL=http.js.map