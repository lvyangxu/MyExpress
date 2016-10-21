"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");

var nav = function (_React$Component) {
    _inherits(nav, _React$Component);

    function nav(props) {
        _classCallCheck(this, nav);

        var _this = _possibleConstructorReturn(this, (nav.__proto__ || Object.getPrototypeOf(nav)).call(this, props));

        _this.state = {
            activeNav: "",
            data: []
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(nav, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var hash = window.location.hash.replace(/#/g, "");
            var data = this.props.data;
            var activeNav = "";
            if (hash != "") {
                activeNav = hash;
            } else {
                if (data.length != 0) {
                    activeNav = data[0];
                }
            }
            this.setState({
                data: data,
                activeNav: activeNav
            });
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value != nextProps.value) {}
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                { className: "react-nav" },
                this.state.data.map(function (d, i) {
                    return React.createElement(
                        "div",
                        { key: i, onClick: function onClick() {
                                _this2.switchNav(d);
                            } },
                        d
                    );
                })
            );
        }
    }, {
        key: "switchNav",
        value: function switchNav(d) {}
    }]);

    return nav;
}(React.Component);

module.exports = nav;

//# sourceMappingURL=nav.js.map