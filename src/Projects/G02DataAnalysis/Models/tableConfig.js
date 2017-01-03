/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * database:表所属数据库,默认为global.pool变量中的第一个,单一数据库使用默认值
 * curd:表格需要展示的增删查改操作
 * autoRead:加载时是否自动执行一次读取
 * rowPerPage:每一页显示的table数据行数,默认为10
 * columns:前端所需的列及其属性，
 *          id:列id，
 *          name:列显示名称，
 *          checked:是否默认显示
 *          select:是否作为客户端筛选条件
 *          type:表格创建和修改时显示的类型，可为input,textarea,radio,select,day,month,week,rangeDay,rangeMonth,rangeWeek，默认为input
 *          queryCondition;是否作为服务端查询筛选条件
 *          initSql:该筛选组件初始化数据的sql
 *          data:该筛选组件初始化数据的数组
 *          radioArr:所有单选值的数组，仅在type为radio有效,
 *          dateAdd：筛选条件为日期类型时，默认的日期偏移量，默认为{add:0,startAdd:-7(日)或-1(月),endAdd:0}
 *          chartGroup：图表展示的组，并作为chart的标题
 *          chartX：该图表的x坐标
 * chart:图表数组
 *
 * create:表格创建默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * update:表格更新默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * read:表格查询语句
 * readCheck:表格查询前的参数检查
 * readValue:表格查询默认json值，匹配read值中的？
 * @param req express中的req对象
 * @returns {*[]} 返回json数组
 */
module.exports = (req) => {

    let where = (conditionArr)=> {
        let str = "";
        if (conditionArr.length > 0) {
            str = " where " + conditionArr.join(" and ");
        }
        return str;
    };

    //分组字符串
    let group = (columns)=> {
        let str = "";
        if (columns.length > 0) {
            str = "group by " + columns.join(",");
        }
        return str;
    };

    //查询条件
    let condition = {
        //范围的日期值
        rangeDate: (field, param)=> {
            let str = ` ${field}>="${req.body[param].start}" and ${field}<="${req.body[param].end}" `;
            return str;
        },
        //固定的日期值
        simpleDate: (field, param)=> {
            let str = ` ${field}="${req.body[param]}" `;
            return str;
        },
        //前端select控件传入的整形
        optionalSelectNum: (field, param)=> {
            let selected = req.body[param].filter(d=> {
                return d.checked;
            }).map(d=> {
                return d.name;
            });
            let str = "";
            if (selected.length != 0) {
                let d = selected.join(",");
                str = ` ${field} in (${d}) `;
            }
            return str;
        },
        //前端select控件传入的字符串
        optionalSelectStr: (field, param)=> {
            let selected = req.body[param].filter(d=> {
                return d.checked;
            }).map(d=> {
                return "'" + d.name + "'";
            });
            let str = "";
            if (selected.length != 0) {
                let d = selected.join(",");
                str = ` ${field} in (${d}) `;
            }
            return str;
        },
        optionalInputStr: (field, param)=> {
            let str = "";
            if (req.body[param] != undefined && req.body[param] != "") {
                str = ` ${field}=${req.body[param]} `;
            }
            return str;
        }
    };

    return [
        {
            id: "daily",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {id: "day", name: "日期", checked: true, type: "rangeDay", queryCondition: true, dateAdd: {startAdd: -1}},
                {
                    id: "server",
                    name: "服务器",
                    checked: true,
                    type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.new_all"
                },
                {id: "role", name: "新增角色", checked: true},
                {id: "deviceRole", name: "新增角色(设备排重)", checked: true},
                {id: "account", name: "新增账号", checked: true},
                {id: "deviceAcount", name: "新增账号(设备排重)", checked: true},
                {id: "activeRole", name: "当日激活当日建角数", checked: true},
                {id: "active", name: "激活数", checked: true},
                {id: "maxOnline", name: "最高在线人数", checked: true},
                {id: "avgOnline", name: "平均在线人数", checked: true},
                {id: "roleActivation", name: "日活跃角色数", checked: true},
                {id: "accountActivation", name: "日活跃账号数", checked: true},
                {id: "deviceActivation", name: "日活跃设备数", checked: true},
                {id: "loginTimes", name: "日登录次数", checked: true},
                {id: "totalCharge", name: "日充值总额", checked: true, chartGroup: "充值总额", chartX: "day"},
                {id: "newRoleTotalCharge", name: "日新增玩家付费总额", checked: true, chartGroup: "充值总额", chartX: "day"},
                {id: "chargeRoleNum", name: "日付费用户数", checked: true, chartGroup: "充值人数", chartX: "day"},
                {id: "chargeNewRoleNum", name: "日新增玩家付费用户数", checked: true, chartGroup: "充值人数", chartX: "day"},
                {id: "charge3DayRoleNum", name: "连续三天付费用户数", checked: true, chartGroup: "充值人数", chartX: "day"},
            ],
            chart: [
                {
                    title: "新增", x: "day",
                    y: [
                        {id: "role", name: "角色"},
                        {id: "deviceRole", name: "角色(设备排重)"},
                        {id: "account", name: "账号"},
                        {id: "deviceAcount", name: "账号(设备排重)"},
                        {id: "activeRole", name: "当日激活当日建角数"},
                        {id: "active", name: "激活数"},
                    ]
                },
                {
                    title: "在线人数", x: "day", yAxisText: "人",
                    y: [
                        {id: "maxOnline", name: "最高"},
                        {id: "avgOnline", name: "平均"},
                    ]
                },
                {
                    title: "活跃", x: "day", yAxisText: "个",
                    y: [
                        {id: "roleActivation", name: "角色数"},
                        {id: "accountActivation", name: "账号数"},
                        {id: "deviceActivation", name: "设备数"},
                        {id: "loginTimes", name: "登录次数"},
                    ]
                },
                {
                    title: "充值总额", x: "day", yAxisText: "$",
                    y: [
                        {id: "totalCharge", name: "充值总额"},
                        {id: "newRoleTotalCharge", name: "新增玩家付费总额"},
                    ]
                },
                {
                    title: "充值人数", x: "day", yAxisText: "人",
                    y: [
                        {id: "chargeRoleNum", name: "付费用户"},
                        {id: "chargeNewRoleNum", name: "新增玩家付费用户"},
                        {id: "charge3DayRoleNum", name: "连续三天付费用户"},
                    ]
                }
            ],
            read: ()=> {
                let server = req.body.server.filter(d=> {
                    return d.checked;
                }).map(d=> {
                    return d.name;
                });
                let serverColumnStr = server.length == 0 ? "" : "new.server as server,";
                let groupStr = server.length == 0 ? group(["day"]) : group(["server", "day"]);
                let buildJoinCondition = (server, table)=> {
                    if (server.length != 0) {
                        return `new.server = ${table}.server and new.day = ${table}.day`;
                    } else {
                        return `new.day = ${table}.day`;
                    }
                };

                let serverConditionStr = condition.optionalSelectNum("serverid", "server");
//where
                let sqlCommand = `
                    select new.day as day,${serverColumnStr}new.role as role,new.deviceRole as deviceRole,new.account as account,new.deviceAcount as deviceAcount,
                        new.activeRole as activeRole,new.active as active,online.maxNum as maxOnline,online.avgNum as avgOnline,active.roleActivation as roleActivation,
                            active.accountActivation as accountActivation,active.deviceActivation as deviceActivation,active.loginTimes as loginTimes,
                                charge.totalCharge as totalCharge,charge.newRoleTotalCharge as newRoleTotalCharge,charge.chargeRoleNum as chargeRoleNum,
                                    charge.chargeNewRoleNum as chargeNewRoleNum,charge.charge3DayRoleNum as charge3DayRoleNum
                    from
                        (((select serverid as server,date as day,sum(new_js) as role,sum(new_js_dv) as deviceRole,sum(new_zh) as account,sum(new_zh_dv) as deviceAcount,
                            sum(new_dv_js) as activeRole,sum(new_dv) as active from res.new_all 
                                ${where(condition.rangeDate("date", "day"), serverConditionStr)} ${groupStr}) as new
                    left join 
                         (select serverid as server,date as day,sum(day_active_js) as roleActivation,sum(day_active_zh) as accountActivation,
                            sum(day_active_dv) as deviceActivation,sum(day_login_num) as loginTimes from res.active 
                                where ${condition.rangeDate("date", "day")} ${serverConditionStr} ${groupStr}) as active
                    on ${buildJoinCondition(server, "active")})
                    left join
                         (select serverid as server,date as day,sum(day_charge_total) as totalCharge,sum(day_new_charge_total) as newRoleTotalCharge,
                            sum(day_pay_user_num) as chargeRoleNum,sum(day_new_pay_user_num) as chargeNewRoleNum,sum(continus_pay_user_num) as charge3DayRoleNum
                                from res.charge where ${condition.rangeDate("date", "day")} ${serverConditionStr} ${groupStr}) as charge
                    on ${buildJoinCondition(server, "charge")})
                    left join
                        (select serverid as server,date(time) as day,max(num) as maxNum,avg(num) as avgNum from raw.online 
                            where ${condition.rangeDate("date(time)", "day")} ${serverConditionStr} ${groupStr}) as online
                    on ${buildJoinCondition(server, "online")}
                    order by new.day,new.server
                    `;
                return sqlCommand;
            },
            readCheck: ()=> {
                let hasParam = req.body.hasOwnProperty("day") && req.body.hasOwnProperty("server") && req.body.day.hasOwnProperty("start") && req.body.day.hasOwnProperty("end");
                let dayRegex = /^\d{4}-\d{2}-\d{2}$/;
                let isValid = Array.isArray(req.body.server) && dayRegex.test(req.body.day.start) && dayRegex.test(req.body.day.end);
                if (hasParam && isValid) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            id: "stamina",
            database: "raw",
            autoRead: false,
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "input", queryCondition: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverid as server from raw.tili_buy"
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "totalStamina", name: "当前身上体力总额", checked: true},
                {id: "stamina", name: "购买体力", checked: true},
                {id: "device", name: "设备id", checked: true},
                {id: "second", name: "购买时间", checked: true, type: "rangeSecond", queryCondition: true},
            ],
            read: ()=> {
                let roleIdStr = condition.optionalInputStr("js_id", "role");

                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,
                                    tili_total as totalStamina,tili as stamina,dv_id as device,time as second from raw.tili_buy where ${roleIdStr} " 
                                        and ${condition.rangeDate("time", "second")} and ${condition.optionalSelectNum("serverid", "server")}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                let hasParam = req.body.hasOwnProperty("second") && req.body.second.hasOwnProperty("start") && req.body.second.hasOwnProperty("end");
                let roleRegex = /^\d+$/;
                let secondRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
                let isValid = secondRegex.test(req.body.second.start) && secondRegex.test(req.body.second.end);
                if (req.body.hasOwnProperty("role") && req.body.role != "") {
                    isValid = isValid && roleRegex.test(req.body.role)
                }
                if (hasParam && isValid) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            id: "diamond",
            database: "res",
            autoRead: false,
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.rank"
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "rankType", name: "排名类型", checked: true, type: "radio", queryCondition: true, data: ["金钻", "钻石"]},
                {id: "roleId", name: "角色名", checked: true},
                {id: "role", name: "角色名", checked: true},
                {id: "roleServer", name: "角色服务器", checked: true},
                {id: "roleChannel", name: "角色渠道", checked: true},
                {id: "roleClient", name: "角色站点", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "vipLevel", name: "角色VIP等级", checked: true},
                {id: "gold", name: "当前金钻数", checked: true},
                {id: "diamond", name: "当前钻石数", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
            ],
            extraFilter: [
                {id: "limit", type: "radio", data: [100, 200, 300]}
            ],
            read: ()=> {
                let sqlCommand = `select serverid as server,channel,ptid as client,rank,rank_type as rankType,js_str as roleId,js_na as role,js_server as roleServer,
                                    js_channel as roleChannel,js_ptid as roleClient,level,viplevel as vipLevel,jinzuan_total as gold,zuansi_total as diamond,
                                        date as day from res.rank where ? limit ${req.body.limit}`;
                return sqlCommand;
            },
            readValue: ()=> {
                let rankType = req.body.rankType == "金钻" ? "jinzuan" : "zuansi";
                return {
                    rank_type: rankType,
                    date: req.body.day
                }
            },
            readCheck: ()=> {
                let hasParam = req.body.hasOwnProperty("rankType") && req.body.hasOwnProperty("day") && req.body.hasOwnProperty("limit");
                let rankTypeRegex = /^金钻|钻石$/;
                let dayRegex = /^\d{4}-\d{2}-\d{2}$/;
                let limitRegex = /^\d+$/;
                let isValid = rankTypeRegex.test(req.body.rankType) && dayRegex.test(req.body.day) && limitRegex.test(req.body.limit);
                if (hasParam && isValid) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            id: "chargeRank",
            database: "res",
            autoRead: false,
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.rank"
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "rankType", name: "排名类型", checked: true, type: "radio", queryCondition: true, data: ["金钻", "钻石"]},
                {id: "roleId", name: "角色名", checked: true},
                {id: "role", name: "角色名", checked: true},
                {id: "roleServer", name: "角色服务器", checked: true},
                {id: "roleChannel", name: "角色渠道", checked: true},
                {id: "roleClient", name: "角色站点", checked: true},
                {id: "totalCharge", name: "充值总额", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
            ],
            extraFilter: [
                {id: "limit", type: "radio", data: [100, 200, 300]}
            ],
            read: ()=> {
                let sqlCommand = `select serverid as server,channel,ptid as client,rank,rank_type as rankType,js_str as roleId,js_na as role,js_server as roleServer,
                                    js_channel as roleChannel,js_ptid as roleClient,charge_total as totalCharge,date as day from res.rank_charge 
                                        where ? limit ${req.body.limit}`;
                return sqlCommand;
            },
            readValue: ()=> {
                let rankType = req.body.rankType == "金钻" ? "jinzuan" : "zuansi";
                return {
                    rank_type: rankType,
                    date: req.body.day
                }
            },
            readCheck: ()=> {
                let hasParam = req.body.hasOwnProperty("rankType") && req.body.hasOwnProperty("day") && req.body.hasOwnProperty("limit");
                let rankTypeRegex = /^金钻|钻石$/;
                let dayRegex = /^\d{4}-\d{2}-\d{2}$/;
                let limitRegex = /^\d+$/;
                let isValid = rankTypeRegex.test(req.body.rankType) && dayRegex.test(req.body.day) && limitRegex.test(req.body.limit);
                if (hasParam && isValid) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    ];
}
;

// {
//     id: "create_data",
//         database: "log_nuclear",
//     curd: "r",
//     columns: [
//     {id: "imeiId", name: "IMEI", checked: true, select: true},
//     {id: "accountId", name: "账号id", checked: true, select: true},
//     {id: "account", name: "账号", checked: true},
//     {id: "roleId", name: "角色id", checked: true},
//     {id: "os", name: "系统", checked: true},
//     {id: "serverId", name: "服务器id", checked: true, select: true},
//     {id: "role_name", name: "角色名", checked: true},
//     {id: "role_createTime", name: "角色创建时间", checked: true},
//     {id: "js_ocu", name: "角色OCU", checked: true},
//     {id: "role_ip", name: "角色ip", checked: true},
//     {id: "account_createDate", name: "账号创建日期", checked: true},
//     {id: "imei_createDate", name: "IMEI创建日期", checked: true},
//     {id: "imei_os", name: "IMEI系统", checked: true},
//     {id: "region", name: "区域", checked: true, select: true},
//     {id: "update", name: "更新时间", checked: true},
// ]
// }