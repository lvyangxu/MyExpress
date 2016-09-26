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
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return {sqlCommand: sqlCommand, values: values};
    }
};