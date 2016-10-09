module.exports = {
    dataMap: (table, d)=> {
        switch (table) {
            case "getGames":
                d = d.map(d1=> {
                    return d1.name;
                });
                break;
            case "getPublishers":
                d = d.map(d1=> {
                    return d1.publisher;
                });
                break;
            case "getDevelopers":
                d = d.map(d1=> {
                    return d1.developer;
                });
                break;
        }
        return d;
    },
    init: (table)=> {
        let d = [];
        switch (table) {
            case "cp":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "公司名称", checked: true},
                    {id: "businessType", name: "业务类型", checked: true},
                    {id: "area", name: "业务地区", checked: true},
                    {id: "address", name: "所在地", checked: true},
                    {id: "productType", name: "主要产品类型", checked: true},
                    {id: "contactMan", name: "联系人", checked: true},
                    {id: "duty", name: "职位", checked: true},
                    {id: "contactWay", name: "联系方式", checked: true},
                    {id: "website", name: "网站", checked: true},
                    {id: "appannie", name: "App Annie", checked: true},
                    {id: "manager", name: "负责人", checked: true},
                    {id: "note", name: "备注", checked: true}
                ];
                break;
            case "cpDisplay":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "公司名称", checked: true},
                    {id: "businessType", name: "业务类型", checked: true},
                    {id: "area", name: "业务地区", checked: true},
                    {id: "address", name: "所在地", checked: true},
                    {id: "productType", name: "主要产品类型", checked: true},
                    {id: "contactMan", name: "联系人", checked: true},
                    {id: "duty", name: "职位", checked: true},
                    {id: "contactWay", name: "联系方式", checked: true},
                    {id: "website", name: "网站", checked: true},
                    {id: "manager", name: "负责人", checked: true},
                    {id: "note", name: "备注", checked: true}
                ];
                break;
            case "follow":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "游戏名称", checked: true},
                    {id: "followStatus", name: "跟进标签", checked: true, select: true},
                    {id: "lastContact", name: "最后联系时间", checked: true},
                    {id: "admin", name: "负责人", checked: true, select: true},
                    {id: "createTime", name: "录入时间", checked: false},
                    {id: "updateTime", name: "更新时间", checked: false}
                ];
                break;
            case "game":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "游戏名称", checked: true},
                    {id: "publisher", name: "发行商", checked: true},
                    {id: "developer", name: "研发商", checked: true},
                    {id: "type", name: "游戏类型", checked: true},
                    {id: "play", name: "玩法", checked: true},
                    {id: "ip", name: "IP", checked: true},
                    {id: "theme", name: "题材", checked: true},
                    {id: "online", name: "上线情况", checked: true},
                    {id: "performance", name: "上线表现", checked: true},
                    {id: "lastContact", name: "最后联系时间", checked: true},
                    {
                        id: "contactWay", name: "沟通方式", checked: true, type: "radio", radioArr: [
                        "初步网上/电话沟通", "网上/电话长期跟进资料", "网上/电话深度沟通（合作意向尚不明确）",
                        "网上/电话深度沟通（已明确合作意向）", "已约定见面（去对方公司拜访）", "已约定见面（来我公司拜访）",
                        "已见面（去对方公司拜访）", "已见面（来我公司拜访）", "已见面（已互相拜访）"
                    ]
                    },
                    {id: "agentCondition", name: "代理条件", checked: true},
                    {id: "admin", name: "负责人", checked: true},
                    {
                        id: "followStatus", name: "跟进标签", checked: true, type: "radio", radioArr: [
                        "等待出包", "评测中", "跟进新包，包完成度不够", "等待上线数据",
                        "初步沟通合作意向(评测通过)", "初步沟通合作意向(已上线产品)",
                        "已被其他公司代理", "开发自己发行", "我方主动放弃", "合作协议推进失败",
                        "双方明确合作意向", "签订测试协议", "签订代理协议"
                    ]
                    },
                    {id: "appannie", name: "Apple Annie", checked: true}
                ];
                break;
            case "contact":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "游戏名称", checked: true},
                    {id: "contactDate", name: "沟通日期", checked: true},
                    {id: "contactTactics", name: "沟通策略", checked: true, type: "textarea"},
                    {id: "contactContent", name: "沟通内容", checked: true, type: "textarea"}
                ];
                break;
        }
        return d;
    },
    create: (req, res, table)=> {
        let sqlCommand = "";
        let tableStruct = global.dbStruct.filter(d=> {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            let defaultValues = [{tableName: "game", createTime: "now()", updateTime: "now()"}];

            let fields = tableStruct[0].fields;
            let noIdFields = fields.filter(d=> {
                return d.Field != "id";
            });
            let columnNameStr = noIdFields.map(d=> {
                return d.Field;
            }).join(",");
            let rowLengthArr = [];
            for (let i = 0; i < req.body.requestRowsLength; i++) {
                rowLengthArr.push(i);
            }
            let rowValueStr = rowLengthArr.map(i=> {
                let row = "(";
                row += noIdFields.map(d=> {
                    let id = d.Field;
                    let type = d.Type;
                    let value;
                    let defaultValue = defaultValues.filter(d=> {
                        return d.tableName == table;
                    });
                    if (defaultValue.length != 0 && defaultValue[0][id]) {
                        value = defaultValue[0][id];
                    } else {
                        value = req.body[id].split(",")[i];
                        if (!type.includes("int") && type != "float" && type != "double") {
                            value = "'" + value + "'";
                        }
                    }
                    return value;
                }).join(",");
                row += ")";
                return row;
            }).join(",");
            sqlCommand = "insert into " + table + " (" + columnNameStr + ") values " + rowValueStr;
        }
        return {sqlCommand: sqlCommand, values: {}};
    },
    update: (req, res, table)=> {
        let sqlCommandArr = [];
        let valuesArr = [];
        let tableStruct = global.dbStruct.filter(d=> {
            return d.id == table;
        });
        if (tableStruct.length != 0) {
            let defaultValues = [{tableName: "game", createTime: null, updateTime: "now()"}];

            let fields = tableStruct[0].fields;
            let noIdFields = fields.filter(d=> {
                return d.Field != "id";
            });
            let rowLengthArr = [];
            for (let i = 0; i < req.body.requestRowsLength; i++) {
                rowLengthArr.push(i);
            }
            rowLengthArr.forEach(i=> {
                let defaultStrArr = [];
                let values = {};
                noIdFields.forEach(d=> {
                    let id = d.Field;
                    let value;
                    let defaultValue = defaultValues.filter(d=> {
                        return d.tableName == table;
                    });
                    if (defaultValue.length != 0) {
                        if (defaultValue[0].hasOwnProperty(id)) {
                            value = defaultValue[0][id];
                            if (value != null) {
                                defaultStrArr.push(id + "=" + value);
                            }
                        } else {
                            value = req.body[id].split(",")[i];
                            values[id] = value;
                        }
                    } else {
                        value = req.body[id].split(",")[i];
                        values[id] = value;
                    }
                });
                let defaultStr = defaultStrArr.join(",");
                let valueKeyLength = 0;
                for (let k in values) {
                    valueKeyLength++;
                }

                if (defaultStrArr.length != 0 && valueKeyLength != 0) {
                    defaultStr = defaultStr + ",";
                }
                let sqlCommand = "update " + table + " set " + defaultStr + "? where id=" + req.body.id.split(",")[i];
                sqlCommandArr.push(sqlCommand);
                valuesArr.push(values);
            });
        }
        return {sqlCommand: sqlCommandArr, values: valuesArr};
    },
    read: (req, res, table)=> {
        let sqlCommand = "";
        let values = {};
        switch (table) {
            case "getGames":
                sqlCommand = "select id,name from game group by name";
                break;
            case "getPublishers":
                sqlCommand = "select id,publisher from game group by publisher";
                break;
            case "getDevelopers":
                sqlCommand = "select id,developer from game group by developer";
                break;
            case "getGameNamesByPublisher":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.publisher};
                break;
            case "getGameNamesByDeveloper":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.developer};
                break;
            case "followLog":
                sqlCommand = "select * from contact where ? order by contactDate";
                values = {name: req.body.name};
                break;
            case "follow":
                sqlCommand = "select * from game order by createTime desc";
                break;
            case "cpDisplay":
                let w = "concat(\"<a href='\",website,\"' target='_blank'>\",'主页','</a>',\"<a href='\",appannie,\"' target='_blank'>\",'annie','</a>')";
                sqlCommand = "select name,businessType,area,address,productType,contactMan,duty,contactWay," + w + " as website,manager,note from cp";
                break;
            case "contact":
                sqlCommand = "select * from contact order by name";
                break;
            case "contactByName":
                sqlCommand = "select * from contact where ?";
                values = {name: req.body.name};
                break;
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return {sqlCommand: sqlCommand, values: values};
    },
    delete: (req, res, table)=> {

    },
    attachmentRead: (req, res, table)=> {

    },
    attachmentDelete: (req, res, table)=> {

    },
    attachmentUpload: (req, res, table)=> {

    },
};