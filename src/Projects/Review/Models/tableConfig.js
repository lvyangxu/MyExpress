/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * type:数据库类型mysql/mongodb，未定义时默认为mysql
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
 * readMap:从数据库读取后对数据进行处理
 * @param req express中的req对象
 * @returns {*[]} 返回json数组
 */

module.exports = (req)=> {
    return [
        {
            id: "cp",
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "name", name: "公司名称", checked: true},
                {id: "businessType", name: "业务类型", checked: true},
                {id: "area", name: "业务地区", checked: true},
                {id: "address", name: "所在地", checked: true},
                {id: "productType", name: "主要产品类型", checked: true},
                {id: "contactMan", name: "联系人", checked: true},
                {id: "duty", name: "职位", checked: true},
                {id: "contactWay", name: "联系方式", checked: true},
                {id: "website", name: "网站", checked: true},
                {id: "appannie", name: "App Annie", checked: true},
                {id: "manager", name: "负责人", checked: true},
                {id: "note", name: "备注", checked: true}
            ],
            read: "select * from cp order by id desc"
        },
        {
            id: "cpDisplay",
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "name", name: "公司名称", checked: true},
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
            ],
            read: ()=> {
                let website = `concat("<a href='",website,"' target='_blank'>",'主页','</a>',"<a href='",appannie,"' target='_blank'>",'annie','</a>')`;
                let d = `select name,businessType,area,address,productType,contactMan,duty,contactWay,${website} as website,manager,note from cp`;
                return d;
            }
        },
        {
            id: "follow",
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "name", name: "游戏名称", checked: true},
                {id: "followStatus", name: "跟进标签", checked: true, select: true},
                {id: "lastContact", name: "最后联系时间", checked: true},
                {id: "admin", name: "负责人", checked: true, select: true},
                {id: "createTime", name: "录入时间", checked: false},
                {id: "updateTime", name: "更新时间", checked: false}
            ],
            read: "select * from game order by createTime desc"
        },
        {
            id: "game",
            columns: [
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
                {
                    id: "contactWay", name: "沟通方式", checked: true, type: "radio",
                    radioArr: [
                        "初步网上/电话沟通", "网上/电话长期跟进资料", "网上/电话深度沟通（合作意向尚不明确）",
                        "网上/电话深度沟通（已明确合作意向）", "已约定见面（去对方公司拜访）", "已约定见面（来我公司拜访）",
                        "已见面（去对方公司拜访）", "已见面（来我公司拜访）", "已见面（已互相拜访）"
                    ]
                },
                {id: "agentCondition", name: "代理条件", checked: true},
                {id: "admin", name: "负责人", checked: true},
                {
                    id: "followStatus", name: "跟进标签", checked: true, type: "radio",
                    radioArr: [
                        "等待出包", "评测中", "跟进新包，包完成度不够", "等待上线数据",
                        "初步沟通合作意向(评测通过)", "初步沟通合作意向(已上线产品)",
                        "已被其他公司代理", "开发自己发行", "我方主动放弃", "合作协议推进失败",
                        "双方明确合作意向", "签订测试协议", "签订代理协议"
                    ]
                },
                {id: "appannie", name: "Apple Annie", checked: true}
            ],
            create: {
                createTime: "now()",
                updateTime: "now()"
            },
            update: {
                createTime: undefined,
                updateTime: "now()"
            },
            read: "select * from game order by id desc"
        },
        {
            id: "contact",
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "name", name: "游戏名称", checked: true},
                {id: "contactDate", name: "沟通日期", checked: true},
                {id: "contactTactics", name: "沟通策略", checked: true, type: "textarea"},
                {id: "contactContent", name: "沟通内容", checked: true, type: "textarea"}
            ],
            read: "select * from contact order by id desc"
        },
        {
            id: "getGames",
            read: "select id,name from game group by name order by id",
            readMap: (d)=> {
                return d.name;
            }
        },
        {
            id: "getPublishers",
            read: "select id,publisher from game group by publisher order by id",
            readMap: (d)=> {
                return d.publisher;
            }
        },
        {
            id: "getDevelopers",
            read: "select id,developer from game group by developer order by id",
            readMap: (d)=> {
                return d.developer;
            }
        },
        {
            id: "followLog",
            read: "select * from contact where ? order by contactDate",
            readValue: {
                name: req.body.name
            }
        },
        {
            id: "getGameNamesByPublisher",
            read: "select * from game where ?",
            readValue: {
                publisher: req.body.publisher
            }
        },
        {
            id: "getGameNamesByDeveloper",
            read: "select * from game where ?",
            readValue: {
                developer: req.body.developer
            }
        },
        {
            id: "contactByName",
            read: "select * from contact where ?",
            readValue: {
                name: req.body.name
            }
        }
    ];
};