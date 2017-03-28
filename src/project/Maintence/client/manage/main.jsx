import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Nav from "karl-component-nav";
import Table from "karl-component-table";
import css from "./index.css";

ReactDom.render(<div>
    <Nav data={[
        {text: "服务器信息", child: ["服务器管理", "运营游戏", "云平台登记", "公司信息"]},
        {text: "服务器申请"},
        {text: "财务管理", child: ["费用登记", "统计分析"]},
        {text: "系统管理", child: ["登录日志"]},
        {text: "服务器监控", child: ["联系人", "zabbix"]},
        {text: "自动化部署"}
    ]}>
        <div>
            <div className="section">
                <Table tableId="server_info" curd="curd"/>
            </div>
            <div className="section">
                <Table tableId="game" curd="curd"/>
            </div>
            <div className="section">
                <Table tableId="cloud" curd="curd"/>
            </div>
            <div className="section"></div>
        </div>
        <div className="section"></div>
        <div>
            <div className="section"></div>
            <div className="section"></div>
        </div>
        <div>
            <div className="section"></div>
        </div>
        <div>
            <div className="section"></div>
            <div className="section"></div>
        </div>
        <div>
            <div className="section"></div>
        </div>
    </Nav>
</div>, document.getElementById("manage"));