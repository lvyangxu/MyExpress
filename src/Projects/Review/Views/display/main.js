"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var ReactDom = require("react-dom");
require("../../util/myString").extend();
var Radio = require("../../util/radio");
var http = require("../../util/http");

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            display: "game",
            gameNames: [],
            gameData: []
        };
        var bindArr = ["nav"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
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
                            React.createElement(Radio, { defaultBlank: true, url: "../table/getGames/read", selectCallback: function selectCallback(d) {
                                    _this2.selectGame(d);
                                } }),
                            React.createElement(Radio, { defaultBlank: true, url: "../table/getPublishers/read", selectCallback: function selectCallback(d) {
                                    _this2.selectPublisher(d);
                                } }),
                            React.createElement(Radio, { defaultBlank: true, url: "../table/getDevelopers/read", selectCallback: function selectCallback(d) {
                                    _this2.selectDeveloper(d);
                                } })
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
                                { className: "down" },
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
                                { className: "down" },
                                this.state.gameData ? this.state.gameData.developer : ""
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "screenshot" },
                            React.createElement(
                                "div",
                                { className: "screenshot-title" },
                                "游戏截图"
                            ),
                            React.createElement("div", { className: "screenshot-image" })
                        ),
                        React.createElement(
                            "div",
                            { className: "basic-info" },
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
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "发行商"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.publisher
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "研发商"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.developer
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "当前进度"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.schedule
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row" },
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
                                    { className: "row" },
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
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
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
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "跟进状态"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.followStatus
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "row" },
                                    React.createElement(
                                        "div",
                                        { className: "left" },
                                        "Apple Annie"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "right" },
                                        this.state.gameData.appleannie
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement("div", { style: this.state.display == "cp" ? {} : { display: "none" }, className: "cp-panel" }),
                    React.createElement("div", { style: this.state.display == "follow" ? {} : { display: "none" }, className: "follow-panel" })
                )
            );
        }
    }, {
        key: "nav",
        value: function nav(name) {
            this.setState({ "display": name });
        }
    }, {
        key: "selectGame",
        value: function selectGame(d) {
            var _this3 = this;

            http.post("../table/getGameNames/read", { name: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.name == d;
                });
                _this3.setState({ gameData: d1[0] });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "selectPublisher",
        value: function selectPublisher(d) {
            var _this4 = this;

            http.post("../table/getGameNamesByPublisher/read", { publisher: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.publisher == d;
                }).map(function (d2) {
                    return d2.name;
                });
                _this4.setState({ gameNames: d1 });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "selectDeveloper",
        value: function selectDeveloper(d) {
            var _this5 = this;

            http.post("../table/getGameNamesByDeveloper/read", { developer: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.developer == d;
                }).map(function (d2) {
                    return d2.name;
                });
                _this5.setState({ gameNames: d1 });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }, {
        key: "chooseGameName",
        value: function chooseGameName(d) {
            var _this6 = this;

            http.post("../table/game/read", { name: d }).then(function (d1) {
                d1 = d1.filter(function (d2) {
                    return d2.name == d;
                });
                _this6.setState({ gameData: d1[0] });
            }).catch(function (d) {
                alert("获取数据失败:" + d);
            });
        }
    }]);

    return App;
}(React.Component);

ReactDom.render(React.createElement(App, null), document.getElementById("display"));

//# sourceMappingURL=main.js.map