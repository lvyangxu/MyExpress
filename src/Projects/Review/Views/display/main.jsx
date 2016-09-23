let React = require("react");
let ReactDom = require("react-dom");
require("../../util/myString").extend();
let Radio = require("../../util/radio");
let http = require("../../util/http");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "game",
            gameNames: [],
            gameData: []
        };
        let bindArr = ["nav"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {

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
                            <Radio defaultBlank url="../table/getGames/read" selectCallback={(d)=> {
                                this.selectGame(d);
                            }}></Radio>
                            <Radio defaultBlank url="../table/getPublishers/read" selectCallback={(d)=> {
                                this.selectPublisher(d);
                            }}></Radio>
                            <Radio defaultBlank url="../table/getDevelopers/read" selectCallback={(d)=> {
                                this.selectDeveloper(d);
                            }}></Radio>
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
                            <div className="down">{(this.state.gameData) ? this.state.gameData.publisher : ""}</div>
                        </div>
                        <div className="game-company">
                            <div className="up">研发商</div>
                            <div className="down">{(this.state.gameData) ? this.state.gameData.developer : ""}</div>
                        </div>
                        <div className="screenshot">
                            <div className="screenshot-title">游戏截图</div>
                            <div className="screenshot-image"></div>
                        </div>
                        <div className="basic-info">
                            <div className="basic-info-title">基本信息</div>
                            <div className="basic-info-text">
                                <div className="row">
                                    <div className="left">发行商</div>
                                    <div className="right">{this.state.gameData.publisher}</div>
                                </div>
                                <div className="row">
                                    <div className="left">研发商</div>
                                    <div className="right">{this.state.gameData.developer}</div>
                                </div>
                                <div className="row">
                                    <div className="left">游戏类型</div>
                                    <div className="right">{this.state.gameData.type}</div>
                                </div>
                                <div className="row">
                                    <div className="left">玩法</div>
                                    <div className="right">{this.state.gameData.play}</div>
                                </div>
                                <div className="row">
                                    <div className="left">IP</div>
                                    <div className="right">{this.state.gameData.ip}</div>
                                </div>
                                <div className="row">
                                    <div className="left">题材</div>
                                    <div className="right">{this.state.gameData.theme}</div>
                                </div>
                                <div className="row">
                                    <div className="left">上线情况</div>
                                    <div className="right">{this.state.gameData.online}</div>
                                </div>
                                <div className="row">
                                    <div className="left">上线表现</div>
                                    <div className="right">{this.state.gameData.performance}</div>
                                </div>
                                <div className="row">
                                    <div className="left">最后联系时间</div>
                                    <div className="right">{this.state.gameData.lastContact}</div>
                                </div>
                                <div className="row">
                                    <div className="left">当前进度</div>
                                    <div className="right">{this.state.gameData.schedule}</div>
                                </div>
                                <div className="row">
                                    <div className="left">沟通方式</div>
                                    <div className="right">{this.state.gameData.contactWay}</div>
                                </div>
                                <div className="row">
                                    <div className="left">代理条件</div>
                                    <div className="right">{this.state.gameData.agentCondition}</div>
                                </div>
                                <div className="row">
                                    <div className="left">负责人</div>
                                    <div className="right">{this.state.gameData.admin}</div>
                                </div>
                                <div className="row">
                                    <div className="left">创建时间</div>
                                    <div className="right">{this.state.gameData.createTime}</div>
                                </div>
                                <div className="row">
                                    <div className="left">更新时间</div>
                                    <div className="right">{this.state.gameData.updateTime}</div>
                                </div>
                                <div className="row">
                                    <div className="left">跟进状态</div>
                                    <div className="right">{this.state.gameData.followStatus}</div>
                                </div>
                                <div className="row">
                                    <div className="left">Apple Annie</div>
                                    <div className="right">{this.state.gameData.appleannie}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={this.state.display == "cp" ? {} : {display: "none"}} className="cp-panel">

                    </div>
                    <div style={this.state.display == "follow" ? {} : {display: "none"}} className="follow-panel">

                    </div>
                </div>
            </div>
        );
    }

    nav(name) {
        this.setState({"display": name});
    }

    selectGame(d) {
        http.post("../table/getGameNames/read", {name: d}).then(d1=> {
            d1 = d1.filter(d2=> {
                return d2.name == d;
            });
            this.setState({gameData: d1[0]});
        }).catch(d=> {
            alert("获取数据失败:" + d);
        });
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
        http.post("../table/game/read", {name: d}).then(d1=> {
            d1 = d1.filter(d2=> {
                return d2.name == d;
            });
            this.setState({gameData: d1[0]});
        }).catch(d=> {
            alert("获取数据失败:" + d);
        });
    }
}

ReactDom.render(<App/>, document.getElementById("display"));