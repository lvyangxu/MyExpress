let React = require("react");
let ReactDom = require("react-dom");
require("karl-extend");
let Nav = require("../../util/nav");
let http = require("../../util/http");
let ReactTransitionGroup  = require('react-addons-transition-group');

let Table = require("../../util/table");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: [
                {
                    id: "serverInfo", name: "服务器信息", open: false,
                    child: [
                        {id: "serverManage", name: "服务器管理"},
                        {id: "operationGame", name: "运营游戏"},
                        {id: "cloundClient", name: "云平台登记"},
                        {id: "companyInfo", name: "公司信息"}
                    ]
                },
                {id: "serverApply", name: "服务器申请", open: false, child: []},
                {
                    id: "financeManage", name: "财务管理", open: false,
                    child: [
                        {id: "costRegister", name: "费用登记"},
                        {id: "statisticsAnalysis", name: "统计分析"}
                    ]
                },
                {
                    id: "systemManage", name: "系统管理", open: false,
                    child: [
                        {id: "loginLog", name: "登录日志"}
                    ]
                },
                {
                    id: "systemMonitor", name: "服务器监控", open: false,
                    child: [
                        {id: "contact", name: "联系人"},
                        {id: "zabbix", name: "zabbix"}
                    ]
                },
                {
                    id: "autoDeploy", name: "自动化部署", open: false,
                    child: []
                }
            ],
            currentNav: ""
        };
        let bindArr = [];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidAppear(){
        console.log(2);
    }

    componentDidMount() {
        let hash = window.location.hash.replace(/#/g, "");
        let nav = this.state.nav;
        let currentNav = "";
        if (hash == "") {
            nav = nav.map(d=> {
                if (d.id == "serverInfo") {
                    d.open = true;
                }
                return d;
            });
            currentNav = "serverManage";
        } else {
            nav = nav.map(d=> {
                if (d.child.includes(hash)) {
                    d.open = true;
                    currentNav = d.id;
                }
                return d;
            });
        }
        this.setState({
            nav: nav,
            currentNav: currentNav
        });
    }

    render() {
        return (
            <div className="container">

                <Nav data={[1,2,3]}></Nav>

                <div className="main">
                    <div style={this.state.currentNav == "serverManage" ? {} : {display: "none"}}>
                        <Table tableId="server_info" curd="curd" attachment/>
                    </div>

                </div>
            </div>
        );
    }

    nav(name) {
        window.location.hash = "#" + name;
        this.setState({"display": name});
    }

}

ReactDom.render(<App/>, document.getElementById("manage"));