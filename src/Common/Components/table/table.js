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
            columns: [],
            sourceData: [],
            filterData: [],
            displayData: [],
            rowFilterValue: "",
            rowAllCheck: false
        };
        var bindArr = ["columnFilterCallback", "rowFilterChange", "tdCallback"];
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
                var promiseInit = http.post("../table/" + tableId + "/init");
                var promiseRead = http.post("../table/" + tableId + "/read");
                Promise.all([promiseInit, promiseRead]).then(function (d) {
                    _this2.setState({
                        columns: d[0],
                        sourceData: d[1],
                        filterData: d[1],
                        displayData: d[1]
                    });
                }).catch(function (d) {
                    console.log("init table failed:" + d);
                });
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.rowFilterValue != nextProps.rowFilterValue) {
                this.rowFilterChange({ target: { value: nextProps.rowFilterValue } });
                this.setState({
                    rowFilterValue: nextProps.rowFilterValue
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { className: "react-table" },
                React.createElement(
                    "div",
                    { className: "table-head" },
                    React.createElement(
                        "div",
                        { className: "column-filter" },
                        React.createElement(Select, { data: this.state.columns, text: "列过滤", callback: this.columnFilterCallback,
                            optionNumPerColumn: 5 })
                    ),
                    React.createElement(
                        "div",
                        { className: "row-filter" },
                        React.createElement("input", { onChange: this.rowFilterChange, placeholder: "行过滤",
                            value: this.state.rowFilterValue })
                    ),
                    React.createElement(
                        "div",
                        { className: "radio-filter" },
                        this.state.columns.filter(function (d) {
                            return d.radio;
                        }).map(function (d) {
                            var radioValues = [];
                            _this3.state.sourceData.forEach(function (d1) {
                                if (!radioValues.includes(d1[d.id])) {
                                    radioValues.push(d1[d.id]);
                                }
                            });
                            var select = React.createElement(
                                "select",
                                { key: d.id, onChange: function onChange(e) {
                                        _this3.radioFilterChange(e, d);
                                    } },
                                React.createElement(
                                    "option",
                                    null,
                                    d.name
                                ),
                                radioValues.map(function (d1) {
                                    return React.createElement(
                                        "option",
                                        { key: d1 },
                                        d1
                                    );
                                })
                            );
                            return select;
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "refresh" },
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    _this3.refresh();
                                } },
                            React.createElement("i", { className: "fa fa-refresh" }),
                            "刷新数据"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "table-body" },
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                this.state.columns.map(function (d) {
                                    return React.createElement(
                                        "th",
                                        { key: d.id, "data-columnId": d.id,
                                            className: d.checked ? "" : "hide" },
                                        d.name
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            this.state.displayData.map(function (d, i) {
                                return React.createElement(
                                    "tr",
                                    { key: i },
                                    _this3.state.columns.map(function (d1) {
                                        var tdHtml = d[d1.id];
                                        if (tdHtml) {
                                            tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                                        }
                                        if (_this3.props[d1.id + "TdCallback"] != undefined) {
                                            return React.createElement("td", { data: d[d1.id], key: d1.id,
                                                "data-columnId": d1.id,
                                                className: d1.checked ? "" : "hide",
                                                onClick: function onClick() {
                                                    _this3.tdCallback(d1.id, d[d1.id]);
                                                },
                                                dangerouslySetInnerHTML: { __html: tdHtml } });
                                        } else {
                                            return React.createElement("td", { data: d[d1.id], key: d1.id,
                                                "data-columnId": d1.id,
                                                className: d1.checked ? "" : "hide",
                                                dangerouslySetInnerHTML: { __html: tdHtml } });
                                        }
                                    })
                                );
                            })
                        )
                    )
                )
            );
        }
    }, {
        key: "columnFilterCallback",
        value: function columnFilterCallback(columns) {
            this.setState({ columns: columns });
        }
    }, {
        key: "rowFilterChange",
        value: function rowFilterChange(e) {
            var matchValue = e.target.value;
            var filterData = this.state.sourceData.filter(function (d) {
                var isFind = false;
                for (var k in d) {
                    if (d[k] != null && d[k].toString().toLowerCase().includes(matchValue.toLowerCase())) {
                        isFind = true;
                        break;
                    }
                }
                return isFind;
            });
            this.setState({
                filterData: filterData,
                displayData: filterData,
                rowFilterValue: matchValue
            });
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var _this4 = this;

            var tableId = this.props.tableId;
            http.post("../table/" + tableId + "/read").then(function (d) {
                d = d.map(function (d1) {
                    d1.checkboxChecked = false;
                    return d1;
                });
                _this4.setState({
                    sourceData: d,
                    filterData: d,
                    displayData: d,
                    rowFilterValue: "",
                    rowAllCheck: false
                });
            }).catch(function (d) {
                alert("刷新数据失败:" + d);
            });
        }
    }, {
        key: "radioFilterChange",
        value: function radioFilterChange(e, d) {
            var filterData = e.target.value == d.name ? this.state.sourceData : this.state.sourceData.filter(function (d1) {
                d1 = d1[d.id];
                d1 = d1 == null ? "" : d1.toString();
                return d1 == e.target.value;
            });
            this.setState({
                filterData: filterData,
                displayData: filterData
            });
        }
    }, {
        key: "tdCallback",
        value: function tdCallback(id, value) {
            this.props[id + "TdCallback"](value);
        }
    }]);

    return table;
}(React.Component);

module.exports = table;

//# sourceMappingURL=table.js.map