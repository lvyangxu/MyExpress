let React = require("react");
let ReactDom = require("react-dom");
require("babel-polyfill");
let Nav = require("karl-component-nav");
let Table = require("../")

ReactDom.render(<Nav sectionStyle={{padding: "50px"}} data={[
    {id: "online", name: "在线人数", group: "服务器信息", dom: <div></div>},
    {id: "daily-new", name: "日新增", group: "服务器信息", dom: <div></div>},
    {id: "daily-active", name: "日活跃", group: "服务器信息", dom: <div></div>},
    {id: "daily-charge", name: "流水", group: "服务器信息", dom: <div></div>},
    {id: "weekly-monthly-new", name: "周月新增", group: "服务器信息", dom: <div></div>},
    {id: "charge-query", name: "充值流水", group: "日志查询", dom: <div></div>},
    {id: "cost-query", name: "消耗流水", group: "日志查询", dom: <div></div>},
    {id: "stamina-query", name: "体力购买流水", group: "日志查询", dom: <div></div>},
    {id: "output-query", name: "产出流水", group: "日志查询", dom: <div></div>},
    {id: "retention", name: "留存", group: "用户分析", dom: <div></div>},
    {id: "ltv", name: "LTV", group: "用户分析", dom: <div></div>},
    {id: "level", name: "等级分布", group: "用户分析", dom: <div></div>},
    {id: "diamond-range", name: "当前钻石持有排名", group: "快照查询", dom: <div></div>},
    {id: "role-total", name: "角色汇总表", group: "快照查询", dom: <div></div>},
    {id: "account-total", name: "账号汇总表", group: "快照查询", dom: <div></div>},
    {id: "device-total", name: "设备汇总表", group: "快照查询", dom: <div></div>},
    {id: "charge-range", name: "当日充值排名", group: "排名相关", dom: <div></div>}
]}/>, document.getElementById("display"));