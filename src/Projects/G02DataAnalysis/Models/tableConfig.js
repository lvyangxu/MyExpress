/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * type:数据库类型mysql/mongodb，未定义时默认为mysql
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

    //字段拼接
    let column = {
        //前端select控件表示的查询字段,未选中时忽略,选中时返回结尾有","以便于拼接
        optionalSelect: (fieldExpression, param, table)=> {
            let selected = req.body[param].filter(d=> {
                return d.checked;
            }).map(d=> {
                return d.name;
            });
            let str = "";
            let tableStr = table == undefined ? "" : (table + ".");
            if (selected.length != 0) {
                str = `${tableStr}${fieldExpression} as ${param},`;
            }
            return str;
        }
    };

    //查询条件拼接
    let where = (conditionArr)=> {
        let str = "";
        if (conditionArr.length > 0) {
            str = " where " + conditionArr.filter(d=> {
                    return d != "";
                }).join(" and ");
        }
        return str;
    };

    //分组字符串
    let group = (columns)=> {
        let str = "";
        columns = columns.filter(d=> {
            //检查是否是多选插件
            if (req.body.hasOwnProperty(d) && Array.isArray(req.body[d])) {
                let isSelect = req.body[d].every(d1=> {
                    return d1.hasOwnProperty("id") && d1.hasOwnProperty("name") && d1.hasOwnProperty("checked");
                });
                if (isSelect) {
                    //计算选中的个数
                    let selectedNum = req.body[d].filter(d1=> {
                        return d1.checked;
                    }).length;
                    if (selectedNum == 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                return true;
            }
        });
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
        simpleStr: (field, param)=> {
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
        //前端输入框传入的值
        optionalInputStr: (field, param)=> {
            let str = "";
            if (req.body[param] != undefined && req.body[param] != "") {
                str = ` ${field}="${req.body[param]}" `;
            }
            return str;
        },
        //前端输入框传入的模糊匹配值
        optionalInputLikeStr: (field, param)=> {
            let str = "";
            if (req.body[param] != undefined && req.body[param] != "") {
                str = ` ${field} like "%${req.body[param]}%" `;
            }
            return str;
        },
        //不等于固定的值
        notEqual: (field, value)=> {
            let str = ` ${field}<>"${value}" `;
            return str;
        },
        //等于固定的值
        equal: (field, value)=> {
            let str = ` ${field}="${value}" `;
            return str;
        },
    };

    //参数检查
    let check = {
        //固定时间
        day: (param)=> {
            let hasParam = req.body.hasOwnProperty(param);
            let regex = /^\d{4}-\d{2}-\d{2}$/;
            let isValid = regex.test(req.body[param]);
            return hasParam && isValid;
        },
        //范围时间-天
        rangeDay: (param)=> {
            let hasParam = req.body.hasOwnProperty(param) && req.body[param].hasOwnProperty("start") && req.body[param].hasOwnProperty("end");
            let regex = /^\d{4}-\d{2}-\d{2}$/;
            let isValid = regex.test(req.body[param].start) && regex.test(req.body[param].end);
            return hasParam && isValid;
        },
        //范围时间-秒
        rangeSecond: (param)=> {
            let hasParam = req.body.hasOwnProperty(param) && req.body[param].hasOwnProperty("start") && req.body[param].hasOwnProperty("end");
            let regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            let isValid = regex.test(req.body[param].start) && regex.test(req.body[param].end);
            return hasParam && isValid;
        },
        //多选插件的数组
        select: (param)=> {
            let hasParam = req.body.hasOwnProperty(param);
            let isValid = Array.isArray(req.body[param]);
            return hasParam && isValid;
        },
        //必要条件,参数必须匹配正则
        regex: (param, regex)=> {
            if (req.body.hasOwnProperty(param) && req.body[param] != "") {
                return regex.test(req.body[param]);
            } else {
                return false;
            }
        },
        //可选条件,参数不为""时必须匹配正则,为""时忽略
        optionalRegex: (param, regex)=> {
            if (req.body.hasOwnProperty(param) && req.body[param] != "") {
                return regex.test(req.body[param]);
            } else {
                return true;
            }
        },
    };

    //通过mysql数据库,初始化服务端筛选控件的数据
    let initMysqlServerFilter = (pool, sqlCommand)=> {
        return global.mysql.excuteQuery({
            pool: pool,
            sqlCommand: sqlCommand
        });
    };

    return [
        {
            id: "daily",
            database: "log_nuclear",
            curd: "r",
            autoRead: true,
            columns: [
                {id: "day", name: "日期", checked: true, type: "rangeDay", serverFilter: true, dateAdd: {startAdd: -7}},
                {
                    id: "server",
                    name: "服务器",
                    checked: true,
                    type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from res.new where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
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
                {id: "totalCharge", name: "日充值总额($)", checked: true},
                {id: "newRoleTotalCharge", name: "日新增玩家付费总额($)", checked: true},
                {id: "chargeRoleNum", name: "日付费用户数", checked: true},
                {id: "chargeNewRoleNum", name: "日新增玩家付费用户数", checked: true},
                {id: "charge3DayRoleNum", name: "连续三天付费用户数", checked: true},
            ],
            chart: [
                {
                    title: "新增", x: "day", type: "bar", group: ["server"],
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
                    title: "在线人数", x: "day", type: "bar", group: ["server"],
                    y: [
                        {id: "maxOnline", name: "最高"},
                        {id: "avgOnline", name: "平均"},
                    ]
                },
                {
                    title: "活跃", x: "day", type: "bar", group: ["server"],
                    y: [
                        {id: "roleActivation", name: "角色数"},
                        {id: "accountActivation", name: "账号数"},
                        {id: "deviceActivation", name: "设备数"},
                        {id: "loginTimes", name: "登录次数"},
                    ]
                },
                {
                    title: "充值总额", x: "day", type: "bar", group: ["server"],
                    y: [
                        {id: "totalCharge", name: "充值总额($)"},
                        {id: "newRoleTotalCharge", name: "新增玩家付费总额($)"},
                    ]
                },
                {
                    title: "充值人数", x: "day", type: "bar", group: ["server"],
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
                let groupStr = group(["server", "day"]);
                let whereStr1 = where([condition.rangeDate("date", "day"), condition.optionalSelectNum("serverid", "server"), condition.notEqual("serverid", 0)]);
                let whereStr2 = where([condition.rangeDate("date(time)", "day"), condition.optionalSelectNum("serverid", "server"), condition.notEqual("serverid", 0)]);
                let buildJoinCondition = (server, table)=> {
                    if (server.length != 0) {
                        return `new.server = ${table}.server and new.day = ${table}.day`;
                    } else {
                        return `new.day = ${table}.day`;
                    }
                };

                let sqlCommand = `
                    select new.day as day,${column.optionalSelect("server", "server", "new")}new.role as role,new.deviceRole as deviceRole,new.account as account,new.deviceAcount as deviceAcount,
                        new.activeRole as activeRole,new.active as active,online.maxNum as maxOnline,online.avgNum as avgOnline,active.roleActivation as roleActivation,
                            active.accountActivation as accountActivation,active.deviceActivation as deviceActivation,active.loginTimes as loginTimes,
                                charge.totalCharge as totalCharge,charge.newRoleTotalCharge as newRoleTotalCharge,charge.chargeRoleNum as chargeRoleNum,
                                    charge.chargeNewRoleNum as chargeNewRoleNum,charge.charge3DayRoleNum as charge3DayRoleNum
                    from
                        (((select serverid as server,date as day,sum(new_js) as role,sum(new_js_dv) as deviceRole,sum(new_zh) as account,sum(new_zh_dv) as deviceAcount,
                            sum(new_dv_js) as activeRole,sum(new_dv) as active from res.new
                                ${whereStr1} ${groupStr}) as new
                    left join 
                         (select serverid as server,date as day,sum(day_active_js) as roleActivation,sum(day_active_zh) as accountActivation,
                            sum(day_active_dv) as deviceActivation,sum(day_login_num) as loginTimes from res.active 
                                ${whereStr1} ${groupStr}) as active
                    on ${buildJoinCondition(server, "active")})
                    left join
                         (select serverid as server,date as day,round(sum(day_charge_total),2) as totalCharge,round(sum(day_new_charge_total),2) as newRoleTotalCharge,
                            sum(day_pay_user_num) as chargeRoleNum,sum(day_new_pay_user_num) as chargeNewRoleNum,sum(continus_pay_user_num) as charge3DayRoleNum
                                from res.charge ${whereStr1} ${groupStr}) as charge
                    on ${buildJoinCondition(server, "charge")})
                    left join
                        (select serverid as server,date(time) as day,max(num) as maxNum,round(avg(num),1) as avgNum from raw.online 
                            ${whereStr2} ${groupStr}) as online
                    on ${buildJoinCondition(server, "online")}
                    order by new.day,new.server
                    `;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.rangeDay("day") && check.select("server");
            }
        },
        {
            id: "resource",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {id: "day", name: "日期", checked: true, type: "rangeDay", serverFilter: true, dateAdd: {startAdd: -7}},
                {
                    id: "server",
                    name: "服务器",
                    checked: true,
                    type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverId as server from log_nuclear.diamond_data where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "source", name: "类型", checked: true, clientFilter: true, type: "select"},
                {id: "roleNum", name: "人数", checked: true},
                {id: "times", name: "次数", checked: true},
                {id: "value", name: "值", checked: true},
            ],
            extraFilter: [
                {id: "resourceType", name: "资源类型", type: "radio", data: ["金钻", "钻石", "银币", "体力"]},
                {
                    id: "vipLevel",
                    name: "vip等级",
                    type: "select",
                    data: (pool)=> {
                        let sqlCommand = "select distinct vipLevel from log_nuclear.diamond_data";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                }
            ],
            chart: [
                {
                    title: "资源汇总-值", x: "day", type: "bar", group: ["source"],
                    y: [
                        {id: "value", name: "值"},
                    ]
                },
                {
                    title: "资源汇总-人数", x: "day", type: "bar", group: ["source"],
                    y: [
                        {id: "roleNum", name: "人数"},
                    ]
                },
                {
                    title: "资源汇总-次数", x: "day", type: "bar", group: ["source"],
                    y: [
                        {id: "times", name: "次数"},
                    ]
                },
            ],
            read: ()=> {
                let timesStr, valueStr;
                switch (req.body.resourceType) {
                    case "金钻":
                        timesStr = "jinzuan_count";
                        valueStr = "jinzuan_value";
                        break;
                    case "钻石":
                        timesStr = "zuansi_count";
                        valueStr = "zuansi_value";
                        break;
                    case "银币":
                        timesStr = "yinbi_count";
                        valueStr = "yinbi_value";
                        break;
                    case "体力":
                        timesStr = "tili_count";
                        valueStr = "tili_value";
                        break;
                }
                let whereArr = [
                    condition.optionalSelectNum("serverId", "server"),
                    condition.notEqual("serverId", 0),
                    condition.rangeDate("date", "day"),
                    condition.optionalSelectNum("vipLevel", "vipLevel"),
                    condition.notEqual(valueStr, 0)
                ];
                let whereStr = where(whereArr);
                let groupStr = group(["server", "day", "source"]);
                let sqlCommand = `select date as day,serverId as server,source,count(distinct roleId) as roleNum,sum(${timesStr}) as times,sum(${valueStr}) as value
                                    from log_nuclear.diamond_data  
                                        ${whereStr} ${groupStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.rangeDay("day") && check.select("server") && check.select("vipLevel");
            },
            readMap: (data)=> {
                let sourceArr = [
                    {id: "1320930600", name: "精英秘境探宝-重置地图"},
                    {id: "1571031800", name: "跨服军团战-押注"},
                    {id: "60270700", name: "挖矿-一键挖矿"},
                    {id: "320260500", name: "宝石合成-宝石拆分"},
                    {id: "370280400", name: "宝物星级交换-宝物神铸"},
                    {id: "1050790300", name: "军团技能-交换伙伴军团技能"},
                    {id: "1461000200", name: "武道会-清除冷却时间"},
                    {id: "1440980400", name: "元素攻击位-符文强化"},
                    {id: "1420960800", name: "怪物攻城-强化"},
                    {id: "1410000000", name: "梦想基金-??日志有问题"},
                    {id: "1461000300", name: "武道会-购买竞技场挑战次数"},
                    {id: "1420960700", name: "怪物攻城-复活"},
                    {id: "1050790000", name: "军团技能-使用卷轴"},
                    {id: "1440980800", name: "元素攻击位-符文转化"},
                    {id: "1520450900", name: "超能币礼盒-购买超能币礼盒"},
                    {id: "1440980900", name: "元素攻击位-符文进化"},
                    {id: "30290200", name: "消除冷却时间"},
                    {id: "40140100", name: "普通招募"},
                    {id: "40140101", name: "高级招募"},
                    {id: "92000100", name: "创建军团"},
                    {id: "200210400", name: "一键钻石抽卡"},
                    {id: "200210500", name: "点亮高级箱"},
                    {id: "250200000", name: "招财"},
                    {id: "80250001", name: "淘宝-按钮1"},
                    {id: "80250002", name: "淘宝-按钮2"},
                    {id: "80250003", name: "淘宝-按钮3"},
                    {id: "340230101", name: "顶水果小倍数"},
                    {id: "340230102", name: "顶水果中倍数"},
                    {id: "340230103", name: "顶水果大倍数"},
                    {id: "560580000", name: "购买体力"},
                    {id: "200210200", name: "抽取一次卡带"},
                    {id: "200210310", name: "一键银币10次"},
                    {id: "200210350", name: "一键银币50次"},
                    {id: "660640800", name: "世界BOSS-buff强化"},
                    {id: "60270100", name: "挖矿"},
                    {id: "20150200", name: "装备鉴定"},
                    {id: "60270300", name: "开辟矿洞"},
                    {id: "260210700", name: "洗练卡带"},
                    {id: "630450500", name: "手动刷新随机商城物品"},
                    {id: "660640700", name: "世界BOSS-复活"},
                    {id: "10240700", name: "重置地图"},
                    {id: "390150500", name: "装备精炼"},
                    {id: "30290600", name: "购买竞技场挑战次数"},
                    {id: "680470500", name: "买弹药"},
                    {id: "390150600", name: "属性恢复"},
                    {id: "630450400", name: "购买随机商城物品"},
                    {id: "460610700", name: "刷新扫荡次数"},
                    {id: "310300100", name: "送花"},
                    {id: "610450200", name: "购买普通商城物品"},
                    {id: "92020100", name: "军团贡献"},
                    {id: "1012041600", name: "召唤BOSS"},
                    {id: "110720200", name: "购买物品"},
                    {id: "620450200", name: "VIP礼包"},
                    {id: "962030100", name: "军团红包"},
                    {id: "200210555", name: "点亮高级箱子"},
                    {id: "1190450700", name: "限量商城"},
                    {id: "737081212", name: "折扣商城"},
                    {id: "1160000000", name: "月卡礼包"},
                    {id: "1112052100", name: "刷新收集任务"},
                    {id: "472010900", name: "军团捐献"},
                    {id: "1112080200", name: "幸运魔轮改运"},
                    {id: "1180000000", name: "成长基金"}
                ];
                data = data.map(d=> {
                    let findData = sourceArr.find(d1=> {
                        return d1.id == d.source;
                    });
                    if (findData != undefined) {
                        d.source = findData.name;
                    }
                    return d;
                });
                return data;
            }
        },
        {
            id: "charge",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", serverFilter: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from raw.charge where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "money", name: "充值金额($)", checked: true},
                {id: "num", name: "充值笔数", checked: true},
                {id: "arrivalTime", name: "到帐时间", checked: true},
                {id: "orderId", name: "订单号", checked: true, type: "integer", serverFilter: true},
                {id: "chargeChannel", name: "充值渠道", checked: true},
                {id: "chargeClient", name: "充值站点", checked: true},
                {
                    id: "chargeStatus", name: "充值状态", checked: true, type: "select", serverFilter: true,
                    data: [
                        {id: "0", name: "非正式充值", checked: false},
                        {id: "1", name: "正式充值", checked: true}
                    ]
                },
                {id: "device", name: "设备id", checked: true},
                {id: "second", name: "充值时间", checked: true, type: "rangeSecond", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.optionalInputStr("js_id", "role"),
                    condition.optionalInputStr("orderid", "orderId"),
                    condition.optionalSelectStr("status", "chargeStatus"),
                    condition.rangeDate("time", "second"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                whereStr = whereStr.replace(/非正式充值/, "0");
                whereStr = whereStr.replace(/正式充值/, "1");
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,
                                    round(money,2) as money,amount as num,transtamp as arrivalTime,orderid as orderId,now_channel as chargeChannel,
                                        now_ptid as chargeClient,status as chargeStatus,dv_id as device,time as second from raw.charge ${whereStr} limit 5000`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.optionalRegex("role", /^\d+$/) && check.optionalRegex("orderId", /^\d+$/) && check.select("chargeStatus") &&
                    check.rangeSecond("second") && check.select("server");
            }
        },
        {
            id: "cost",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", serverFilter: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from raw.cost where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "costKey", name: "来源", checked: true},
                {id: "gold", name: "花费金钻数", checked: true},
                {id: "diamond", name: "花费钻石数", checked: true},
                {id: "silver", name: "花费银币数", checked: true},
                {id: "leftGold", name: "剩余金钻数", checked: true},
                {id: "leftDiamond", name: "剩余钻石数", checked: true},
                {id: "leftSilver", name: "剩余银币数", checked: true},
                {id: "device", name: "设备id", checked: true},
                {id: "second", name: "消耗时间", checked: true, type: "rangeSecond", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.optionalInputStr("js_id", "role"),
                    condition.rangeDate("time", "second"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,cost_key as costKey,
                                    jinzuan as gold,zuansi as diamond,yinbi as silver,jinzuan_total as leftGold,zuansi_total as leftDiamond,yinbi_total as leftSilver,
                                        dv_id as device,time as second from raw.cost ${whereStr} limit 5000`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.optionalRegex("role", /^\d+$/) && check.rangeSecond("second") && check.select("server");
            }
        },
        {
            id: "stamina",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", serverFilter: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from raw.tili_buy where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "totalStamina", name: "当前身上体力总额", checked: true},
                {id: "stamina", name: "购买体力", checked: true},
                {id: "device", name: "设备id", checked: true},
                {id: "second", name: "购买时间", checked: true, type: "rangeSecond", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.optionalInputStr("js_id", "role"),
                    condition.rangeDate("time", "second"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,tili_total as totalStamina,
                                    tili as stamina,dv_id as device,time as second from raw.tili_buy ${whereStr} limit 5000`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.rangeSecond("second") && check.select("server") && check.optionalRegex("role", /^\d+$/);
            }
        },
        {
            id: "produce",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", serverFilter: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from raw.shouyi where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "costKey", name: "来源", checked: true},
                {id: "gold", name: "产出金钻数", checked: true},
                {id: "diamond", name: "产出钻石数", checked: true},
                {id: "silver", name: "产出银币数", checked: true},
                {id: "leftGold", name: "剩余金钻数", checked: true},
                {id: "leftDiamond", name: "剩余钻石数", checked: true},
                {id: "leftSilver", name: "剩余银币数", checked: true},
                {id: "device", name: "设备id", checked: true},
                {id: "sid", name: "sid", checked: true},
                {id: "stamina", name: "体力", checked: true},
                {id: "second", name: "消耗时间", checked: true, type: "rangeSecond", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.optionalInputStr("js_id", "role"),
                    condition.rangeDate("time", "second"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,jinzuan as gold,
                                    zuansi as diamond,yinbi as silver,jinzuan_total as leftGold,zuansi_total as leftDiamond,yinbi_total as leftSilver,
                                        dv_id as device,time as second,sid,tili as stamina from raw.shouyi ${whereStr} limit 5000`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.optionalRegex("role", /^\d+$/) && check.rangeSecond("second") && check.select("server");
            }
        },
        {
            id: "action",
            type: "mongodb",
            database: "g02_log",
            collection: ()=> {
                return req.body.server;
            },
            curd: "r",
            rowPerPage: 100,
            dynamicColumn: [
                {id: "addbullet", name: "获得狩猎场子弹", checked: true},
                {id: "shuiguo11", name: "顶水果11", checked: true},
                {id: "shuiguo15", name: "顶水果15", checked: true},
                {id: "shuiguo17", name: "顶水果17", checked: true},
                {id: "shuiguo7", name: "顶水果7", checked: true},
                {id: "shuiguo9", name: "顶水果9", checked: true},
                {id: "shuiguo13", name: "顶水果13", checked: true},
                {id: "shuiguo3", name: "顶水果3", checked: true},
                {id: "shuiguo4", name: "顶水果4", checked: true},
                {id: "shuiguo1", name: "顶水果1", checked: true},
                {id: "shuiguo5", name: "顶水果5", checked: true},
                {id: "shuiguo", name: "顶水果", checked: true},
                {id: "shuiguo2", name: "顶水果2", checked: true},
                {id: "clubwilldestory", name: "军团解散倒计时开始", checked: true},
                {id: "destorystarttime", name: "军团解散倒计时开始的时间", checked: true},
                {id: "buyer", name: "拍卖行-买家记录", checked: true},
                {id: "buyer_name", name: "拍卖行-买家名字记录", checked: true},
                {id: "end_time", name: "下架时间", checked: true},
                {id: "paimaiPrice", name: "拍卖行-价格", checked: true},
                {id: "paimaiSID", name: "拍卖行-物品sid", checked: true},
                {id: "paimaiUID", name: "拍卖行-物品uid", checked: true},
                {id: "price", name: "拍卖行-价格", checked: true},
                {id: "seller", name: "拍卖行-卖家记录", checked: true},
                {id: "seller_name", name: "拍卖行-卖家记录", checked: true},
                {id: "start_time", name: "上架时间", checked: true},
                {id: "jinzuancost", name: "非绑钻消费", checked: true},
                {id: "AchiveEnum", name: "活动-规则类型", checked: true},
                {id: "Description", name: "活动-规则描述", checked: true},
                {id: "rule_id", name: "活动-活动规则", checked: true},
                {id: "newExtraExp", name: "新的额外经验加成数量%", checked: true},
                {id: "newExtraGold", name: "新的额外金币加成数量%", checked: true},
                {id: "oldExtraExp", name: "旧的额外经验加成数量%", checked: true},
                {id: "oldExtraGold", name: "旧的额外金币加成数量%", checked: true},
                {id: "jinzuan", name: "非绑钻获得", checked: true},
                {id: "jinzuan_total", name: "非绑钻总数", checked: true},
                {id: "flv", name: "试炼神殿-对应func的当前等级", checked: true},
                {id: "func", name: "试炼神殿-功能ID", checked: true},
                {id: "todaylootnumber", name: "跨服资源争夺-今天的掠夺次数", checked: true},
                {id: "buynum", name: "购买次数", checked: true},
                {id: "jtPk", name: "军团pk", checked: true},
                {id: "yaoqian_yaoshi", name: "摇钱树-钥匙", checked: true},
                {id: "yaoqian_yaoshi_total", name: "摇钱树-钥匙总数", checked: true},
                {id: "jyfd", name: "精英副本", checked: true},
                {id: "zuanshicost", name: "绑钻消费", checked: true},
                {id: "todayzhanling", name: "跨服资源争夺-今天的占领次数", checked: true},
                {id: "clubuid", name: "军团UID", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "jiaoxuecur", name: "教学-当前教学点", checked: true},
                {id: "jiaoxuejindu", name: "教学-当前教学进度", checked: true},
                {id: "sh_meili", name: "魅力值获得", checked: true},
                {id: "sh_meili_total", name: "魅力值总数", checked: true},
                {id: "jjc_lingpai", name: "竞技场令牌获得", checked: true},
                {id: "jjc_lingpai_total", name: "竞技场令牌总数", checked: true},
                {id: "ptfd", name: "普通副本", checked: true},
                {id: "zhenying", name: "阵营", checked: true},
                {id: "mapID", name: "普通秘境和精英秘境的地图ID", checked: true},
                {id: "cubeArg", name: "魔方奖励参数", checked: true},
                {id: "cubeIndex", name: "魔方中奖索引", checked: true},
                {id: "cubeType", name: "魔方奖励参数", checked: true},
                {id: "extend", name: "额外信息", checked: true},
                {id: "attach", name: "附件", checked: true},
                {id: "mailinfo", name: "邮件信息", checked: true},
                {id: "gveID", name: "自由组队和军团组队的副本ID", checked: true},
                {id: "type2", name: "区分自由组队和军团组队", checked: true},
                {id: "tili", name: "体力获得", checked: true},
                {id: "tili_total", name: "体力总数", checked: true},
                {id: "backbullet", name: "狩猎场返还子弹", checked: true},
                {id: "bigpetid", name: "狩猎场大宠物（不同阶段打出的宠物）", checked: true},
                {id: "cjid", name: "狩猎场场景ID", checked: true},
                {id: "curBullet", name: "狩猎场当前子弹数量", checked: true},
                {id: "curMax", name: "狩猎场当前出小宠物的要求值", checked: true},
                {id: "curNum", name: "狩猎场当前小宠物达到值", checked: true},
                {id: "fire", name: "狩猎场-开火", checked: true},
                {id: "largecurMax", name: "狩猎场当前出大宠物的要求值", checked: true},
                {id: "largecurNum", name: "狩猎场当前出大宠物的达到值", checked: true},
                {id: "monsterid", name: "怪物ID", checked: true},
                {id: "petid", name: "宠物ID", checked: true},
                {id: "zuanshi", name: "绑钻获得", checked: true},
                {id: "zuanshi_total", name: "绑钻总数", checked: true},
                {id: "jjc_score", name: "竞技场积分获得", checked: true},
                {id: "jjc_score_total", name: "竞技场积分总数", checked: true},
                {id: "yinbi", name: "金币获得", checked: true},
                {id: "yinbi_total", name: "金币总数", checked: true},
                {id: "curr_teamexp", name: "当前队伍经验", checked: true},
                {id: "curr_teamexpadded", name: "当前增加的队伍经验", checked: true},
                {id: "curr_teamlevel", name: "当前队伍等级", checked: true},
                {id: "wupin", name: "物品栏", checked: true, thStyle: {"min-width": "100px"}},
                {id: "module", name: "模块ID", checked: true},
                {id: "pk", name: "玩家PK", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "timestamp", name: "时间", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "type", name: "操作类型", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "mac", name: "mac", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "idfa", name: "idfa", checked: true, tdStyle: {"white-space": "nowrap"}},
            ],
            columns: [],
            extraFilter: [
                {
                    id: "server", name: "服务器id", checked: true, type: "radio", serverFilter: true,
                    data: (db)=> {
                        return db.collections();
                    },
                    dataMap: (data)=> {
                        data = data.map(d=> {
                            d.server = d.s.name;
                            return d;
                        });
                        return data;
                    }
                },
                {id: "second", name: "时间", type: "rangeSecond", dateAdd: -7},
                {id: "pk", name: "角色pk", type: "integer", placeholder: "角色pk,必填", required: true},
                {
                    id: "module", name: "模块", type: "radio",
                    data: [
                        "角色战力", "角色登出", "教学", "角色创建", "等级提升", "最后登录信息", "costGVEnum", "阵营选择", "账号创建", "角色登录", "充值订单",
                        "充值发货",
                        "成长基金", "梦想基金", "月卡礼包购买", "月卡礼包领取", "充值活动", "日常活动", "活动", "限时礼包", "转轮活动", "魔方礼包", "招财猫",
                        "顶水果", "高级挖矿", "收矿", "随机矿石", "一键挖矿", "一键收矿", "拍卖行物品上架", "拍卖行到期下架", "拍卖行购买物品", "拍卖行物品售出",
                        "宝石城抽一次", "宝石城抽次", "宝石城抽次", "普通狩猎场击杀获得饲料", "普通狩猎场捕获宠物", "普通狩猎场购买子弹", "普通狩猎场击杀buff怪",
                        "普通狩猎场击杀任务怪", "普通狩猎场领取任务奖励", "普通狩猎场击杀宝箱怪", "钻石场捕获宠物", "等级礼包", "VIP礼包", "限量商场", "超能币礼盒",
                        "超能币商场", "超级英雄", "抽取碎片", "英雄拆分", "英雄升级", "英雄升阶", "军团副本", "军团组队副本", "军团捐献", "军团BOSS", "主线副本",
                        "精英副本一次消耗及获得", "精英副本扫荡次消耗及获得", "精英副本重置扫荡次数钻石消耗", "自由组队", "秘境探宝普通：触发战斗",
                        "秘境探宝普通：战斗结束", "秘境探宝普通：扫荡", "秘境探宝普通：随机宝箱奖励", "秘境探宝普通：重置", "秘境探宝精英：触发战斗",
                        "秘境探宝精英：战斗结束", "秘境探宝精英：扫荡", "秘境探宝精英：重置", "元素塔挑战结束", "元素塔扫荡结束", "抽卡金币", "抽卡钻石",
                        "卡带洗练", "吞噬卡带", "合成卡带", "宝石合成", "宝石宝石拆分", "宝石一键合成", "天赋分解装备", "天赋提升技能", "邮件收到邮件",
                        "邮件查看邮件", "邮件领取附件", "邮件删除邮件", "背包使用物品", "背包出售物品", "天登陆", "签到每日签到奖励", "签到累计签到奖励",
                        "星际掠夺刷新", "星际掠夺收矿", "星际掠夺占领/掠夺"
                    ]
                }
            ],
            read: ()=> {
                let {start, end} = req.body.second;
                [start, end] = [start, end].map(d=> {
                    let arr = d.split(" ");
                    let arr1 = arr[0].split("-");
                    let arr2 = arr[1].split(":");
                    let date = new Date(arr1[0], arr1[1] - 1, arr1[2], arr2[0], arr2[1], arr2[2]);
                    let timestamp = date.getTime();
                    return timestamp;
                });
                let jsonFilter = {
                    timestamp: {"$gte": `${start}`, "$lte": `${end}`},
                };

                let actionMap = [
                    {id: "juesezhanli", name: "角色战力"},
                    {id: "js_logout", name: "角色登出"},
                    {id: "JiaoXue", name: "教学"},
                    {id: "js_create", name: "角色创建"},
                    {id: "lvup", name: "等级提升"},
                    {id: "login_last_info", name: "最后登录信息"},
                    {id: "costGVEnum", name: "costGVEnum"},
                    {id: "zhenyingxuanze", name: "阵营选择"},
                    {id: "zh_create", name: "账号创建"},
                    {id: "js_login", name: "角色登录"},
                    {id: "chargeing", name: "充值订单"},
                    {id: "cz_rmb", name: "充值发货"},
                ];
                let moduleMap = [
                    {id: "118-1", name: "成长基金"},
                    {id: "141-1", name: "梦想基金"},
                    {id: "116-0", name: "月卡礼包购买"},
                    {id: "116-1", name: "月卡礼包领取"},
                    {id: "107-8100", name: "充值活动"},
                    {id: "107-8400", name: "日常活动"},
                    {id: "151-7417", name: "活动"},
                    {id: "23-3303", name: "限时礼包"},
                    {id: "136-9401", name: "转轮活动"},
                    {id: "148-", name: "魔方礼包"},
                    {id: "25-2000", name: "招财猫"},
                    {id: "34-2301", name: "顶水果"},
                    {id: "6-2701", name: "高级挖矿"},
                    {id: "6-2702", name: "收矿"},
                    {id: "6-2705", name: "随机矿石"},
                    {id: "6-2707", name: "一键挖矿"},
                    {id: "6-2708", name: "一键收矿"},
                    {id: "11-7204", name: "拍卖行物品上架"},
                    {id: "11-7206", name: "拍卖行到期下架"},
                    {id: "11-7202", name: "拍卖行购买物品"},
                    {id: "11-7207", name: "拍卖行物品售出"},
                    {id: "8-2500", name: "宝石城抽一次"},
                    {id: "8-2500", name: "宝石城抽50次"},
                    {id: "8-2500", name: "宝石城抽400次"},
                    {id: "68-4702", name: "普通狩猎场击杀获得饲料"},
                    {id: "68-4704", name: "普通狩猎场捕获宠物"},
                    {id: "68-4705", name: "普通狩猎场购买子弹"},
                    {id: "68-4709", name: "普通狩猎场击杀buff怪"},
                    {id: "68-4710", name: "普通狩猎场击杀任务怪"},
                    {id: "68-4711", name: "普通狩猎场领取任务奖励"},
                    {id: "68-4713", name: "普通狩猎场击杀宝箱怪"},
                    {id: "131-9103", name: "钻石场捕获宠物"},
                    {id: "61-4502", name: "等级礼包"},
                    {id: "62-4502", name: "VIP礼包"},
                    {id: "119-4507", name: "限量商场"},
                    {id: "152-4509", name: "超能币礼盒"},
                    {id: "153-4511", name: "超能币商场"},
                    {id: "123-1404", name: "超级英雄"},
                    {id: "4-1401", name: "抽取碎片"},
                    {id: "16-1306", name: "英雄拆分"},
                    {id: "123-1304", name: "英雄升级"},
                    {id: "123-1305", name: "英雄升阶"},
                    {id: "104-7802", name: "军团副本"},
                    {id: "Apr-47", name: "军团组队副本"},
                    {id: "47-20109", name: "军团捐献"},
                    {id: "23-1305", name: "军团BOSS"},
                    {id: "50-", name: "主线副本"},
                    {id: "46-6106", name: "精英副本一次消耗及获得"},
                    {id: "46-6103", name: "精英副本扫荡3次消耗及获得"},
                    {id: "46-6107", name: "精英副本重置扫荡次数钻石消耗"},
                    {id: "97-", name: "自由组队"},
                    {id: "1-2403", name: "秘境探宝普通：触发战斗"},
                    {id: "1-2404", name: "秘境探宝普通：战斗结束"},
                    {id: "1-2405", name: "秘境探宝普通：扫荡"},
                    {id: "1-2406", name: "秘境探宝普通：随机宝箱奖励"},
                    {id: "1-2407", name: "秘境探宝普通：重置"},
                    {id: "132-9302", name: "秘境探宝精英：触发战斗"},
                    {id: "132-9303", name: "秘境探宝精英：战斗结束"},
                    {id: "132-9305", name: "秘境探宝精英：扫荡"},
                    {id: "132-9306", name: "秘境探宝精英：重置"},
                    {id: "143-9702", name: "元素塔挑战结束"},
                    {id: "143-9703", name: "元素塔扫荡结束"},
                    {id: "20-2103", name: "抽卡金币"},
                    {id: "20-2104", name: "抽卡钻石"},
                    {id: "26-2107", name: "卡带洗练"},
                    {id: "20-2110", name: "吞噬卡带"},
                    {id: "27-2106", name: "合成卡带"},
                    {id: "32-2603", name: "宝石合成"},
                    {id: "32-2605", name: "宝石宝石拆分"},
                    {id: "30-2604", name: "宝石一键合成"},
                    {id: "4600-4603", name: "天赋分解装备"},
                    {id: "4600-4601", name: "天赋提升技能"},
                    {id: "23-3303", name: "邮件收到邮件"},
                    {id: "23-3302", name: "邮件查看邮件"},
                    {id: "23-3305", name: "邮件领取附件"},
                    {id: "23-3306", name: "邮件删除邮件"},
                    {id: "17-1203", name: "背包使用物品"},
                    {id: "17-1201", name: "背包出售物品"},
                    {id: "70-6501", name: "7天登陆"},
                    {id: "57-4300", name: "签到每日签到奖励"},
                    {id: "57-4303", name: "签到累计签到奖励"},
                    {id: "154-10202", name: "星际掠夺刷新"},
                    {id: "154-10216", name: "星际掠夺收矿"},
                    {id: "154-10203", name: "星际掠夺占领/掠夺"},
                ];
                let module = req.body.module;
                let [findAction,findModule] = [actionMap, moduleMap].map(d=> {
                    let findElement = d.find(d1=> {
                        return d1.name == module;
                    });
                    return findElement;
                });
                if (findAction != undefined) {
                    type = "action";
                    module = findAction.id;
                    jsonFilter.action = `${module}`;
                }
                let module1 = "", module2 = "";
                if (findModule != undefined) {
                    type = "module";
                    module = findModule.id;
                    let arr = module.split("-");
                    if (arr.length == 2) {
                        module1 = arr[0];
                        module2 = arr[1];
                        jsonFilter.module = module1;
                        jsonFilter.type = module2;
                    }
                }
                if (req.body.pk != undefined && req.body.pk != "") {
                    jsonFilter.pk = req.body.pk;
                }
                return jsonFilter;
            },
            limitNum: 5000,
            sort: {"timestamp": 1},
            readCheck: ()=> {
                let moduleRegex = new RegExp("^(角色战力|角色登出|教学|角色创建|等级提升|最后登录信息|costGVEnum|阵营选择|账号创建|角色登录|充值订单|充值发货|" +
                    "成长基金|梦想基金|月卡礼包购买|月卡礼包领取|充值活动|日常活动|活动|限时礼包|转轮活动|魔方礼包|招财猫|顶水果|高级挖矿" +
                    "|收矿|随机矿石|一键挖矿|一键收矿|拍卖行物品上架|拍卖行到期下架|拍卖行购买物品|拍卖行物品售出|宝石城抽一次|宝石城抽次|宝石城抽次" +
                    "|普通狩猎场击杀获得饲料|普通狩猎场捕获宠物|普通狩猎场购买子弹|普通狩猎场击杀buff怪|普通狩猎场击杀任务怪|普通狩猎场领取任务奖励" +
                    "|普通狩猎场击杀宝箱怪|钻石场捕获宠物|等级礼包|VIP礼包|限量商场|超能币礼盒|超能币商场|超级英雄|抽取碎片|英雄拆分|英雄升级|英雄升阶|军团副本" +
                    "|军团组队副本|军团捐献|军团BOSS|主线副本|精英副本一次消耗及获得|精英副本扫荡次消耗及获得|精英副本重置扫荡次数钻石消耗|自由组队" +
                    "|秘境探宝普通：触发战斗|秘境探宝普通：战斗结束|秘境探宝普通：扫荡|秘境探宝普通：随机宝箱奖励|秘境探宝普通：重置|秘境探宝精英：触发战斗" +
                    "|秘境探宝精英：战斗结束|秘境探宝精英：扫荡|秘境探宝精英：重置|元素塔挑战结束|元素塔扫荡结束|抽卡金币|抽卡钻石|卡带洗练|吞噬卡带|合成卡带" +
                    "|宝石合成|宝石宝石拆分|宝石一键合成|天赋分解装备|天赋提升技能|邮件收到邮件|邮件查看邮件|邮件领取附件|邮件删除邮件|背包使用物品|背包出售物品" +
                    "|天登陆|签到每日签到奖励|签到累计签到奖励|星际掠夺刷新|星际掠夺收矿|星际掠夺占领/掠夺)$");
                return check.rangeSecond("second") && check.regex("pk", /^\d+$/) && check.optionalRegex("server", /^s\d+$/)
                    && check.regex("module", moduleRegex);
            },
            readMap: (data)=> {
                let actionMap = [
                    {id: "juesezhanli", name: "角色战力"},
                    {id: "js_logout", name: "角色登出"},
                    {id: "JiaoXue", name: "教学"},
                    {id: "js_create", name: "角色创建"},
                    {id: "lvup", name: "等级提升"},
                    {id: "login_last_info", name: "最后登录信息"},
                    {id: "costGVEnum", name: "costGVEnum"},
                    {id: "zhenyingxuanze", name: "阵营选择"},
                    {id: "zh_create", name: "账号创建"},
                    {id: "js_login", name: "角色登录"},
                    {id: "chargeing", name: "充值订单"},
                    {id: "cz_rmb", name: "充值发货"},
                ];
                data = data.map(d=> {
                    let isFind = actionMap.find(d1=> {
                        return d1.id == d.action;
                    });
                    if (isFind != undefined) {
                        d.action = isFind.name;
                    }
                    if (d.hasOwnProperty("timestamp") && d.timestamp != "") {
                        let date = new Date(Number.parseInt(d.timestamp));
                        let [year,month,day,hour,minute,second] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
                        [month, day, hour, minute, second] = [month, day, hour, minute, second].map(d1=> {
                            d1 = d1 < 10 ? ("0" + d1) : d1;
                            return d1;
                        });
                        d.timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                    }
                    return d;
                });
                return data;
            }
        },
        {
            id: "retentionAndLtv",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverId as server from log_nuclear.login_data where serverId <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {
                    id: "day",
                    name: "日期",
                    checked: true,
                    type: "rangeDay",
                    serverFilter: true,
                    tdStyle: {"white-space": "nowrap"}
                },
                {id: "dnu", name: "DNU", checked: true},
                {id: "retention1", name: "次日留存", checked: true, suffix: "%"},
                {id: "retention2", name: "2日留存", checked: true, suffix: "%"},
                {id: "retention3", name: "3日留存", checked: true, suffix: "%"},
                {id: "retention7", name: "7日留存", checked: true, suffix: "%"},
                {id: "retention14", name: "14日留存", checked: true, suffix: "%"},
                {id: "retention30", name: "30日留存", checked: true, suffix: "%"},
                {id: "retention45", name: "45日留存", checked: true, suffix: "%"},
                {id: "retention60", name: "60日留存", checked: true, suffix: "%"},
                {id: "retention90", name: "90日留存", checked: true, suffix: "%"},
                {id: "ltv1", name: "次日LTV($)", checked: true},
                {id: "ltv2", name: "2日LTV($)", checked: true},
                {id: "ltv3", name: "3日LTV($)", checked: true},
                {id: "ltv7", name: "7日LTV($)", checked: true},
                {id: "ltv14", name: "14日LTV($)", checked: true},
                {id: "ltv30", name: "30日LTV($)", checked: true},
                {id: "ltv45", name: "45日LTV($)", checked: true},
                {id: "ltv60", name: "60日LTV($)", checked: true},
                {id: "ltv90", name: "90日LTV($)", checked: true},
                {id: "ltvAll", name: "allLTV($)", checked: true},
            ],
            extraFilter: [
                {id: "type", name: "类型", type: "radio", data: ["角色", "账号", "设备"]}
            ],
            chart: [
                {
                    title: "留存", x: "day", tipsSuffix: "%",
                    y: [
                        {id: "retention1", name: "次日留存"},
                        {id: "retention2", name: "2日留存"},
                        {id: "retention3", name: "3日留存"},
                        {id: "retention7", name: "7日留存"},
                        {id: "retention14", name: "14日留存"},
                        {id: "retention30", name: "30日留存"},
                        {id: "retention45", name: "45日留存"},
                        {id: "retention60", name: "60日留存"},
                        {id: "retention90", name: "90日留存"},
                    ]
                },
                {
                    title: "LTV", x: "day",
                    y: [
                        {id: "ltv1", name: "次日LTV($)"},
                        {id: "ltv2", name: "2日LTV($)"},
                        {id: "ltv3", name: "3日LTV($)"},
                        {id: "ltv7", name: "7日LTV($)"},
                        {id: "ltv14", name: "14日LTV($)"},
                        {id: "ltv30", name: "30日LTV($)"},
                        {id: "ltv45", name: "45日LTV($)"},
                        {id: "ltv60", name: "60日LTV($)"},
                        {id: "ltv90", name: "90日LTV($)"},
                        {id: "ltvAll", name: "allLTV($)"},
                    ]
                },
            ],
            read: ()=> {
                let groupArr = ["server", "day"];
                let dnuColumnStr, dayNumStr, dayColumnStr;
                switch (req.body.type) {
                    case "角色":
                        dnuColumnStr = "roleId";
                        dayColumnStr = "role_createDate";
                        groupArr.push("role_createDate");
                        dayNumStr = "role_tianshu";
                        break;
                    case "账号":
                        dnuColumnStr = "accountId";
                        dayColumnStr = "account_createDate";
                        groupArr.push("account_createDate");
                        dayNumStr = "account_tianshu";
                        break;
                    case "设备":
                        dnuColumnStr = "imeiId";
                        dayColumnStr = "imei_createDate";
                        groupArr.push("imei_createDate");
                        dayNumStr = "imei_tianshu";
                        break;
                }
                let whereArr = [
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0),
                    condition.rangeDate(dayColumnStr, "day")
                ];
                let whereStr = where(whereArr);
                let groupStr = group(groupArr);
                let dnu = `count(case when ${dayNumStr} = 0 then ${dnuColumnStr} end)`;
                let retention = (dayNum)=> {
                    let numerator = `count(distinct case when ${dayNumStr} = ${dayNum} then ${dnuColumnStr} end)`;
                    let denominator = dnu;
                    return `if(${dnu} = 0 || ${numerator} = 0,"",round(${numerator}*100/${denominator},2)) as retention${dayNum}`;
                };
                let ltv = (dayNum)=> {
                    let numerator;
                    let denominator = dnu;
                    if (dayNum == undefined) {
                        numerator = `sum(case when ${dayNumStr} >= 0 then round(pay,2) end)`;
                        return `if(${dnu} = 0 || ${numerator} = 0,"",round(${numerator}/${denominator},2)) as ltvAll`;
                    } else {
                        numerator = `sum(case when ${dayNumStr} <= ${dayNum} then round(pay,2) end)`;
                        return `if(${dnu} = 0 || ${numerator} = 0,"",round(${numerator}/${denominator},2)) as ltv${dayNum}`;
                    }
                };

                let sqlCommand = `select ${column.optionalSelect("serverId", "server")}${dayColumnStr} as day,${dnu} as dnu,${retention(1)},${retention(2)},
                                    ${retention(3)},${retention(7)},${retention(14)},${retention(30)},${retention(45)},${retention(60)},${retention(90)},
                                        ${ltv(1)},${ltv(2)},${ltv(3)},${ltv(7)},${ltv(14)},${ltv(30)},${ltv(45)},${ltv(60)},${ltv(90)},${ltv()} 
                                            from log_nuclear.login_data 
                                                ${whereStr} ${groupStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.regex("type", /^(角色|账号|设备)$/) && check.rangeDay("day") && check.select("server");
            }
        },
        {
            id: "level",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverId as server from res.level_ds where serverId <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "day", name: "日期", checked: true, type: "day", serverFilter: true},
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "level", name: "等级", checked: true},
                {id: "num", name: "人数", checked: true},
                {id: "total", name: "总人数", checked: true},
            ],
            chart: [
                {
                    title: "等级分布", x: "level", type: "bar",
                    y: [
                        {id: "num", name: "人数"},
                    ]
                }
            ],
            read: ()=> {
                let whereArr = [
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0),
                    condition.simpleStr("date", "day")
                ];
                let groupArr = ["server", "day", "level"];
                let whereStr = where(whereArr);
                let groupStr = group(groupArr);
                let sqlCommand = `select ${column.optionalSelect("serverid", "server")}date as day,channel,ptid as client,level,sum(num) as num,sum(all_num) as total
                                            from res.level_ds 
                                                ${whereStr} ${groupStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.select("server") && check.day("day");
            }
        },
        {
            id: "vipLevel",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverId as server from res.vip_ds where serverId <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "day", name: "日期", checked: true, type: "day", serverFilter: true},
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "VIP", checked: true},
                {id: "num", name: "人数", checked: true},
                {id: "total", name: "总人数", checked: true},
            ],
            chart: [
                {
                    title: "VIP等级分布", x: "vipLevel", type: "bar",
                    y: [
                        {id: "num", name: "人数"},
                    ]
                }
            ],
            read: ()=> {
                let whereArr = [
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0),
                    condition.simpleStr("date", "day")
                ];
                let groupArr = ["server", "day", "vipLevel"];
                let whereStr = where(whereArr);
                let groupStr = group(groupArr);
                let sqlCommand = `select ${column.optionalSelect("serverid", "server")}date as day,channel,ptid as client,vip as vipLevel,sum(num) as num,sum(all_num) as total
                                            from res.vip_ds 
                                                ${whereStr} ${groupStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.select("server") && check.day("day");
            }
        },
        {
            id: "diamond",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from res.rank where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "rankType", name: "排名类型", checked: true, type: "radio", serverFilter: true, data: ["金钻", "钻石"]},
                {id: "roleId", name: "角色名", checked: true},
                {id: "role", name: "角色名", checked: true},
                {id: "roleServer", name: "角色服务器", checked: true},
                {id: "roleChannel", name: "角色渠道", checked: true},
                {id: "roleClient", name: "角色站点", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "vipLevel", name: "角色VIP等级", checked: true},
                {id: "gold", name: "当前金钻数", checked: true},
                {id: "diamond", name: "当前钻石数", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", serverFilter: true},
            ],
            extraFilter: [
                {id: "limit", name: "最大查询行数", type: "radio", data: [100, 200, 300]}
            ],
            read: ()=> {
                let whereStr = where([
                    condition.simpleStr("rank_type", "rankType"),
                    condition.simpleStr("date", "day"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                whereStr = whereStr.replace(/rank_type="金钻"/, "rank_type=\"jinzuan\"");
                whereStr = whereStr.replace(/rank_type="钻石"/, "rank_type=\"zuansi\"");
                let sqlCommand = `select serverid as server,channel,ptid as client,rank,rank_type as rankType,js_str as roleId,js_na as role,js_server as roleServer,
                                    js_channel as roleChannel,js_ptid as roleClient,level,viplevel as vipLevel,jinzuan_total as gold,zuansi_total as diamond,
                                        date as day from res.rank ${whereStr} limit ${req.body.limit}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.select("server") && check.day("day") && check.regex("rankType", /^(金钻|钻石)$/) && check.regex("limit", /^\d+$/);
            }
        },
        {
            id: "snap",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select", serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverId as server from log_nuclear.player_info where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "deviceId", name: "设备id", checked: true, type: "integer", serverFilter: true},
                {id: "accountId", name: "账号id", checked: true, type: "integer", serverFilter: true},
                {id: "roleId", name: "角色id", checked: true, type: "integer", serverFilter: true},
                {id: "region", name: "区域", checked: true, tdStyle: {"white-space": "nowrap"}},
                {
                    id: "role",
                    name: "角色名",
                    checked: true,
                    type: "input",
                    serverFilter: true,
                    tdStyle: {"white-space": "nowrap"}
                },
                {
                    id: "account",
                    name: "账号",
                    checked: true,
                    type: "input",
                    serverFilter: true,
                    thStyle: {"min-width": "100px"}
                },
                {id: "level", name: "角色等级", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "roleCreateTime", name: "角色创建时间", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "totalPay", name: "充值总额($)", checked: true},
                {id: "firstPayDay", name: "首次充值日期", checked: true},
                {id: "lastPayDay", name: "最近充值日期", checked: true},
                {id: "payTimes", name: "充值次数", checked: true},
                {id: "payDays", name: "充值天数", checked: true},
                {id: "lastLoginDay", name: "最后登录日期", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "loginDays", name: "登录天数", checked: true},
                {id: "onlineDuration", name: "在线时长(秒)", checked: true},
                {id: "loginTimes", name: "登录次数", checked: true},
                {id: "profession", name: "职业", checked: true},
                {id: "roleIp", name: "角色ip", checked: true},
                {id: "deviceSystem", name: "系统", checked: true},
                {id: "roleKey", name: "角色pk", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "deviceCreateDay", name: "设备创建日期", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "accountCreateDay", name: "账号创建日期", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "roleCreateDay", name: "角色创建日期", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "goldAddNum", name: "金钻增量", checked: true},
                {id: "goldAddTimes", name: "金钻增加次数", checked: true},
                {id: "goldCostNum", name: "金钻消耗数量", checked: true},
                {id: "goldCostTimes", name: "金钻消耗次数", checked: true},
                {id: "diamondAddNum", name: "钻石增量", checked: true},
                {id: "diamondAddTimes", name: "钻石增加次数", checked: true},
                {id: "diamondCostNum", name: "钻石消耗数量", checked: true},
                {id: "diamondCostTimes", name: "钻石消耗次数", checked: true},
                {id: "silverAddNum", name: "银币增量", checked: true},
                {id: "silverAddTimes", name: "银币增加次数", checked: true},
                {id: "silverCostNum", name: "银币消耗数量", checked: true, tdStyle: {"white-space": "nowrap"}},
                {id: "silverCostTimes", name: "银币消耗次数", checked: true},
                {id: "staminaAddNum", name: "体力增量", checked: true},
                {id: "staminaAddTimes", name: "体力增加次数", checked: true},
                {id: "staminaCostNum", name: "体力消耗数量", checked: true},
                {id: "staminaCostTimes", name: "体力消耗次数", checked: true},

            ],
            extraFilter: [
                {id: "roleQueryType", name: "角色名", type: "radio", data: ["精确匹配", "模糊查询"]}
            ],
            read: ()=> {
                let whereArr = [
                    condition.optionalInputStr("imeiId", "deviceId"),
                    condition.optionalInputStr("accountId", "accountId"),
                    condition.optionalInputStr("roleId", "roleId"),
                    condition.optionalInputStr("account", "account"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ];
                if (req.body.roleQueryType == "精确匹配") {
                    whereArr.push(condition.optionalInputStr("role_name", "role"));
                } else {
                    whereArr.push(condition.optionalInputLikeStr("role_name", "role"));
                }
                let whereStr = where(whereArr);
                let limitStr = req.body.roleQueryType == "精确匹配" ? "" : "limit 100";
                let orderStr = "order by totalPay desc";
                let sqlCommand = `select imeiId as deviceId,accountId,roleId,serverId as server,region,role_name as role,account,imei_createDate as deviceCreateDay,
                                    account_createDate as accountCreateDay,role_createDate as roleCreateDay,level,vipLevel,role_createTime as roleCreateTime,
                                        js_ocu as profession,role_ip as roleIp,imei_os as deviceSystem,pk as roleKey,login_last as lastLoginDay,login_days as loginDays,
                                            online_times as onlineDuration,login_counts as loginTimes,jinzuan_append as goldAddNum,jinzuan_append_count as goldAddTimes,
                                                zuansi_append as diamondAddNum,zuansi_append_count as diamondAddTimes,yinbi_append as silverAddNum,
                                                    yinbi_append_count as silverAddTimes,tili_append as staminaAddNum,tili_append_count as staminaAddTimes,
                                                        jinzuan_cost as goldCostNum,jinzuan_cost_count as goldCostTimes,zuansi_cost as diamondCostNum,
                                                            zuansi_cost_count as diamondCostTimes,yinbi_cost as silverCostNum,yinbi_cost_count as silverCostTimes,
                                                                tili_cost as staminaCostNum,tili_cost_count as staminaCostTimes,round(pay_all,2) as totalPay,
                                                                    pay_first as firstPayDay,pay_last as lastPayDay,pay_count as payTimes,pay_days as payDays
                                                                        from log_nuclear.player_info ${whereStr} ${orderStr} ${limitStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.optionalRegex("deviceId", /^\d+$/) && check.optionalRegex("accountId", /^\d+$/) && check.optionalRegex("roleId", /^\d+$/)
                    && check.optionalRegex("role", /^[^ ]+$/) && check.optionalRegex("account", /^[^ ]+$/)
                    && check.regex("roleQueryType", /^(精确匹配|模糊查询)$/) && check.select("server");
            }
        },
        {
            id: "chargeRank",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    serverFilter: true,
                    data: (pool)=> {
                        let sqlCommand = "select distinct serverid as server from res.rank_charge where serverid <> 0";
                        return initMysqlServerFilter(pool, sqlCommand);
                    }
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "roleId", name: "角色名", checked: true},
                {id: "role", name: "角色名", checked: true},
                {id: "roleServer", name: "角色服务器", checked: true},
                {id: "roleChannel", name: "角色渠道", checked: true},
                {id: "roleClient", name: "角色站点", checked: true},
                {id: "totalCharge", name: "充值总额($)", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.simpleStr("date", "day"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select serverid as server,channel,ptid as client,rank,js_str as roleId,js_na as role,js_server as roleServer,
                                    js_channel as roleChannel,js_ptid as roleClient,round(charge_total,2) as totalCharge,date as day from res.rank_charge 
                                        ${whereStr} `;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.select("server") && check.day("day");
            }
        },
        {
            id: "deviceChargeRank",
            database: "res",
            curd: "r",
            columns: [
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "device", name: "设备id", checked: true},
                {id: "roleList", name: "角色列表", checked: true},
                {id: "totalCharge", name: "充值总额($)", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", serverFilter: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.simpleStr("date", "day")
                ]);
                let sqlCommand = `select channel,ptid as client,rank,dv_str as device,js_info as roleList,round(charge_total,2) as totalCharge,date as day from res.rank_charge_dv 
                                        ${whereStr} `;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.day("day");
            }
        },

    ];
};

