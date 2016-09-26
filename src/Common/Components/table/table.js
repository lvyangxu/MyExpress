"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require("./http");
var React = require("react");
var Select = require("./select");

var table = function (_React$Component) {
    _inherits(table, _React$Component);

    function table(props) {
        _classCallCheck(this, table);

        var _this = _possibleConstructorReturn(this, (table.__proto__ || Object.getPrototypeOf(table)).call(this, props));

        _this.state = {
            columns: []
        };
        var bindArr = [];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(table, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var tableId = this.props.tableId;
            if (tableId) {
                http.post("../table/" + tableId + "/init").then(function (d) {
                    _this2.setState({
                        columns: d
                    });
                }).catch(function (d) {
                    console.log("init table failed:" + d);
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "react-table" },
                React.createElement(
                    "div",
                    { className: "table-head" },
                    React.createElement(
                        "div",
                        { className: "column-filter" },
                        React.createElement(Select, { data: this.state.columns })
                    )
                )
            );
        }
    }]);

    return table;
}(React.Component);

module.exports = table;

//# sourceMappingURL=table.js.map