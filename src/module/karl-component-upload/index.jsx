class upload {

    static do(url, input, progressCallback) {

        return new Promise(function (resolve, reject) {
            if (input.files.length == 0) {
                alert("请至少选择一个文件");
                return;
            }

            let uploadFile = new FormData();
            for (let i = 0; i < input.files.length; i++) {
                uploadFile.append(i, input.files[i]);
            }
            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    let percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    progressCallback(percentComplete);
                }
            }, false);
            xhr.addEventListener("load", function (evt) {
                let result = evt.target.responseText;
                let jsonObject;
                try {
                    jsonObject = result.toJson();
                } catch (e) {
                    let rejectMessage = "invalid json message";
                    reject(rejectMessage);
                    return;
                }
                if (jsonObject.success == "true") {
                    resolve();
                } else {
                    let rejectMessage = "upload failed:" + jsonObject.message;
                    reject(rejectMessage);
                }
            }, false);
            xhr.addEventListener("error", function () {
                let rejectMessage = "upload failed:check your network";
                reject(rejectMessage);
            }, false);
            xhr.addEventListener("abort", function () {
                let rejectMessage = "upload abort";
                reject(rejectMessage);
            }, false);
            xhr.open("POST", url);
            xhr.send(uploadFile);
        });
    }
}

module.exports = upload;