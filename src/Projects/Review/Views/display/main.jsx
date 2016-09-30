let React = require("react");
let ReactDom = require("react-dom");
require("../../util/myString").extend();
let Radio = require("../../util/radio");
let http = require("../../util/http");

let Table = require("../../util/table");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "game",
            gameNames: [],
            gameData: [],
            cpRowFilterValue: "",
            gameRadioValue: "",
            basicChecked: true,
            followChecked: true
        };
        let bindArr = ["nav", "chooseGameName", "turnToCp", "nameTdCallback", "columnFilter", "basicFilter", "followFilter"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let hash = window.location.hash.replace(/#/g, "");
        let columnsBasic = [
            {id: "type", name: "游戏类型"},
            {id: "play", name: "玩法"},
            {id: "ip", name: "IP"},
            {id: "theme", name: "题材"},
            {id: "online", name: "上线情况"},
            {id: "performance", name: "上线表现"},
            {id: "appannie", name: "Apple Annie"},
            {id: "screenshot", name: "截图"}
        ];
        let columnsFollow = [
            {id: "schedule", name: "当前进度"},
            {id: "contactWay", name: "沟通方式"},
            {id: "agentCondition", name: "代理条件"},
            {id: "admin", name: "负责人"},
            {id: "lastContact", name: "最后联系时间"},
            {id: "createTime", name: "创建时间"},
            {id: "updateTime", name: "更新时间"},
            {id: "followStatus", name: "跟进状态"},
            {id: "contactContent", name: "沟通内容"}
        ];
        let data = {
            columnsBasic: columnsBasic,
            columnsFollow: columnsFollow
        };
        columnsBasic.forEach(d=> {
            data[d.id + "Checked"] = true;
        });
        columnsFollow.forEach(d=> {
            data[d.id + "Checked"] = true;
        });
        switch (hash) {
            case "game":
            case "cp":
            case "follow":
                data.display = hash;
                break;
        }
        this.setState(data);
    }

    render() {
        return (
            <div className="container">
                <div className="nav">
                    <div className={this.state.display == "game" ? "active" : ""} onClick={()=> {
                        this.nav("game")
                    }}>游戏基本信息
                    </div>
                    <div className={this.state.display == "cp" ? "active" : ""} onClick={()=> {
                        this.nav("cp")
                    }}>CP信息库
                    </div>
                    <div className={this.state.display == "follow" ? "active" : ""} onClick={()=> {
                        this.nav("follow")
                    }}>跟进进度
                    </div>
                </div>
                <div className="info">
                    <div style={this.state.display == "game" ? {} : {display: "none"}} className="game-panel">
                        <div className="radio-div">
                            <label>游戏名称</label>
                            <Radio defaultBlank url="../table/getGames/read" selectCallback={(d)=> {
                                this.chooseGameName(d);
                            }} value={this.state.gameRadioValue}></Radio>
                            <label>发行商</label>
                            <Radio defaultBlank url="../table/getPublishers/read" selectCallback={(d)=> {
                                this.selectPublisher(d);
                            }}></Radio>
                            <label>研发商</label>
                            <Radio defaultBlank url="../table/getDevelopers/read" selectCallback={(d)=> {
                                this.selectDeveloper(d);
                            }}></Radio>
                        </div>
                        <div className="column-filter">
                            <p>显示</p>
                            <div className="basic-filter">
                                <div className="label">
                                    <input type="checkbox" checked={this.state.basicChecked}
                                           onChange={this.basicFilter}/>基本信息
                                </div>
                                {
                                    this.state.columnsBasic ? this.state.columnsBasic.map(d=> {
                                        return <div className="label" key={d.id}><input
                                            type="checkbox"
                                            checked={this.state[d.id + "Checked"]}
                                            onChange={()=> {
                                                this.columnFilter(d.id);
                                            }}/>{d.name}</div>
                                    }) : ""
                                }
                            </div>
                            <div className="follow-filter">
                                <div className="label">
                                    <input type="checkbox" checked={this.state.followChecked}
                                           onChange={this.followFilter}/>跟进情况
                                </div>
                                {
                                    this.state.columnsFollow ? this.state.columnsFollow.map(d=> {
                                        return <div className="label" key={d.id}><input
                                            type="checkbox"
                                            checked={this.state[d.id + "Checked"]}
                                            onChange={()=> {
                                                this.columnFilter(d.id);
                                            }}/>{d.name}</div>
                                    }) : ""
                                }
                            </div>
                        </div>
                        <div className="game-names">
                            {
                                this.state.gameNames.map(d=> {
                                    return <button key={d} onClick={()=> {
                                        this.chooseGameName(d)
                                    }}>{d}</button>
                                })
                            }
                        </div>
                        <div className="game-title">{(this.state.gameData) ? this.state.gameData.name : ""}</div>
                        <div className="game-company">
                            <div className="up">发行商</div>
                            <div className="down publisher" onClick={()=> {
                                this.turnToCp(this.state.gameData.publisher)
                            }}>
                                {(this.state.gameData) ? this.state.gameData.publisher : ""}
                            </div>
                        </div>
                        <div className="game-company">
                            <div className="up">研发商</div>
                            <div className="down developer" onClick={()=> {
                                this.turnToCp(this.state.gameData.developer);
                            }}>
                                {(this.state.gameData) ? this.state.gameData.developer : ""}
                            </div>
                        </div>
                        <div className="screenshot" style={this.state.screenshotChecked ? {} : {display: "none"}}>
                            <div className="screenshot-title">游戏截图</div>
                            <div className="screenshot-image">
                                {
                                    this.state.screenshotData ?
                                        (this.state.screenshotData.length == 0 ? "无截图" :
                                            this.state.screenshotData.map((d, i)=> {
                                                return <div key={i} className="row">{
                                                    d.map((d1, j)=> {
                                                        return <img key={j}
                                                                    src={"../data/game/" + d1.id + "/" + d1.imageName}/>
                                                    })
                                                }</div>
                                            })) : ""
                                }
                            </div>
                        </div>
                        <div className="basic-info"
                             style={(this.state.basicChecked || this.state.typeChecked || this.state.playChecked ||
                             this.state.ipChecked || this.state.themeChecked || this.state.onlineChecked ||
                             this.state.performanceChecked || this.state.appannieChecked) ? {} : {display: "none"}}>
                            <div className="basic-info-title">基本信息</div>
                            <div className="basic-info-text">
                                <div className="row" style={this.state.typeChecked ? {} : {display: "none"}}>
                                    <div className="left">游戏类型</div>
                                    <div className="right">{this.state.gameData.type}</div>
                                </div>
                                <div className="row" style={this.state.playChecked ? {} : {display: "none"}}>
                                    <div className="left">玩法</div>
                                    <div className="right">{this.state.gameData.play}</div>
                                </div>
                                <div className="row" style={this.state.ipChecked ? {} : {display: "none"}}>
                                    <div className="left">IP</div>
                                    <div className="right">{this.state.gameData.ip}</div>
                                </div>
                                <div className="row" style={this.state.themeChecked ? {} : {display: "none"}}>
                                    <div className="left">题材</div>
                                    <div className="right">{this.state.gameData.theme}</div>
                                </div>
                                <div className="row" style={this.state.onlineChecked ? {} : {display: "none"}}>
                                    <div className="left">上线情况</div>
                                    <div className="right">{this.state.gameData.online}</div>
                                </div>
                                <div className="row" style={this.state.performanceChecked ? {} : {display: "none"}}>
                                    <div className="left">上线表现</div>
                                    <div className="right">{this.state.gameData.performance}</div>
                                </div>
                                <div className="row" style={this.state.appannieChecked ? {} : {display: "none"}}>
                                    <div className="left">App Annie</div>
                                    <div className="right">
                                        <a href={this.state.gameData.appannie} target="_blank">
                                            {
                                                this.state.gameData.appannie ?
                                                    (this.state.gameData.appannie.length > 25 ?
                                                        (this.state.gameData.appannie.substr(0, 25) + "...") :
                                                        this.state.gameData.appannie) : ""
                                            }
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="follow-status"
                             style={(this.state.followChecked || this.state.lastContactChecked || this.state.scheduleChecked ||
                             this.state.contactWayChecked || this.state.agentConditionChecked || this.state.adminChecked ||
                             this.state.createTimeChecked || this.state.updateTimeChecked || this.state.followStatusChecked) ? {} : {display: "none"}}>
                            <div className="follow-status-title">跟进情况</div>
                            <div className="follow-status-text">
                                <div className="row" style={this.state.adminChecked ? {} : {display: "none"}}>
                                    <div className="left">负责人</div>
                                    <div className="right">{this.state.gameData.admin}</div>
                                </div>
                                <div className="row" style={this.state.contactWayChecked ? {} : {display: "none"}}>
                                    <div className="left">沟通方式</div>
                                    <div className="right">{this.state.gameData.contactWay}</div>
                                </div>
                                <div className="row" style={this.state.lastContactChecked ? {} : {display: "none"}}>
                                    <div className="left">最后联系时间</div>
                                    <div className="right">{this.state.gameData.lastContact}</div>
                                </div>
                                <div className="row" style={this.state.createTimeChecked ? {} : {display: "none"}}>
                                    <div className="left">创建时间</div>
                                    <div className="right">{this.state.gameData.createTime}</div>
                                </div>
                                <div className="row" style={this.state.updateTimeChecked ? {} : {display: "none"}}>
                                    <div className="left">更新时间</div>
                                    <div className="right">{this.state.gameData.updateTime}</div>
                                </div>
                                <div className="row" style={this.state.followStatusChecked ? {} : {display: "none"}}>
                                    <div className="left">跟进标签</div>
                                    {
                                        <div className={this.state.gameData.followStatus == "等包" ?
                                            "right follow-status-wait" :
                                            (this.state.gameData.followStatus == "商谈" ?
                                                    "right follow-status-discuss" :
                                                    (this.state.gameData.followStatus == "不合作" ?
                                                            "right follow-status-stop" :
                                                            this.state.gameData.followStatus == "合作" ?
                                                                "right follow-status-cooperation" : "right"
                                                    )
                                            )
                                        }>{this.state.gameData.followStatus}</div>
                                    }
                                </div>
                                <div className="row" style={this.state.agentConditionChecked ? {} : {display: "none"}}>
                                    <div className="left">代理条件</div>
                                    <div className="right">{this.state.gameData.agentCondition}</div>
                                </div>
                            </div>
                        </div>
                        <div className="follow-log" style={this.state.contactContentChecked ? {} : {display: "none"}}>
                            <div className="follow-log-title">跟进日志</div>
                            <div className="follow-log-text">
                                {
                                    (this.state.contactData && this.state.contactData.length != 0) ?
                                        <div className="row">
                                            <div className="left">时间</div>
                                            <div className="middle">策略</div>
                                            <div className="right">内容</div>
                                        </div> : ""
                                }
                                {
                                    this.state.contactData ?
                                        (this.state.contactData.length == 0 ? "无日志" :
                                                this.state.contactData.map((d, i)=> {
                                                    return <div key={i} className="row">
                                                        <div className="left">{d.contactDate}</div>
                                                        <div className="middle"
                                                             dangerouslySetInnerHTML={{__html: d.contactTactics.replace(/\n/g, "<br/>")}}>
                                                        </div>
                                                        <div className="right"
                                                             dangerouslySetInnerHTML={{__html: d.contactContent.replace(/\n/g, "<br/>")}}>
                                                        </div>
                                                    </div>
                                                })
                                        ) : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div style={this.state.display == "cp" ? {} : {display: "none"}} className="cp-panel">
                        <Table tableId="cpDisplay" rowFilterValue={this.state.cpRowFilterValue}/>
                    </div>
                    <div style={this.state.display == "follow" ? {} : {display: "none"}} className="follow-panel">
                        <Table tableId="follow" nameTdCallback={this.nameTdCallback}/>
                    </div>
                </div>
            </div>
        );
    }

    nav(name) {
        window.location.hash = "#" + name;
        this.setState({"display": name});
    }

    selectPublisher(d) {
        http.post("../table/getGameNamesByPublisher/read", {publisher: d}).then(d1=> {
            d1 = d1.filter(d2=> {
                return d2.publisher == d;
            }).map(d2=> {
                return d2.name;
            });
            this.setState({gameNames: d1});
        }).catch(d=> {
            alert("获取数据失败:" + d);
        });
    }

    selectDeveloper(d) {
        http.post("../table/getGameNamesByDeveloper/read", {developer: d}).then(d1=> {
            d1 = d1.filter(d2=> {
                return d2.developer == d;
            }).map(d2=> {
                return d2.name;
            });
            this.setState({gameNames: d1});
        }).catch(d=> {
            alert("获取数据失败:" + d);
        });
    }

    chooseGameName(d) {
        let gamePromise = http.post("../table/game/read");
        let screenshotPromise = http.post("../controller/screenshot/getNames", {name: d});
        let contactPromise = http.post("../table/followLog/read", {name: d});
        Promise.all([gamePromise, screenshotPromise, contactPromise]).then(d1=> {
            let gameData = d1[0].filter(d2=> {
                return d2.name == d;
            })[0];
            let screenshotData = [];
            for (let i = 0; i < d1[1].length; i = i + 2) {
                let row = [];
                if (i == d1[1].length - 1) {
                    row.push(d1[1][i]);
                } else {
                    row.push(d1[1][i]);
                    row.push(d1[1][i + 1]);
                }
                screenshotData.push(row);
            }
            this.setState({
                gameData: gameData,
                screenshotData: screenshotData,
                contactData: d1[2]
            });
        }).catch(d=> {
            alert("获取数据失败:" + d);
        });
    }

    turnToCp(d) {
        this.nav("cp");
        this.setState({cpRowFilterValue: d});
    }

    nameTdCallback(value) {
        this.nav("game");
        this.setState({
            gameRadioValue: value
        });
        this.chooseGameName(value);
    }

    columnFilter(d) {
        let json = {};
        json[d + "Checked"] = !this.state[d + "Checked"];
        this.setState(json);
    }

    basicFilter() {
        let data = {basicChecked: !this.state.basicChecked};
        this.state.columnsBasic.forEach(d=> {
            data[d.id + "Checked"] = !this.state.basicChecked;
        });
        this.setState(data);
    }

    followFilter() {
        let data = {followChecked: !this.state.followChecked};
        this.state.columnsFollow.forEach(d=> {
            data[d.id + "Checked"] = !this.state.followChecked;
        });
        this.setState(data);
    }
}

ReactDom.render(<App/>, document.getElementById("display"));