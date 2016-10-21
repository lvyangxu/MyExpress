"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var ReactDom = require("react-dom");
require("karl-extend");
var Radio = require("karl-component-radio");
var http = require("karl-http");

var Table = require("../../util/table");

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            display: "game"
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var hash = window.location.hash.replace(/#/g, "");
            switch (hash) {
                case "game":
                case "cp":
                case "contact":
                    this.setState({ display: hash });
                    break;
            }
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
                        "源数据-游戏"
                    ),
                    React.createElement(
                        "div",
                        { className: this.state.display == "cp" ? "active" : "", onClick: function onClick() {
                                _this2.nav("cp");
                            } },
                        "源数据-CP"
                    ),
                    React.createElement(
                        "div",
                        { className: this.state.display == "contact" ? "active" : "", onClick: function onClick() {
                                _this2.nav("contact");
                            } },
                        "源数据-沟通"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "info" },
                    React.createElement(
                        "div",
                        { style: this.state.display == "game" ? {} : { display: "none" }, className: "game-panel" },
                        React.createElement(Table, { tableId: "game", curd: "curd", attachment: true })
                    ),
                    React.createElement(
                        "div",
                        { style: this.state.display == "cp" ? {} : { display: "none" }, className: "cp-panel" },
                        React.createElement(Table, { tableId: "cp", curd: "curd" })
                    ),
                    React.createElement(
                        "div",
                        { style: this.state.display == "contact" ? {} : { display: "none" }, className: "contact-panel" },
                        React.createElement(Table, { tableId: "contact", curd: "curd", createButtonCallback: function createButtonCallback(checkedData) {
                                var firstCheckedName = checkedData[0].name;
                                var callbackPromise = new Promise(function (resolve, reject) {
                                    http.post("../table/contactByName/read", { name: firstCheckedName }).then(function (d) {
                                        var data = {
                                            defaultData: [{ name: firstCheckedName }],
                                            displayData: d
                                        };
                                        resolve(data);
                                    }).catch(function (d) {
                                        reject(d);
                                    });
                                });
                                return callbackPromise;
                            } })
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