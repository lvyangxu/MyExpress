/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * name:表格名称，下载表格时的文件名
 * type:数据库类型mysql/mongodb，未定义时默认为mysql
 * isMinColumn:最小列显示，根据查询结果自动隐藏为空的列，只有在为true时执行
 * dynamicColumn:动态列
 * limitNum:mongo查询的最大返回行
 * sort:mongo查询的排序字段json
 * database:表所属数据库,默认为global.mysqlObject变量中的第一个,单一数据库使用默认值
 * curd:表格需要展示的增删查改操作
 * autoRead:加载时是否自动执行一次读取,默认不读取,只有在为true时执行
 * rowPerPage:每一页显示的table数据行数,默认为10
 * columns:前端所需的列及其属性，
 *          id:列id，
 *          name:列显示名称，
 *          checked:是否默认显示
 *          clientFilter:是否作为客户端筛选条件
 *          type:表格创建和修改时显示的类型，可为input,textarea,radio,select,day,month,week,rangeDay,rangeMonth,rangeWeek，默认为input
 *          serverFilter:是否作为服务端查询筛选条件
 *          clientFilter:是否作为客户端查询筛选条件
 *          data:该筛选组件初始化数据的数组，函数或固定值，为函数时参数为pool
 *          dataMap:对data初始化的值进行处理
 *          radioArr:所有单选值的数组，仅在type为radio有效,
 *          placeholder:input输入框的placeholder，仅在type为integer或input时有效
 *          required:控制input输入框placeholder的颜色，仅在type为integer或input时有效
 *          dateAdd：筛选条件为日期类型时，默认的日期偏移量，默认为{add:0,startAdd:-7(日)或-1(月),endAdd:0}
 *          suffix：table中td显示的后缀文字
 *          thStyle:默认css样式
 *          tdStyle:默认td的样式
 * chart:图表数组
 *          title:标题
 *          x:x轴坐标id
 *          y:y轴坐标json，如{id: "aa", name: "bb"}
 *          yAxisText:y轴坐标单位
 *          type:图表类型，默认为curve
 *          tipsSuffix:tips后缀
 *          xAxisGroupNum:x坐标轴数字分组基数
 * extraFilter:额外的查询条件
 * create:表格创建默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * update:表格更新默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * read:表格查询语句
 * readCheck:表格查询前的参数检查
 * readValue:表格查询默认json值，匹配read值中的？
 * readMap:从数据库读取后对数据进行处理,参数为处理的data
 * @param req express中的req对象
 * @returns {*[]} 返回json数组
 */
module.exports = (req) => {
    let tableUtil = require("./tableUtil")(req);
    return [
        // {
        //     id: "dataQuery",
        //     name: "数据查询",
        //     database: "BI",
        //     curd: "r",
        //     autoRead: true,
        //     columns: [
        //         {
        //             id: "day",
        //             name: "日期",
        //             checked: true,
        //             type: "rangeDay",
        //             serverFilter: true,
        //             dateAdd: {startAdd: -7},
        //             tdStyle: {"white-space": "nowrap"}
        //         },
        //         {
        //             id: "server",
        //             name: "服务器",
        //             checked: true,
        //             type: "select",
        //             serverFilter: true,
        //             data: (pool)=> {
        //                 let sqlCommand = "select distinct serverid as server from res.new where serverid <> 0";
        //                 return initMysqlServerFilter(pool, sqlCommand);
        //             }
        //         },
        //         {id: "dnu", name: "新增角色", checked: true},
        //         {id: "dnuDevice", name: "新增角色(设备排重)", checked: true},
        //         {id: "account", name: "新增账号", checked: true},
        //         {id: "deviceAcount", name: "新增账号(设备排重)", checked: true},
        //         {id: "pcu", name: "最高在线人数", checked: true},
        //         {id: "acu", name: "平均在线人数", checked: true},
        //         {id: "dau", name: "日活跃角色数", checked: true},
        //         {id: "loginTimes", name: "日登录次数", checked: true},
        //         {id: "totalCharge", name: "日充值总额($)", checked: true},
        //         {id: "chargeRoleNum", name: "日付费用户数", checked: true},
        //         {id: "rate", name: "付费率", checked: true},
        //         {id: "arppu", name: "ARPPU($)", checked: true},
        //         {id: "newRoleTotalCharge", name: "日新增玩家付费总额($)", checked: true},
        //         {id: "chargeNewRoleNum", name: "日新增玩家付费用户数", checked: true},
        //         {id: "dnuRate", name: "新增付费率", checked: true},
        //         {id: "dnuArppu", name: "新增ARPPU($)", checked: true},
        //     ],
        //     chart: [
        //         {
        //             title: "新增", x: "day", type: "bar", group: ["server"],
        //             y: [
        //                 {id: "dnu", name: "角色"},
        //                 {id: "dnuDevice", name: "角色(设备排重)"},
        //                 {id: "account", name: "账号"},
        //                 {id: "deviceAcount", name: "账号(设备排重)"},
        //             ]
        //         },
        //         {
        //             title: "在线人数", x: "day", type: "bar", group: ["server"],
        //             y: [
        //                 {id: "pcu", name: "最高"},
        //                 {id: "acu", name: "平均"},
        //             ]
        //         },
        //         {
        //             title: "活跃", x: "day", type: "bar", group: ["server"],
        //             y: [
        //                 {id: "dau", name: "角色数"},
        //                 {id: "loginTimes", name: "登录次数"},
        //             ]
        //         },
        //         {
        //             title: "充值总额", x: "day", type: "bar", group: ["server"],
        //             y: [
        //                 {id: "totalCharge", name: "充值总额($)"},
        //                 {id: "newRoleTotalCharge", name: "新增玩家付费总额($)"},
        //             ]
        //         },
        //         {
        //             title: "充值人数", x: "day", type: "bar", group: ["server"],
        //             y: [
        //                 {id: "chargeRoleNum", name: "付费用户"},
        //                 {id: "arppu", name: "ARPPU"},
        //                 {id: "chargeNewRoleNum", name: "新增玩家付费用户"},
        //             ]
        //         }
        //     ],
        //     read: ()=> {
        //         let server = req.body.server.filter(d=> {
        //             return d.checked;
        //         }).map(d=> {
        //             return d.name;
        //         });
        //         let groupStr = group(["server", "day"]);
        //         let whereStr1 = where([condition.rangeDate("date", "day"), condition.optionalSelectNum("serverid", "server"), condition.notEqual("serverid", 0)]);
        //         let whereStr2 = where([condition.rangeDate("date(time)", "day"), condition.optionalSelectNum("serverid", "server"), condition.notEqual("serverid", 0)]);
        //         let buildJoinCondition = (server, table)=> {
        //             if (server.length != 0) {
        //                 return `new.server = ${table}.server and new.day = ${table}.day`;
        //             } else {
        //                 return `new.day = ${table}.day`;
        //             }
        //         };
        //
        //         let sqlCommand = `
        //             select new.day as day,${column.optionalSelect("server", "server", "new")}new.dnu as dnu,round(charge.chargeNewRoleNum/new.dnu,2) dnuRate,
        //                 new.dnuDevice as dnuDevice,new.account as account,new.deviceAcount as deviceAcount,online.pcu as pcu,online.acu as acu,active.dau as dau,
        //                     round((charge.chargeRoleNum/active.dau),2) as rate,active.loginTimes as loginTimes,charge.totalCharge as totalCharge,
        //                         charge.newRoleTotalCharge as newRoleTotalCharge,charge.chargeRoleNum as chargeRoleNum,
        //                             round(charge.totalCharge/charge.chargeRoleNum,2) as arppu,round(charge.newRoleTotalCharge/charge.chargeNewRoleNum) as dnuArppu,
        //                                 charge.chargeNewRoleNum as chargeNewRoleNum
        //             from
        //                 (((select serverid as server,date as day,sum(new_js) as dnu,sum(new_js_dv) as dnuDevice,sum(new_zh) as account,sum(new_zh_dv) as deviceAcount,
        //                     sum(new_dv_js) as activeRole,sum(new_dv) as active from res.new
        //                         ${whereStr1} ${groupStr}) as new
        //             left join
        //                  (select serverid as server,date as day,sum(day_active_js) as dau,sum(day_active_zh) as accountActivation,
        //                     sum(day_active_dv) as deviceActivation,sum(day_login_num) as loginTimes from res.active
        //                         ${whereStr1} ${groupStr}) as active
        //             on ${buildJoinCondition(server, "active")})
        //             left join
        //                  (select serverid as server,date as day,round(sum(day_charge_total),2) as totalCharge,round(sum(day_new_charge_total),2) as newRoleTotalCharge,
        //                     sum(day_pay_user_num) as chargeRoleNum,sum(day_new_pay_user_num) as chargeNewRoleNum
        //                         from res.charge ${whereStr1} ${groupStr}) as charge
        //             on ${buildJoinCondition(server, "charge")})
        //             left join
        //                 (select serverid as server,date(time) as day,max(num) as pcu,round(avg(num),1) as acu from raw.online
        //                     ${whereStr2} ${groupStr}) as online
        //             on ${buildJoinCondition(server, "online")}
        //             order by new.day,new.server
        //             `;
        //         return sqlCommand;
        //     },
        //     readCheck: ()=> {
        //         return check.rangeDay("day") && check.select("server");
        //     }
        // },
        {
            id: "channelInfo",
            name: "渠道查询",
            database: "BI",
            curd: "curd",
            autoRead: true,
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "name", name: "渠道名称", checked: true},
                {id: "type1", name: "计费类型", checked: true},
                {id: "type2", name: "渠道类型", checked: true},
                {id: "channelAM", name: "渠道AM", checked: true},
                {id: "email", name: "邮箱", checked: false},
                {id: "contact", name: "联系人", checked: false},
                {id: "url", name: "后台url地址", checked: false},
                {id: "account", name: "账号", checked: false},
                {id: "password", name: "密码", checked: false},
                {id: "manager", name: "负责人", checked: true},
            ],
            read: "select * from channelinfo"
        },
        {
            id: "channelAlterHistory",
            name: "渠道数据修改记录",
            database: "BI",
            curd: "r",
            autoRead: true,
            columns: [
                {id: "name", name: "渠道名称", checked: true},
                {id: "type", name: "操作类型", checked: true},
                {id: "time", name: "时间", checked: true},
                {id: "user", name: "修改人", checked: true},
            ],
            read: "select * from channelhistory order by time desc"
        },
    ];
};

