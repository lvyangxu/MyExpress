/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * database:表所属数据库,默认为global.pool变量中的第一个,单一数据库使用默认值
 * curd:表格需要展示的增删查改操作
 * autoRead:加载时是否自动执行一次读取,默认不读取,只有在为true时执行
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
 *          suffix：table中td显示的后缀文字
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

    return [
        {
            id: "daily",
            database: "log_nuclear",
            curd: "r",
            autoRead: true,
            columns: [
                {id: "day", name: "日期", checked: true, type: "rangeDay", queryCondition: true, dateAdd: {startAdd: -1}},
                {
                    id: "server",
                    name: "服务器",
                    checked: true,
                    type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.new_all where serverid <> 0"
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
                {id: "totalCharge", name: "日充值总额", checked: true},
                {id: "newRoleTotalCharge", name: "日新增玩家付费总额", checked: true},
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
                        {id: "totalCharge", name: "充值总额"},
                        {id: "newRoleTotalCharge", name: "新增玩家付费总额"},
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
                            sum(new_dv_js) as activeRole,sum(new_dv) as active from res.new_all 
                                ${whereStr1} ${groupStr}) as new
                    left join 
                         (select serverid as server,date as day,sum(day_active_js) as roleActivation,sum(day_active_zh) as accountActivation,
                            sum(day_active_dv) as deviceActivation,sum(day_login_num) as loginTimes from res.active 
                                ${whereStr1} ${groupStr}) as active
                    on ${buildJoinCondition(server, "active")})
                    left join
                         (select serverid as server,date as day,sum(day_charge_total) as totalCharge,sum(day_new_charge_total) as newRoleTotalCharge,
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
            id: "charge",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", queryCondition: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverid as server from raw.charge where serverid <> 0"
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "money", name: "充值金额", checked: true},
                {id: "num", name: "充值笔数", checked: true},
                {id: "arrivalTime", name: "到帐时间", checked: true},
                {id: "orderId", name: "订单号", checked: true, type: "integer", queryCondition: true},
                {id: "chargeChannel", name: "充值渠道", checked: true},
                {id: "chargeClient", name: "充值站点", checked: true},
                {
                    id: "chargeStatus", name: "充值状态", checked: true, type: "select", queryCondition: true,
                    data: [
                        {id: "0", name: "非正式充值", checked: false},
                        {id: "1", name: "正式充值", checked: true}
                    ]
                },
                {id: "device", name: "设备id", checked: true},
                {id: "second", name: "充值时间", checked: true, type: "rangeSecond", queryCondition: true},
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
                whereStr = whereStr.replace(/status="非正式充值"/, "status=\"0\"");
                whereStr = whereStr.replace(/status="正式充值"/, "status=\"1\"");
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,money,
                                    amount as num,transtamp as arrivalTime,orderid as orderId,now_channel as chargeChannel,now_ptid as chargeClient,
                                        status as chargeStatus,dv_id as device,time as second from raw.charge ${whereStr}`;
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
                {id: "role", name: "角色id", checked: true, type: "integer", queryCondition: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverid as server from raw.cost where serverid <> 0"
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
                {id: "second", name: "消耗时间", checked: true, type: "rangeSecond", queryCondition: true},
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
                                        dv_id as device,time as second from raw.cost ${whereStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.optionalRegex("role", /^\d+$/) && check.rangeSecond("second") && check.select("server");
            }
        },
        {
            id: "produce",
            database: "raw",
            curd: "r",
            columns: [
                {id: "role", name: "角色id", checked: true, type: "integer", queryCondition: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverid as server from raw.shouyi where serverid <> 0"
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
                {id: "second", name: "消耗时间", checked: true, type: "rangeSecond", queryCondition: true},
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
                                        dv_id as device,time as second,sid,tili as stamina from raw.shouyi ${whereStr}`;
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
                {id: "role", name: "角色id", checked: true, type: "integer", queryCondition: true},
                {id: "account", name: "账号id", checked: true},
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverid as server from raw.tili_buy where serverid <> 0"
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
                let whereStr = where([
                    condition.optionalInputStr("js_id", "role"),
                    condition.rangeDate("time", "second"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select js_id as role,zh_id as account,serverid as server,channel,ptid as client,viplevel as vipLevel,level,tili_total as totalStamina,
                                    tili as stamina,dv_id as device,time as second from raw.tili_buy ${whereStr}`;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.rangeSecond("second") && check.select("server") && check.optionalRegex("role", /^\d+$/);
            }
        },
        {
            id: "diamond",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.rank where serverid <> 0"
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
                return check.select("server") && check.day("day") && check.regex("rankType", /^金钻|钻石$/) && check.regex("limit", /^\d+$/);
            }
        },
        {
            id: "chargeRank",
            database: "res",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverid as server from res.rank_charge where serverid <> 0"
                },
                {id: "channel", name: "渠道id", checked: true},
                {id: "client", name: "站点id", checked: true},
                {id: "rank", name: "排名", checked: true},
                {id: "roleId", name: "角色名", checked: true},
                {id: "role", name: "角色名", checked: true},
                {id: "roleServer", name: "角色服务器", checked: true},
                {id: "roleChannel", name: "角色渠道", checked: true},
                {id: "roleClient", name: "角色站点", checked: true},
                {id: "totalCharge", name: "充值总额", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.simpleStr("date", "day"),
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0)
                ]);
                let sqlCommand = `select serverid as server,channel,ptid as client,rank,js_str as roleId,js_na as role,js_server as roleServer,
                                    js_channel as roleChannel,js_ptid as roleClient,charge_total as totalCharge,date as day from res.rank_charge 
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
                {id: "totalCharge", name: "充值总额", checked: true},
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
            ],
            read: ()=> {
                let whereStr = where([
                    condition.simpleStr("date", "day")
                ]);
                let sqlCommand = `select channel,ptid as client,rank,dv_str as device,js_info as roleList,charge_total as totalCharge,date as day from res.rank_charge_dv 
                                        ${whereStr} `;
                return sqlCommand;
            },
            readCheck: ()=> {
                return check.day("day");
            }
        },
        {
            id: "retentionAndLtv",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select",
                    queryCondition: true,
                    initSql: "select distinct serverId as server from log_nuclear.login_data where serverId <> 0"
                },
                {id: "day", name: "日期", checked: true, type: "rangeDay", queryCondition: true},
                {id: "dnu", name: "DNU", checked: true},
                {id: "retention1", name: "次日留存", checked: true, suffix: "%"},
                {id: "retention3", name: "3日留存", checked: true, suffix: "%"},
                {id: "retention7", name: "7日留存", checked: true, suffix: "%"},
                {id: "retention14", name: "14日留存", checked: true, suffix: "%"},
                {id: "retention30", name: "30日留存", checked: true, suffix: "%"},
                {id: "retention45", name: "45日留存", checked: true, suffix: "%"},
                {id: "retention60", name: "60日留存", checked: true, suffix: "%"},
                {id: "retention90", name: "90日留存", checked: true, suffix: "%"},
                {id: "ltv1", name: "次日LTV", checked: true},
                {id: "ltv3", name: "3日LTV", checked: true},
                {id: "ltv7", name: "7日LTV", checked: true},
                {id: "ltv14", name: "14日LTV", checked: true},
                {id: "ltv30", name: "30日LTV", checked: true},
                {id: "ltv45", name: "45日LTV", checked: true},
                {id: "ltv60", name: "60日LTV", checked: true},
                {id: "ltv90", name: "90日LTV", checked: true},
                {id: "ltvAll", name: "allLTV", checked: true},
            ],
            extraFilter: [
                {id: "type", name: "类型", type: "radio", data: ["角色", "账号", "设备"]}
            ],
            chart: [
                {
                    title: "留存", x: "day", tipsSuffix: "%",
                    y: [
                        {id: "retention1", name: "次日留存"},
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
                        {id: "ltv1", name: "次日LTV"},
                        {id: "ltv3", name: "3日LTV"},
                        {id: "ltv7", name: "7日LTV"},
                        {id: "ltv14", name: "14日LTV"},
                        {id: "ltv30", name: "30日LTV"},
                        {id: "ltv45", name: "45日LTV"},
                        {id: "ltv60", name: "60日LTV"},
                        {id: "ltv90", name: "90日LTV"},
                        {id: "ltvAll", name: "allLTV"},
                    ]
                },
            ],
            read: ()=> {
                let whereArr = [
                    condition.optionalSelectNum("serverid", "server"),
                    condition.notEqual("serverid", 0),
                    condition.rangeDate("date", "day")
                ];
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
                let whereStr = where(whereArr);
                let groupStr = group(groupArr);
                let retention = (dayNum)=> {
                    return `round(count(distinct case when ${dayNumStr} = ${dayNum} then ${dayNumStr} end)*100/count(${dnuColumnStr}),2) as retention${dayNum}`;
                };
                let ltv = (dayNum)=> {
                    if (dayNum == undefined) {
                        return `round(sum(case when ${dayNumStr} >= 0 then pay end)/count(${dnuColumnStr}),2) as ltvAll`;
                    } else {
                        return `round(sum(case when ${dayNumStr} <= ${dayNum} then pay end)/count(${dnuColumnStr}),2) as ltv${dayNum}`;
                    }
                };

                let sqlCommand = `select ${column.optionalSelect("serverId", "server")}${dayColumnStr} as day,count(${dnuColumnStr}) as dnu,${retention(1)},${retention(3)},${retention(7)},
                                    ${retention(14)},${retention(30)},${retention(45)},${retention(60)},${retention(90)},${ltv(1)},${ltv(3)},${ltv(7)},${ltv(14)},
                                        ${ltv(30)},${ltv(45)},${ltv(60)},${ltv(90)},${ltv()} 
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
                    queryCondition: true,
                    initSql: "select distinct serverId as server from res.level_ds where serverId <> 0"
                },
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
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
                    queryCondition: true,
                    initSql: "select distinct serverId as server from res.vip_ds where serverId <> 0"
                },
                {id: "day", name: "日期", checked: true, type: "day", queryCondition: true},
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
            id: "snap",
            database: "log_nuclear",
            curd: "r",
            columns: [
                {
                    id: "server", name: "服务器id", checked: true, type: "select", queryCondition: true,
                    initSql: "select distinct serverId as server from log_nuclear.player_info where serverid <> 0"
                },
                {id: "deviceId", name: "设备id", checked: true, type: "integer", queryCondition: true},
                {id: "accountId", name: "账号id", checked: true, type: "integer", queryCondition: true},
                {id: "roleId", name: "角色id", checked: true, type: "integer", queryCondition: true},
                {id: "region", name: "区域", checked: true},
                {id: "role", name: "角色名", checked: true, type: "input", queryCondition: true},
                {id: "account", name: "账号", checked: true, type: "input", queryCondition: true},
                {id: "deviceCreateDay", name: "设备创建日期", checked: true},
                {id: "accountCreateDay", name: "账号创建日期", checked: true},
                {id: "roleCreateDay", name: "角色创建日期", checked: true},
                {id: "level", name: "角色等级", checked: true},
                {id: "vipLevel", name: "vip等级", checked: true},
                {id: "roleCreateTime", name: "角色创建时间", checked: true},
                {id: "profession", name: "职业", checked: true},
                {id: "roleIp", name: "角色ip", checked: true},
                {id: "deviceSystem", name: "系统", checked: true},
                {id: "roleKey", name: "角色pk", checked: true},
                {id: "lastLoginDay", name: "最后登录日期", checked: true},
                {id: "loginDays", name: "登录天数", checked: true},
                {id: "onlineDuration", name: "在线时长", checked: true},
                {id: "loginTimes", name: "登录次数", checked: true},
                {id: "goldAddNum", name: "金钻增量", checked: true},
                {id: "goldAddTimes", name: "金钻增加次数", checked: true},
                {id: "diamondAddNum", name: "钻石增量", checked: true},
                {id: "diamondAddTimes", name: "钻石增加次数", checked: true},
                {id: "silverAddNum", name: "银币增量", checked: true},
                {id: "silverAddTimes", name: "银币增加次数", checked: true},
                {id: "staminaAddNum", name: "体力增量", checked: true},
                {id: "staminaAddTimes", name: "体力增加次数", checked: true},
                {id: "goldCostNum", name: "金钻消耗数量", checked: true},
                {id: "goldCostTimes", name: "金钻消耗次数", checked: true},
                {id: "diamondCostNum", name: "钻石消耗数量", checked: true},
                {id: "diamondCostTimes", name: "钻石消耗次数", checked: true},
                {id: "silverCostNum", name: "银币消耗数量", checked: true},
                {id: "silverCostTimes", name: "银币消耗次数", checked: true},
                {id: "staminaCostNum", name: "体力消耗数量", checked: true},
                {id: "staminaCostTimes", name: "体力消耗次数", checked: true},
                {id: "totalPay", name: "充值总额", checked: true},
                {id: "firstPayDay", name: "首次充值日期", checked: true},
                {id: "lastPayDay", name: "最近充值日期", checked: true},
                {id: "payTimes", name: "充值次数", checked: true},
                {id: "payDays", name: "充值天数", checked: true},
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
                                                                tili_cost as staminaCostNum,tili_cost_count as staminaCostTimes,pay_all as totalPay,
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

