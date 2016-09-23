let fs = require('fs');
let xml2js = require('xml2js');

let parser = new xml2js.Parser();
module.exports = {
    read: (path)=> {
        return new Promise((resolve, reject)=> {
            fs.readFile(path, function (err, data) {
                if(err){
                    reject("read xml error:"+err);
                    return;
                }
                parser.parseString(data, function (err1, result) {
                    if (err1) {
                        reject("parse xml error:"+err1);
                    }else{
                        resolve(result);
                    }
                });
            });
        });
    }
};