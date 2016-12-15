"use strict";

require("babel-polyfill");
var React = require("react");
var ReactDom = require("react-dom");
var Nav = require("karl-component-nav");

var http = require("karl-http");

var Table = require("../../util/table");

ReactDom.render(React.createElement(
    "div",
    null,
    React.createElement(
        Nav,
        { data: [{ text: "服务器信息", child: ["服务器管理", "运营游戏", "云平台登记", "公司信息"] }, { text: "服务器申请" }, { text: "财务管理", child: ["费用登记", "统计分析"] }, { text: "系统管理", child: ["登录日志"] }, { text: "服务器监控", child: ["联系人", "zabbix"] }, { text: "自动化部署" }] },
        React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "section" },
                React.createElement(Table, { tableId: "server_info", curd: "curd" })
            ),
            React.createElement(
                "div",
                { className: "section" },
                React.createElement(Table, { tableId: "game", curd: "curd" })
            ),
            React.createElement(
                "div",
                { className: "section" },
                React.createElement(Table, { tableId: "cloud", curd: "curd" })
            ),
            React.createElement("div", { className: "section" })
        ),
        React.createElement("div", { className: "section" }),
        React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section" }),
            React.createElement("div", { className: "section" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section" }),
            React.createElement("div", { className: "section" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement("div", { className: "section" })
        )
    )
), document.getElementById("manage"));
