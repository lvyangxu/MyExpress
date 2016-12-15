"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var ReactDom = require("react-dom");
require("babel-polyfill");
var Radio = require("karl-component-radio");
var http = require("karl-http");

var Table = require("../../util/table");

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            display: "game",
            gameNames: [],
            gameData: [],
            cpRowFilterValue: "",
            gameRadioValue: "",
            basicChecked: true,
            followChecked: true,
            screenshotData: [],
            isLandscape: true
        };
        var bindArr = ["nav", "chooseGameName", "turnToCp", "nameTdCallback", "columnFilter", "basicFilter", "followFilter", "sliceScreenshotData"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var hash = window.location.hash.replace(/#/g, "");
            var columnsBasic = [{ id: "type", name: "游戏类型" }, { id: "play", name: "玩法" }, { id: "ip", name: "IP" }, { id: "theme", name: "题材" }, { id: "online", name: "上线情况" }, { id: "performance", name: "上线表现" }, { id: "appannie", name: "App Annie" }, { id: "screenshot", name: "截图" }];
            var columnsFollow = [{ id: "schedule", name: "当前进度" }, { id: "contactWay", name: "沟通方式" }, { id: "agentCondition", name: "代理条件" }, { id: "admin", name: "负责人" }, { id: "lastContact", name: "最后联系时间" }, { id: "createTime", name: "创建时间" }, { id: "updateTime", name: "更新时间" }, { id: "followStatus", name: "跟进状态" }, { id: "contactContent", name: "沟通内容" }];
            var data = {
                columnsBasic: columnsBasic,
                columnsFollow: columnsFollow
            };
            columnsBasic.forEach(function (d) {
                data[d.id + "Checked"] = true;
            });
            columnsFollow.forEach(function (d) {
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
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "nav" },
                    React.createElement(
                        "div",
                        { className: this.state.display == "game" ? "active" : "", onClick: function onClick() {
                                _this2.nav("game");
                            } },
                        "游戏基本信息"
                    ),
                    React.createElement(
                        "div",
                        { className: this.state.display == "cp" ? "active" : "", onClick: function onClick() {
                                _this2.nav("cp");
                            } },
                        "CP信息库"
                    ),
                    React.createElement(
                        "div",
                        { className: this.state.display == "follow" ? "active" : "", onClick: function onClick() {
                                _this2.nav("follow");
                            } },
                        "跟进进度"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "info" },
                    React.createElement(
                        "div",
                        { style: this.state.display == "game" ? {} : { display: "none" }, className: "game-panel" },
                        React.createElement(
                            "div",
                            { className: "radio-div" },
                            React.createElement(
                                "label",
                                null,
                                "游戏名称"
                            ),
                            React.createElement(Radio, { className: "radio", defaultBlank: true, url: "../table/getGames/read", callback: function callback(d) {
                                    _this2.chooseGameName(d);
                                }, value: this.state.gameRadioValue }),
                            React.createElement(
                                "label",
                                null,
                                "发行商"
                            ),
                            React.createElement(Radio, { className: "radio", defaultBlank: true, url: "../table/getPublishers/read", callback: function callback(d) {
                                    _this2.selectPublisher(d);
                                } }),
                            React.createElement(
                                "label",
                                null,
                                "研发商"
                            ),
                            React.createElement(Radio, { className: "radio", defaultBlank: true, url: "../table/getDevelopers/read", callback: function callback(d) {
                                    _this2.selectDeveloper(d);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { className: "column-filter" },
                            React.createElement(
                                "p",
                                null,
                                "显示"
                            ),
                            React.createElement(
                                "div",
                                { className: "basic-filter" },
                                React.createElement(
                                    "div",
                                    { className: "label" },
                                    React.createElement("input", { type: "checkbox", checked: this.state.basicChecked,
                                        onChange: this.basicFilter }),
                                    "基本信息"
                                ),
                                this.state.columnsBasic ? this.state.columnsBasic.map(function (d) {
                                    return React.createElement(
                                        "div",
                                        { className: "label", key: d.id },
                                        React.createElement("input", {
                                            type: "checkbox",
                                            checked: _this2.state[d.id + "Checked"],
                                            onChange: function onChange() {
                                                _this2.columnFilter(d.id);
                                            } }),
                                        d.name
                                    );
                                }) : ""
                            ),
                            React.createElement(
                                "div",
                                { className: "follow-filter" },
                                React.createElement(
                                    "div",
                                    { className: "label" },
                                    React.createElement("input", { type: "checkbox", checked: this.state.followChecked,
                                        onChange: this.followFilter }),
                                    "跟进情况"
                                ),
                                this.state.columnsFollow ? this.state.columnsFollow.map(function (d) {
                                    return React.createElement(
                                        "div",
                                        { className: "label", key: d.id },
                                        React.createElement("input", {
                                            type: "checkbox",
                                            checked: _this2.state[d.id + "Checked"],
                                            onChange: function onChange() {
                                                _this2.columnFilter(d.id);
                                            } }),
                                        d.name
                                    );
                                }) : ""
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "game-names" },
                            this.state.gameNames.map(function (d) {
                                return React.createElement(
                                    "button",
                                    { key: d, onClick: function onClick() {
                                            _this2.chooseGameName(d);
                                        } },
                                    d
                                );
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "game-title" },
                            this.state.gameData ? this.state.gameData.name : ""
                        ),
                        React.createElement(
                            "div",
                            { className: "game-company" },
                            React.createElement(
                                "div",
                                { className: "up" },
                                "发行商"
                            ),
                            React.createElement(
                                "div",
                                { className: "down publisher", onClick: function onClick() {
                                        _this2.turnToCp(_this2.state.gameData.publisher);
                                    } },
                                this.state.gameData ? this.state.gameData.publisher : ""
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "game-company" },
                            React.createElement(
                                "div",
                                { className: "up" },
                                "研发商"
                            ),
                            React.createElement(
                                "div",
                                { className: "down developer", onClick: function onClick() {
                                        _this2.turnToCp(_this2.state.gameData.developer);
                                    } },
                                this.state.gameData ? this.state.gameData.developer : ""
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "screenshot", style: this.state.screenshotChecked ? {} : { display: "none" } },
                            React.createElement(
                                "div",
                                { className: "screenshot-title" },
                                "游戏截图"
                            ),
                            React.createElement(
                                "div",
                                { className: "screenshot-image" },
                                this.sliceScreenshotData()
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "basic-info",
                                style: this.state.basicChecked || this.state.typeChecked || this.state.playChecked || this.state.ipChecked || this.state.themeChecked || this.state.onlineChecked || this.state.performanceChecked || this.state.appannieChecked ? {} : { display: "none" } },
                            React.createElement(
                                "div",
                                { className: "basic-info-title" },
                                "基本信息"
                            ),
                            React.createElement(
                                "div",
                                { className: "basic-info-text" },
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.typeChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "游戏类型"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.type
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.playChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "玩法"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.play
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.ipChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "IP"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.ip
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.themeChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "题材"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.theme
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.onlineChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "上线情况"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.online
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.performanceChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "上线表现"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.performance
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.appannieChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "App Annie"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        React.createElement(
                                            "a",
                                            { href: this.state.gameData.appannie, target: "_blank" },
                                            this.state.gameData.appannie ? this.state.gameData.appannie.length > 25 ? this.state.gameData.appannie.substr(0, 25) + "..." : this.state.gameData.appannie : ""
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "follow-status",
                                style: this.state.followChecked || this.state.lastContactChecked || this.state.scheduleChecked || this.state.contactWayChecked || this.state.agentConditionChecked || this.state.adminChecked || this.state.createTimeChecked || this.state.updateTimeChecked || this.state.followStatusChecked ? {} : { display: "none" } },
                            React.createElement(
                                "div",
                                { className: "follow-status-title" },
                                "跟进情况"
                            ),
                            React.createElement(
                                "div",
                                { className: "follow-status-text" },
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.adminChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "负责人"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.admin
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.contactWayChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "沟通方式"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.contactWay
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.lastContactChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "最后联系时间"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.lastContact
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.createTimeChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "创建时间"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.createTime
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.updateTimeChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "更新时间"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.updateTime
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.followStatusChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "跟进标签"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: this.state.gameData.followStatus == "等包" ? "right follow-status-wait" : this.state.gameData.followStatus == "商谈" ? "right follow-status-discuss" : this.state.gameData.followStatus == "不合作" ? "right follow-status-stop" : this.state.gameData.followStatus == "合作" ? "right follow-status-cooperation" : "right" },
                                        this.state.gameData.followStatus
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row", style: this.state.agentConditionChecked ? {} : { display: "none" } },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "代理条件"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.agentCondition
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "follow-log", style: this.state.contactContentChecked ? {} : { display: "none" } },
                            React.createElement(
                                "div",
                                { className: "follow-log-title" },
                                "跟进日志"
                            ),
                            React.createElement(
                                "div",
                                { className: "follow-log-text" },
                                this.state.contactData && this.state.contactData.length != 0 ? React.createElement(
                                    "div",
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "时间"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "middle" },
                                        "策略"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        "内容"
                                    )
                                ) : "",
                                this.state.contactData ? this.state.contactData.length == 0 ? "无日志" : this.state.contactData.map(function (d, i) {
                                    return React.createElement(
                                        "div",
                                        { key: i, className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "left" },
                                            d.contactDate
                                        ),
                                        React.createElement("div", { className: "middle",
                                            dangerouslySetInnerHTML: { __html: d.contactTactics.replace(/\n/g, "<br/>") } }),
                                        React.createElement("div", { className: "right",
                                            dangerouslySetInnerHTML: { __html: d.contactContent.replace(/\n/g, "<br/>") } })
                                    );
                                }) : ""
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { style: this.state.display == "cp" ? {} : { display: "none" }, className: "cp-panel" },
                        React.createElement(Table, { tableId: "cpDisplay", rowFilterValue: this.state.cpRowFilterValue })
                    ),
                    React.createElement(
                        "div",
                        { style: this.state.display == "follow" ? {} : { display: "none" }, className: "follow-panel" },
                        React.createElement(Table, { tableId: "follow", nameTdCallback: this.nameTdCallback })
                    )
                )
            );
        }
    }, {
        key: "nav",
        value: function nav(name) {
            window.location.hash = "#" + name;
            this.setState({ "display": name });
        }
    }, {
        key: "selectPublisher",
        value: function selectPublisher(d) {
            var _this3 = this;

            http.post("../table/getGameNamesByPublisher/read", { publisher: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.publisher == d;
                }).map(function (d2) {
                    return d2.name;
                });
                _this3.setState({ gameNames: d1 });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "selectDeveloper",
        value: function selectDeveloper(d) {
            var _this4 = this;

            http.post("../table/getGameNamesByDeveloper/read", { developer: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.developer == d;
                }).map(function (d2) {
                    return d2.name;
                });
                _this4.setState({ gameNames: d1 });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "chooseGameName",
        value: function chooseGameName(d) {
            var _this5 = this;

            var gamePromise = http.post("../table/game/read");
            var screenshotPromise = http.post("../controller/screenshot/getNames", { name: d });
            var contactPromise = http.post("../table/followLog/read", { name: d });
            Promise.all([gamePromise, screenshotPromise, contactPromise]).then(function (d1) {
                var gameData = d1[0].filter(function (d2) {
                    return d2.name == d;
                })[0];
                _this5.setState({
                    gameData: gameData,
                    screenshotData: d1[1].dir,
                    isLandscape: d1[1].isLandscape,
                    contactData: d1[2]
                });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "turnToCp",
        value: function turnToCp(d) {
            this.nav("cp");
            this.setState({ cpRowFilterValue: d });
        }
    }, {
        key: "nameTdCallback",
        value: function nameTdCallback(value) {
            this.nav("game");
            this.setState({
                gameRadioValue: value
            });
            this.chooseGameName(value);
        }
    }, {
        key: "columnFilter",
        value: function columnFilter(d) {
            var json = {};
            json[d + "Checked"] = !this.state[d + "Checked"];
            this.setState(json);
        }
    }, {
        key: "basicFilter",
        value: function basicFilter() {
            var _this6 = this;

            var data = { basicChecked: !this.state.basicChecked };
            this.state.columnsBasic.forEach(function (d) {
                data[d.id + "Checked"] = !_this6.state.basicChecked;
            });
            this.setState(data);
        }
    }, {
        key: "followFilter",
        value: function followFilter() {
            var _this7 = this;

            var data = { followChecked: !this.state.followChecked };
            this.state.columnsFollow.forEach(function (d) {
                data[d.id + "Checked"] = !_this7.state.followChecked;
            });
            this.setState(data);
        }
    }, {
        key: "sliceScreenshotData",
        value: function sliceScreenshotData() {
            var data = this.state.screenshotData;
            var screenshotDom = void 0;
            if (data.length == 0) {
                return "无截图";
            }
            var sliceData = [];
            for (var i = 0; i < data.length; i = i + 2) {
                var row = [];
                if (i == data.length - 1) {
                    row.push(data[i]);
                } else {
                    row.push(data[i]);
                    row.push(data[i + 1]);
                }
                sliceData.push(row);
            }
            if (this.state.isLandscape) {
                screenshotDom = sliceData.map(function (d1, i) {
                    return React.createElement(
                        "div",
                        { key: i, className: "row" },
                        d1.map(function (d2, j) {
                            return React.createElement("img", { key: j, style: { width: "400px" },
                                src: "../data/game/" + d2.id + "/" + d2.imageName });
                        })
                    );
                });
            } else {
                screenshotDom = data.map(function (d1, i) {
                    return React.createElement("img", { key: i, style: { width: "200px" }, src: "../data/game/" + d1.id + "/" + d1.imageName });
                });
            }
            return screenshotDom;
        }
    }]);

    return App;
}(React.Component);

ReactDom.render(React.createElement(App, null), document.getElementById("display"));
