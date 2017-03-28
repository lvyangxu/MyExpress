"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var upload = function () {
    function upload() {
        _classCallCheck(this, upload);
    }

    _createClass(upload, null, [{
        key: "do",
        value: function _do(url, input, progressCallback) {

            return new Promise(function (resolve, reject) {
                if (input.files.length == 0) {
                    alert("请至少选择一个文件");
                    return;
                }

                var uploadFile = new FormData();
                for (var i = 0; i < input.files.length; i++) {
                    uploadFile.append(i, input.files[i]);
                }
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        progressCallback(percentComplete);
                    }
                }, false);
                xhr.addEventListener("load", function (evt) {
                    var result = evt.target.responseText;
                    var jsonObject = void 0;
                    try {
                        jsonObject = result.toJson();
                    } catch (e) {
                        var rejectMessage = "invalid json message";
                        reject(rejectMessage);
                        return;
                    }
                    if (jsonObject.success == "true") {
                        resolve();
                    } else {
                        var _rejectMessage = "upload failed:" + jsonObject.message;
                        reject(_rejectMessage);
                    }
                }, false);
                xhr.addEventListener("error", function () {
                    var rejectMessage = "upload failed:check your network";
                    reject(rejectMessage);
                }, false);
                xhr.addEventListener("abort", function () {
                    var rejectMessage = "upload abort";
                    reject(rejectMessage);
                }, false);
                xhr.open("POST", url);
                xhr.send(uploadFile);
            });
        }
    }]);

    return upload;
}();

module.exports = upload;
