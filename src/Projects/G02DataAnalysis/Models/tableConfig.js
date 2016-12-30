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
                let serverStr = "";
                let serverColumnStr = "";
                let joinCondition;
                let groupStr = "group by server,day";
                if (server.length != 0) {
                    let d = server.join(",");
                    serverStr = ` and serverid in (${d})`;
                    serverColumnStr = "new.server as server,";
                    joinCondition = (table)=> {
                        return `new.server = ${table}.server and new.day = ${table}.day`;
                    };
                } else {
                    //如果未勾选服务器分组，则不按server进行分组和连接
                    groupStr = "group by day";
                    joinCondition = (table)=> {
                        return `new.day = ${table}.day`;
                    };
                }

                let sqlCommand = `
                    select new.day as day,${serverColumnStr}new.role as role,new.deviceRole as deviceRole,new.account as account,new.deviceAcount as deviceAcount,
                        new.activeRole as activeRole,new.active as active,online.maxNum as maxOnline,online.avgNum as avgOnline,active.roleActivation as roleActivation,
                            active.accountActivation as accountActivation,active.deviceActivation as deviceActivation,active.loginTimes as loginTimes,
                                charge.totalCharge as totalCharge,charge.newRoleTotalCharge as newRoleTotalCharge,charge.chargeRoleNum as chargeRoleNum,
                                    charge.chargeNewRoleNum as chargeNewRoleNum,charge.charge3DayRoleNum as charge3DayRoleNum
                    from
                        (((select serverid as server,date as day,sum(new_js) as role,sum(new_js_dv) as deviceRole,sum(new_zh) as account,sum(new_zh_dv) as deviceAcount,
                            sum(new_dv_js) as activeRole,sum(new_dv) as active from res.new_all 
                                where date>="${req.body.day.start}" and date<="${req.body.day.end}" ${serverStr} ${groupStr}) as new
                    left join 
                         (select serverid as server,date as day,sum(day_active_js) as roleActivation,sum(day_active_zh) as accountActivation,
                            sum(day_active_dv) as deviceActivation,sum(day_login_num) as loginTimes from res.active 
                                where date>="${req.body.day.start}" and date<="${req.body.day.end}" ${serverStr} ${groupStr}) as active
                    on ${joinCondition("active")})
                    left join
                         (select serverid as server,date as day,sum(day_charge_total) as totalCharge,sum(day_new_charge_total) as newRoleTotalCharge,
                            sum(day_pay_user_num) as chargeRoleNum,sum(day_new_pay_user_num) as chargeNewRoleNum,sum(continus_pay_user_num) as charge3DayRoleNum
                                from res.charge where date>="${req.body.day.start}" and date<="${req.body.day.end}" ${serverStr} ${groupStr}) as charge
                    on ${joinCondition("charge")})
                    left join
                        (select serverid as server,date(time) as day,max(num) as maxNum,avg(num) as avgNum from raw.online 
                            where date(time)>="${req.body.day.start}" and date(time)<="${req.body.day.end}" ${serverStr} ${groupStr}) as online
                    on ${joinCondition("online")}
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
                {id: "server", name: "服务器id", checked: true},
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
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,
                                    tili_total as totalStamina,tili as stamina,dv_id as device,time as second from raw.tili_buy where js_id="${req.body.role}" 
                                        and time>="${req.body.second.start}" and time<="${req.body.second.end}"`;
                return sqlCommand;
            },
            readCheck: ()=> {
                let hasParam = req.body.hasOwnProperty("second") && req.body.hasOwnProperty("role") && req.body.second.hasOwnProperty("start") && req.body.second.hasOwnProperty("end");
                let numRegex = /^\d+$/;
                let timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
                let isValid = numRegex.test(req.body.role) && timeRegex.test(req.body.second.start) && timeRegex.test(req.body.second.end);
                if (hasParam && isValid) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    ];
};

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