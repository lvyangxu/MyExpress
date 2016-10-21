"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require("karl-http");
var cookie = require("karl-cookie");
var React = require("react");

var login = function (_React$Component) {
    _inherits(login, _React$Component);

    function login(props) {
        _classCallCheck(this, login);

        var _this = _possibleConstructorReturn(this, (login.__proto__ || Object.getPrototypeOf(login)).call(this, props));

        _this.state = {
            username: "",
            password: "",
            tips: "",
            loginRedirect: ""
        };
        var bindArr = ["getCookieName", "submit", "usernameChange", "passwordChange"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(login, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.getCookieName();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "react-login" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement("input", { value: this.state.username, onChange: this.usernameChange, placeholder: "username",
                        type: "text" })
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement("input", { value: this.state.password, onChange: this.passwordChange, placeholder: "password",
                        type: "password" })
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "button",
                        { onClick: this.submit },
                        "sign in"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "tips" },
                        this.state.tips
                    )
                )
            );
        }
    }, {
        key: "getCookieName",
        value: function getCookieName() {
            var _this2 = this;

            //get cookie name from server
            http.post("../account/getCookieName").then(function (d) {
                var usernameCookie = cookie.get(d.username);
                var passwordCookie = cookie.get(d.password);
                usernameCookie = usernameCookie == undefined ? "" : usernameCookie;
                passwordCookie = passwordCookie == undefined ? "" : passwordCookie;
                _this2.setState({
                    username: usernameCookie,
                    password: passwordCookie,
                    loginRedirect: d.loginRedirect
                });
            }).catch(function (d) {
                _this2.setState({ "tips": "an error occured when set cookie:" + d });
            });
        }
    }, {
        key: "usernameChange",
        value: function usernameChange(e) {
            var d = e.target.value;
            d = d.trim();
            this.setState({ "username": d });
        }
    }, {
        key: "passwordChange",
        value: function passwordChange(e) {
            var d = e.target.value;
            d = d.trim();
            this.setState({ "password": d });
        }
    }, {
        key: "submit",
        value: function submit() {
            var _this3 = this;

            var data = {
                username: this.state.username,
                password: this.state.password
            };
            http.post("../account/login", data).then(function (d) {
                window.location.href = "../" + _this3.state.loginRedirect + "/";
            }).catch(function (d) {
                _this3.setState({ "tips": d });
            });
        }
    }]);

    return login;
}(React.Component);

module.exports = login;

//# sourceMappingURL=login.js.map