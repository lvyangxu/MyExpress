/**
 * json含义
 * id:表名
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

module.exports = (req)=> {
    return [
        {
            id: "serverInfo",
            columns: [
                {id: "id", name: "id", checked: false},
                {id: "serverRoom", name: "区域", checked: true},
                {id: "game", name: "游戏名称", checked: true},
                {id: "instanceType", name: "实例类型", checked: true},
                {id: "instanceId", name: "实例id", checked: true},
                {id: "instanceName", name: "实例名称", checked: true},
                {id: "area", name: "可用区", checked: true},
                {id: "publicDns", name: "公网dns", checked: true},
                {id: "supplier", name: "云平台名称", checked: true},
                {id: "internetIp", name: "公网ip", checked: true},
                {id: "intranetIp", name: "内网ip", checked: true},
                {id: "cpu", name: "cpu", checked: true},
                {id: "memory", name: "内存", checked: true},
                {id: "bandwidth", name: "带宽", checked: true},
                {id: "disk", name: "硬盘", checked: true},
                {id: "os", name: "操作系统", checked: true},
                {id: "service", name: "运行服务", checked: true},
                {id: "startTime", name: "上架时间", checked: true},
                {id: "endTime", name: "到期时间", checked: true},
                {id: "status", name: "状态", checked: true},
                {id: "username", name: "登录名", checked: true},
                {id: "password", name: "密码", checked: true},
                {id: "operationHistory", name: "维护记录", checked: true},
                {id: "price", name: "价格", checked: true},
                {id: "assetId", name: "资产编号", checked: true},
                {id: "serialNum", name: "设备序列号", checked: true},
                {id: "publicPort", name: "开放端口", checked: true},
                {id: "secretKey", name: "密钥值", checked: true},
                {id: "safeGroup", name: "安全组", checked: true},
                {id: "note", name: "备注", checked: true}
            ],
            read: "select * from server_info"
        },

    ];
};