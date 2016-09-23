"use strict";

var xlsx = require("xlsx");
module.exports = {
    read: function read(filePath) {
        var workbook = xlsx.readFile(filePath);
        var valueArr = workbook.SheetNames.map(function (d) {
            var worksheet = workbook.Sheets[d];
            var data = xlsx.utils.sheet_to_json(worksheet);
            return { sheetName: d, data: data };
        });
        return valueArr;
    },
    write: function write() {}
};

//# sourceMappingURL=excel.js.map