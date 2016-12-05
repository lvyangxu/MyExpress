require("babel-polyfill");
let React = require("react");
let ReactDom = require("react-dom");
let Nav = require("karl-component-nav");

let http = require("karl-http");

let Table = require("../../util/table");

ReactDom.render(<div>
    <Nav data={[
        {text:"服务器信息",child:["服务器管理","运营游戏","云平台登记","公司信息"]},
        {text:"服务器申请"},
        {text:"财务管理",child:["费用登记","统计分析"]},
        {text:"系统管理",child:["登录日志"]},
        {text:"服务器监控",child:["联系人","zabbix"]},
        {text:"自动化部署"}
    ]}>
        <div>
            <div>
                <Table tableId="serverInfo"/>
            </div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div></div>
        <div>
            <div></div>
            <div></div>
        </div>
        <div>
            <div></div>
        </div>
        <div>
            <div></div>
            <div></div>
        </div>
        <div>
            <div></div>
        </div>
    </Nav>
</div>, document.getElementById("manage"));