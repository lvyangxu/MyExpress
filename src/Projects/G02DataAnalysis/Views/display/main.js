"use strict";

var React = require("react");
var ReactDom = require("react-dom");
require("babel-polyfill");
var Nav = require("karl-component-nav");
var Table = require("../../util/table");

ReactDom.render(React.createElement(Nav, { data: [{ id: "online", name: "在线人数", group: "服务器信息", dom: React.createElement(
            "div",
            { className: "page-section" },
            React.createElement(Table, { tableId: "online" })
        ) }, { id: "daily-new", name: "日新增", group: "服务器信息", dom: React.createElement("div", null) }, { id: "daily-active", name: "日活跃", group: "服务器信息", dom: React.createElement("div", null) }, { id: "daily-charge", name: "流水", group: "服务器信息", dom: React.createElement("div", null) }, { id: "weekly-monthly-new", name: "周月新增", group: "服务器信息", dom: React.createElement("div", null) }, { id: "charge-query", name: "充值流水", group: "日志查询", dom: React.createElement("div", null) }, { id: "cost-query", name: "消耗流水", group: "日志查询", dom: React.createElement("div", null) }, { id: "stamina-query", name: "体力购买流水", group: "日志查询", dom: React.createElement("div", null) }, { id: "server_total", name: "产出流水", group: "日志查询", dom: React.createElement("div", null) }, { id: "server_total", name: "留存", group: "用户分析", dom: React.createElement("div", null) }, { id: "server_total", name: "LTV", group: "用户分析", dom: React.createElement("div", null) }, { id: "server_total", name: "等级分布", group: "用户分析", dom: React.createElement("div", null) }, { id: "server_total", name: "当前钻石持有排名", group: "快照查询", dom: React.createElement("div", null) }, { id: "server_total", name: "角色汇总表", group: "快照查询", dom: React.createElement("div", null) }, { id: "server_total", name: "账号汇总表", group: "快照查询", dom: React.createElement("div", null) }, { id: "server_total", name: "设备汇总表", group: "快照查询", dom: React.createElement("div", null) }, { id: "server_total", name: "当日充值排名", group: "排名相关", dom: React.createElement("div", null) }] }), document.getElementById("display"));
