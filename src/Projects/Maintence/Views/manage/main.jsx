let React = require("react");
let ReactDom = require("react-dom");
require("../../util/myString").extend();
let Radio = require("../../util/radio");
let http = require("../../util/http");
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

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
                <div className="nav">
                    {
                        this.state.nav.map((d, i)=> {
                            return <div className="nav1" key={i}>
                                <div className="title"><i className={d.open ? "fa fa-minus" : "fa fa-plus"}></i>{d.name}</div>
                                <ReactCSSTransitionGroup className="list"
                                                         transitionName="list"
                                                         transitionAppear={true}
                                                         transitionAppearTimeout={5000000}
                                                         transitionLeaveTimeout={300}
                                                         transitionEnterTimeout={300}>
                                    {
                                        d.child.map((d1, j)=> {
                                            return <div className="nav2" key={j}>{d1.name}</div>
                                        })
                                    }
                                </ReactCSSTransitionGroup>
                            </div>
                        })
                    }
                </div>
                <div className="main">
                    <div style={this.state.currentNav == "serverManage" ? {} : {display: "none"}}>
                        <Table tableId="server_info" curd="curd" attachment/>
                    </div>

                </div>

                {/*<div className="info">*/}
                {/*<div style={this.state.display == "game" ? {} : {display: "none"}} className="game-panel">*/}
                {/*<Table tableId="game" curd="curd" attachment/>*/}
                {/*</div>*/}
                {/*<div style={this.state.display == "cp" ? {} : {display: "none"}} className="cp-panel">*/}
                {/*<Table tableId="cp" curd="curd"/>*/}
                {/*</div>*/}
                {/*<div style={this.state.display == "contact" ? {} : {display: "none"}} className="contact-panel">*/}
                {/*<Table tableId="contact" curd="curd" createButtonCallback={checkedData=> {*/}
                {/*let firstCheckedName = checkedData[0].name;*/}
                {/*let callbackPromise = new Promise(function (resolve, reject) {*/}
                {/*http.post("../table/contactByName/read", {name: firstCheckedName}).then(d=> {*/}
                {/*let data = {*/}
                {/*defaultData: [{name: firstCheckedName}],*/}
                {/*displayData: d*/}
                {/*};*/}
                {/*resolve(data);*/}
                {/*}).catch(d=> {*/}
                {/*reject(d);*/}
                {/*});*/}
                {/*});*/}
                {/*return callbackPromise;*/}
                {/*}}/>*/}
                {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }

    nav(name) {
        window.location.hash = "#" + name;
        this.setState({"display": name});
    }

}

ReactDom.render(<App/>, document.getElementById("manage"));