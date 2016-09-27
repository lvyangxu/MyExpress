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
            case "cpDisplay":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "公司名称", checked: true, updateReadonly: true},
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
                    {id: "followStatus", name: "跟进标签", checked: true, radio: true},
                    {id: "lastContact", name: "最后联系时间", checked: true},
                    {id: "admin", name: "负责人", checked: true},
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
                    {id: "schedule", name: "当前进度", checked: true},
                    {id: "contactWay", name: "沟通方式", checked: true},
                    {id: "agentCondition", name: "代理条件", checked: true},
                    {id: "admin", name: "负责人", checked: true},
                    {id: "followStatus", name: "跟进标签", checked: true},
                    {id: "appleannie", name: "Apple Annie", checked: true}
                ];
                break;
            case "contact":
                d = [
                    {id: "id", name: "id", checked: false},
                    {id: "name", name: "游戏名称", checked: true},
                    {id: "contactDate", name: "沟通日期", checked: true},
                    {id: "contactTactics", name: "沟通策略", checked: true},
                    {id: "contactContent", name: "沟通内容", checked: true}
                ];
                break;
        }
        return d;
    },
    read: (req, res, table)=> {
        let sqlCommand = "";
        let values = {};
        switch (table) {
            case "getGames":
                sqlCommand = "select distinct(name) from game";
                break;
            case "getPublishers":
                sqlCommand = "select distinct(publisher) from game";
                break;
            case "getDevelopers":
                sqlCommand = "select distinct(developer) from game";
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
                sqlCommand = "select * from contact where ?";
                values = {name: req.body.name};
                break;
            case "follow":
                sqlCommand = "select * from game order by createTime desc";
                break;
            case "cpDisplay":
                let w = "concat(\"<a href='\",website,\"' target='_blank'>\",'主页','</a>',\"<a href='\",appannie,\"' target='_blank'>\",'annie','</a>')";
                sqlCommand = "select name,businessType,area,address,productType,contactMan,duty,contactWay," + w + " as website,manager,note from cp";
                break;
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return {sqlCommand: sqlCommand, values: values};
    }
};