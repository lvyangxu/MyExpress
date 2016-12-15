/**
 * json含义
 * id:客户端请求的表名，唯一标识
 * database:表所属数据库,默认为global.pool变量中的第一个,单一数据库使用默认值
 * columns:前端所需的列及其属性，
 *          id:列id，
 *          name:列显示名称，
 *          checked:是否默认显示
 *          select:是否作为过滤条件
 *          type:表格创建和修改时显示的类型，可为input,textarea,radio，默认为input
 *          radioArr:所有单选值的数组，仅在type为radio有效
 * create:表格创建默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * update:表格更新默认json值，如果某个键的值为undefined，表示sql语句中忽略该键值对
 * read:表格查询语句
 * readValue:表格查询默认json值，匹配read值中的？
 * @param req express中的req对象
 * @returns {*[]} 返回json数组
 */

module.exports = (req) => {
    return [
        {
            id: "online",
            database: "raw",
            columns: [
                {id: "serverid", name: "服务器", checked: true, select: true},
                {id: "channel", name: "区域", checked: true, select: true},
                {id: "num", name: "人数", checked: true},
                {id: "time", name: "时间", checked: true,select:true}
            ]
        },


    ];
};