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
            case "getGameNames":
                sqlCommand = "select * from game";
                break;
            case "getGameNamesByPublisher":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.publisher};
                break;
            case "getGameNamesByDeveloper":
                sqlCommand = "select * from game where ?";
                values = {publisher: req.body.developer};
                break;
            default:
                sqlCommand = "select * from " + table;
                break;
        }
        return {sqlCommand: sqlCommand, values: values};
    }
};