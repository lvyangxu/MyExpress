"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require("babel-polyfill");
var React = require("react");
var ReactDom = require("react-dom");
// let Datepicker = require("../karl-component-datepicker/index");
// let Chart = require("../karl-component-chart/index");
var Scroll = require("../karl-component-scroll/index");
var data1 = [{ date: 3, apple: 32, banana: 33, pear: 34, server: 1, region: "中国" }, { date: 5, apple: 32, banana: -20, pear: 34, server: 2, region: "中国" }, { date: 4, apple: 21, banana: -2, pear: 3, server: 2, region: "美国" }, { date: 11, apple: 3, banana: 3, pear: 2, server: 1, region: "阿拉伯" }, { date: 12, apple: 5, banana: 47, server: 1, region: "中国" }, { date: 22, apple: 5, banana: 7, pear: 4, server: 1, region: "美国" }, { date: 13, apple: 8, pear: 6, server: 1, region: "美国" }, { date: 14, apple: 32, banana: 33, pear: 34, server: 1, region: "中国" }];
var data2 = [{ date: "2016-9-11", apple: 32, banana: 33, pear: 34, server: 1, region: "中国" }, { date: "2016-9-11", apple: 32, banana: -20, pear: 34, server: 2, region: "中国" }, { date: "2016-9-11", apple: 21, banana: -2, pear: 3, server: 2, region: "美国" }, { date: "2016-9-13", apple: 3, banana: 3, pear: 2, server: 1, region: "阿拉伯" }, { date: "2016-9-12", apple: 5, banana: 47, server: 1, region: "中国" }, { date: "2016-10-14", apple: 5, banana: 7, pear: 4, server: 1, region: "美国" }, { date: "2017-1-15", apple: 8, pear: 6, server: 1, region: "美国" }, { date: "2016-9-11", apple: 32, banana: 33, pear: 34, server: 1, region: "中国" }];

var Xx = function (_React$Component) {
    _inherits(Xx, _React$Component);

    function Xx(props) {
        _classCallCheck(this, Xx);

        var _this = _possibleConstructorReturn(this, (Xx.__proto__ || Object.getPrototypeOf(Xx)).call(this, props));

        _this.state = {
            data: data1
        };
        return _this;
    }

    _createClass(Xx, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(Datepicker, { type: "second", callback: function callback(d) {
                        console.log(d);
                    } }),
                React.createElement(Chart, { title: "chart", xAxisGroupNum: 10, yAxisText: "kg", x: "date", y: [{ id: "apple", name: "apple" }, { id: "banana", name: "banana" }, { id: "pear", name: "pear" }], data: this.state.data, group: ["server", "region"], type: "bar" }),
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            var data = data2;
                            _this2.setState({ data: data });
                        } },
                    "1"
                )
            );
        }
    }]);

    return Xx;
}(React.Component);

ReactDom.render(React.createElement(
    "div",
    null,
    React.createElement(
        Scroll,
        null,
        React.createElement(
            "div",
            { style: { backgroundColor: "yellow" } },
            "1"
        ),
        React.createElement(
            "div",
            { style: { backgroundColor: "red" } },
            "2"
        ),
        React.createElement(
            "div",
            { style: { backgroundColor: "blue" } },
            "3"
        )
    )
), document.getElementById("test"));
