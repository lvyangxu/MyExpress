"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require("babel-polyfill");
var React = require("react");
var ReactDom = require("react-dom");
require("karl-extend");
var Nav = require("karl-component-nav");
var http = require("karl-http");
var ReactTransitionGroup = require('react-addons-transition-group');

var Table = require("../../util/table");

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            nav: [{
                id: "serverInfo", name: "服务器信息", open: false,
                child: [{ id: "serverManage", name: "服务器管理" }, { id: "operationGame", name: "运营游戏" }, { id: "cloundClient", name: "云平台登记" }, { id: "companyInfo", name: "公司信息" }]
            }, { id: "serverApply", name: "服务器申请", open: false, child: [] }, {
                id: "financeManage", name: "财务管理", open: false,
                child: [{ id: "costRegister", name: "费用登记" }, { id: "statisticsAnalysis", name: "统计分析" }]
            }, {
                id: "systemManage", name: "系统管理", open: false,
                child: [{ id: "loginLog", name: "登录日志" }]
            }, {
                id: "systemMonitor", name: "服务器监控", open: false,
                child: [{ id: "contact", name: "联系人" }, { id: "zabbix", name: "zabbix" }]
            }, {
                id: "autoDeploy", name: "自动化部署", open: false,
                child: []
            }],
            currentNav: ""
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(App, [{
        key: "componentDidAppear",
        value: function componentDidAppear() {
            console.log(2);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var hash = window.location.hash.replace(/#/g, "");
            var nav = this.state.nav;
            var currentNav = "";
            if (hash == "") {
                nav = nav.map(function (d) {
                    if (d.id == "serverInfo") {
                        d.open = true;
                    }
                    return d;
                });
                currentNav = "serverManage";
            } else {
                nav = nav.map(function (d) {
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
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(Nav, { data: [1, 2, 3] }),
                React.createElement(
                    "div",
                    { className: "main" },
                    React.createElement(
                        "div",
                        { style: this.state.currentNav == "serverManage" ? {} : { display: "none" } },
                        React.createElement(Table, { tableId: "server_info", curd: "curd", attachment: true })
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
    }]);

    return App;
}(React.Component);

ReactDom.render(React.createElement(App, null), document.getElementById("manage"));

//# sourceMappingURL=main.js.map