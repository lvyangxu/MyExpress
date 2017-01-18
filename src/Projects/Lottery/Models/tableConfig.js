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
 *          queryCondition;是否作为服务端查询筛选条件
 *          data:该筛选组件初始化数据的数组，函数或固定值，为函数时参数为pool
 *          dataMap:对data初始化的值进行处理
 *          radioArr:所有单选值的数组，仅在type为radio有效,
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
 * readMap:从数据库读取后对数据进行处理
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

    ];
};

