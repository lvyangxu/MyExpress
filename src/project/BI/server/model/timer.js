let request = require("karl-request");
let querystring = require("querystring");

let appList = [
    {id: "1001 Nights And", appToken: "k43ganqb7ke8", group: "1001"},
    {id: "1001 Nights iOS", appToken: "ygow3v4y4pvk", group: "1001"},
    {id: "Age of Magic Android", appToken: "fgky7hz8qhog", group: "AOM"},
    {id: "Age of Magic IOS", appToken: "510h3gyiyfb4", group: "AOM"},
    {id: "Bleach Android", appToken: "uo9kbgo6rif4", group: "Bleach"},
    {id: "Bleach IOS", appToken: "yb62hf3rpfy8", group: "Bleach"},
    {id: "HW DE And", appToken: "2h869tz07m2o", group: "HW"},
    {id: "HW DE IOS", appToken: "kw2vwzuyxg5c", group: "HW"},
    {id: "HW DE IOS new", appToken: "niq8veeu7e9s", group: "HW"},
    {id: "HW EN And", appToken: "tdz0yyr4utc0", group: "HW"},
    {id: "HW EN IOS", appToken: "zwslbddcn01s", group: "HW"},
    {id: "HW FR And", appToken: "ko11j0sgq7eo", group: "HW"},
    {id: "HW FR IOS", appToken: "hyixqd5c1ou8", group: "HW"},
    {id: "HW FR IOS(新账号)", appToken: "39nrzvsh5bb4", group: "HW"},
    {id: "HW RU And", appToken: "uo5o40q73oxs", group: "HW"},
    {id: "HW RU IOS", appToken: "j38jj17xk0sg", group: "HW"},
    {id: "Tank EN And", appToken: "pju505da1q0w", group: "TANK"},
    {id: "Tank EN IOS", appToken: "a495xcjgwxds", group: "TANK"},
    {id: "Tank FR And", appToken: "wo8k0cd7iz9c", group: "TANK"},
    {id: "Tank FR IOS", appToken: "72urlxh1zv28", group: "TANK"},
    {id: "Tank RU And", appToken: "vp6y7m324ykg", group: "TANK"},
    {id: "Tank RU IOS", appToken: "cphzum1ckv0g", group: "TANK"},
    {id: "斗破三国 And", appToken: "rgypi0p64e0w", group: "三国"},
    {id: "斗破三国 IOS", appToken: "4qdwuiybyzgg", group: "三国"},
];
let apiToken = "o-83yyycSWiXSaD_rRj1";
let minDate = new Date(2017, 2, 1);


let doAdjustDeliverables = async(appToken, startDate, endDate)=> {
    let param = {
        user_token: apiToken,
        kpis: "installs,revenue",
        start_date: startDate,
        end_date: endDate,
        grouping: "trackers,countries,os_names"
    };
    let paramStr = querystring.stringify(param);
    let data = await request.doHttps({
        hostname: "api.adjust.com",
        path: `/kpis/v1/${appToken}?${paramStr}`,
        method: "GET",
    });
    let message = JSON.parse(data.message);
    let rows = [];
    let trackers = message.result_parameters.trackers;
    message.result_set.trackers.forEach(d=> {
        let findElement = trackers.find(d1=> {
            return d1.token == d.token;
        });
        let tracker = findElement.name;
        d.countries.forEach(d1=> {
            d1.os_names.forEach(d2=> {
                rows.push({
                    tracker: tracker,
                    country: d1.country,
                    platform: d2.os_name,
                    installs: d2.kpi_values[0],
                    revenue: d2.kpi_values[1]
                });
            });
        });
    });
    return rows;
};

let doAdjustCohorts = async(appToken, startDate, endDate)=> {
    let param = {
        user_token: apiToken,
        start_date: startDate,
        end_date: endDate,
        grouping: "trackers,countries,os_names",
        kpis: "retained_users"
    };
    let paramStr = querystring.stringify(param);
    let data = await request.doHttps({
        hostname: "api.adjust.com",
        path: `/kpis/v1/${appToken}/cohorts?${paramStr}`,
        method: "GET",
    });
    let message = JSON.parse(data.message);
    let rows = [];
    let trackers = message.result_parameters.trackers;
    message.result_set.trackers.forEach(d=> {
        let findElement = trackers.find(d1=> {
            return d1.token == d.token;
        });
        let tracker = findElement.name;
        d.countries.forEach(d1=> {
            d1.os_names.forEach(d2=> {
                let findPeriond = d2.periods.find(d3=> {
                    return d3.period == "1";
                });
                let retentionRate = findPeriond == undefined ? null : findPeriond.kpi_values[0];
                rows.push({
                    tracker: tracker,
                    country: d1.country,
                    platform: d2.os_name,
                    retentionRate: retentionRate
                });
            });
        });
    });
    return rows;
};

let doAdjust = async(appToken, day)=> {
    try {
        let value1 = await doAdjustDeliverables(appToken, day, day);
        let value2 = await doAdjustCohorts(appToken, day, day);
        //合并两个请求里的广告渠道
        let rows = value1.concat();
        value2.forEach(d=> {
            let findElement = value1.find(d1=> {
                return d1.tracker == d.tracker && d1.country == d.country && d1.platform == d.platform;
            });
            if (findElement == undefined) {
                //如果未包含，则新增一行
                rows.push(d);
            } else {
                //如果已包含，则合并json
                let findElement1 = rows.find(d1=> {
                    return d1.tracker == d.tracker && d1.country == d.country && d1.platform == d.platform;
                });
                findElement1 = Object.assign(findElement1, d);
            }
        });
        let group = appList.find(d=> {
            return d.appToken == appToken;
        }).group;
        let sqlValueStr = rows.map(d=> {
            let retention = (d.retentionRate == undefined || d.retentionRate == null ) ? `null` : `"${d.retentionRate}"`;
            let str = `("${d.tracker}","${day}","${group}","${d.platform}","${d.country}","${d.installs}",${retention},"${d.revenue}",null)`;
            return str;
        }).join(",");
        let pool = global.mysqlObject[0].pool;
        let sqlCommand = `replace into data values ${sqlValueStr}`;
        console.log(sqlCommand);
        data = await global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        });
    } catch (e) {
        console.log(e.message);
    }
};

let doAppannie = () => {

};


doAdjust("vp6y7m324ykg", "2017-03-01");

module.exports = "";