"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _index = require("./index.css");

var _index2 = _interopRequireDefault(_index);

var _karlHttp = require("karl-http");

var _karlHttp2 = _interopRequireDefault(_karlHttp);

require("font-awesome-webpack");

var _karlComponentSelect = require("karl-component-select");

var _karlComponentSelect2 = _interopRequireDefault(_karlComponentSelect);

var _karlComponentDatepicker = require("karl-component-datepicker");

var _karlComponentDatepicker2 = _interopRequireDefault(_karlComponentDatepicker);

var _karlComponentChart = require("karl-component-chart");

var _karlComponentChart2 = _interopRequireDefault(_karlComponentChart);

var _karlComponentRadio = require("karl-component-radio");

var _karlComponentRadio2 = _interopRequireDefault(_karlComponentRadio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var table = function (_React$Component) {
    _inherits(table, _React$Component);

    function table(props) {
        _classCallCheck(this, table);

        //数据顺序为 sourceData > componentFilterData > inputFilterData > sortedData > displayData
        var _this = _possibleConstructorReturn(this, (table.__proto__ || Object.getPrototypeOf(table)).call(this, props));

        _this.state = {
            tableId: _this.props.tableId,
            project: _this.props.project,
            columns: [],
            sectionStyle: _this.props.sectionStyle ? _this.props.sectionStyle : {},
            serverFilter: [],
            rowPerPage: _this.props.rowPerPage ? _this.props.rowPerPage : 10,
            pageIndex: 1,
            isMinColumn: false,
            sourceData: [],
            componentFilterData: [],
            inputFilterData: [],
            sortedData: [],
            displayData: [],
            sortDesc: true,
            sortColumnId: ""
        };

        var bindArr = ["setTable", "setInputFilterData", "columnFilterCallback", "read", "setConditionState", "setChart", "download"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });

        return _this;
    }

    _createClass(table, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            return regeneratorRuntime.async(function componentWillMount$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return regeneratorRuntime.awrap(function _callee() {
                                var data, initData, serverFilter;
                                return regeneratorRuntime.async(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return regeneratorRuntime.awrap(_this2.request("init"));

                                            case 2:
                                                data = _context.sent;
                                                initData = {
                                                    columns: data.columns,
                                                    curd: data.curd
                                                };
                                                serverFilter = data.columns.filter(function (d) {
                                                    return d.hasOwnProperty("serverFilter");
                                                });

                                                if (data.hasOwnProperty("extraFilter")) {
                                                    serverFilter = serverFilter.concat(data.extraFilter);
                                                }
                                                initData.serverFilter = serverFilter;

                                                //最小化列显示
                                                if (data.hasOwnProperty("isMinColumn")) {
                                                    initData.isMinColumn = data.isMinColumn;
                                                }
                                                //初始化图表
                                                if (data.hasOwnProperty("chart")) {
                                                    initData.chart = data.chart;
                                                }
                                                //每页显示的行数
                                                if (data.hasOwnProperty("rowPerPage")) {
                                                    initData.rowPerPage = data.rowPerPage;
                                                }

                                                _this2.setState(initData, function () {
                                                    if (data.hasOwnProperty("autoRead") && data.autoRead == true) {
                                                        _this2.read();
                                                    }
                                                });

                                            case 11:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, null, _this2);
                            }());

                        case 3:
                            _context2.next = 8;
                            break;

                        case 5:
                            _context2.prev = 5;
                            _context2.t0 = _context2["catch"](0);

                            console.log("init table " + this.state.tableId + " failed:" + _context2.t0);

                        case 8:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, null, this, [[0, 5]]);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            return regeneratorRuntime.async(function componentDidMount$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {}

        /**
         * 带jwt的http请求
         */

    }, {
        key: "request",
        value: function request(action, data) {
            var jwt, d;
            return regeneratorRuntime.async(function request$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            data = data == undefined ? {} : data;
                            jwt = localStorage.getItem(this.state.project + "-jwt");

                            if (!(jwt == null)) {
                                _context4.next = 6;
                                break;
                            }

                            location.href = "../login/";
                            _context4.next = 11;
                            break;

                        case 6:
                            data.jwt = jwt;
                            _context4.next = 9;
                            return regeneratorRuntime.awrap(_karlHttp2.default.post("../table/" + this.state.tableId + "/" + action, data));

                        case 9:
                            d = _context4.sent;
                            return _context4.abrupt("return", d);

                        case 11:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { style: this.state.sectionStyle, className: _index2.default.base + " react-table" },
                this.setServerFilterDom(),
                this.setChart(),
                this.setClientFilterDom(),
                this.setTable(),
                this.setBottom()
            );
        }
    }, {
        key: "setChart",
        value: function setChart() {
            var _this3 = this;

            if (this.state.chart == undefined || this.state.sourceData.length == 0) {
                return "";
            }
            var dom = _react2.default.createElement(
                "div",
                { style: this.state.chart ? {} : { display: "none" }, className: _index2.default.chart },
                this.state.chart.map(function (d) {
                    var data = _this3.state.sourceData;
                    data = data ? data : [];
                    var yAxisText = d.hasOwnProperty("yAxisText") ? d.yAxisText : "";
                    var chartSection = _react2.default.createElement(
                        "div",
                        { className: _index2.default.section },
                        _react2.default.createElement(_karlComponentChart2.default, { tipsSuffix: d.tipsSuffix, type: d.type, title: d.title, x: d.x, y: d.y,
                            yAxisText: d.yAxisText, data: data, group: d.group, xAxisGroupNum: d.xAxisGroupNum })
                    );
                    return chartSection;
                })
            );
            return dom;
        }
    }, {
        key: "setTable",
        value: function setTable() {
            var _this4 = this;

            var thead = _react2.default.createElement(
                "thead",
                null,
                _react2.default.createElement(
                    "tr",
                    null,
                    this.state.columns.map(function (d) {
                        var style = d.hasOwnProperty("thStyle") ? d.thStyle : {};
                        if (d.hasOwnProperty("checked") && d.checked == false) {
                            style.display = "none";
                        }
                        var th = _react2.default.createElement(
                            "th",
                            { style: style, onClick: function onClick() {
                                    var json = _this4.sort(d.id);
                                    json.displayData = _this4.setDisplayData(json.sortedData);
                                    _this4.setState(json);
                                } },
                            d.name,
                            _this4.state.sortColumnId == d.id ? _this4.state.sortDesc ? _react2.default.createElement("i", { className: "fa fa-caret-up" }) : _react2.default.createElement("i", { className: "fa fa-caret-down" }) : ""
                        );
                        return th;
                    })
                )
            );
            var tbody = _react2.default.createElement(
                "tbody",
                null,
                this.state.displayData.map(function (d, i) {
                    var tds = _this4.state.columns.map(function (d1, j) {
                        var tdHtml = d[d1.id];
                        if (tdHtml) {
                            tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                        }
                        //当含有后缀并且不为空字符串时，附加后缀
                        if (d1.hasOwnProperty("suffix") && tdHtml != "") {
                            tdHtml += d1.suffix;
                        }
                        var style = d1.hasOwnProperty("tdStyle") ? d1.tdStyle : {};
                        if (d1.hasOwnProperty("checked") && d1.checked == false) {
                            style.display = "none";
                        } else {
                            delete style.display;
                        }
                        return _react2.default.createElement("td", { key: j, style: style,
                            dangerouslySetInnerHTML: { __html: tdHtml } });
                    });
                    var tr = _react2.default.createElement(
                        "tr",
                        { key: i },
                        tds
                    );
                    return tr;
                })
            );
            var dom = _react2.default.createElement(
                "div",
                { className: _index2.default.middle },
                _react2.default.createElement(
                    "table",
                    null,
                    thead,
                    tbody
                )
            );
            return dom;
        }
    }, {
        key: "setBottom",
        value: function setBottom() {}

        /**
         * 设置表格服务端筛选的组件dom
         * @returns {*}
         */

    }, {
        key: "setServerFilterDom",
        value: function setServerFilterDom() {
            var _this5 = this;

            var dom = _react2.default.createElement(
                "div",
                { className: _index2.default.serverFilter },
                this.state.serverFilter.map(function (d) {
                    var condition = void 0;
                    //设置条件筛选的默认日期
                    var add = 0,
                        startAdd = -7,
                        endAdd = 0;

                    if (d.type == "rangeMonth") {
                        startAdd = -1;
                    }
                    if (d.type == "rangeSecond") {
                        startAdd = -60 * 60 * 24 * 7;
                    }
                    if (d.hasOwnProperty("dateAdd")) {
                        var dateAdd = d.dateAdd;
                        add = dateAdd.hasOwnProperty("add") ? dateAdd.add : add;
                        startAdd = dateAdd.hasOwnProperty("startAdd") ? dateAdd.startAdd : startAdd;
                        endAdd = dateAdd.hasOwnProperty("endAdd") ? dateAdd.endAdd : endAdd;
                    }
                    var placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                    var requiredClassName = d.required ? " " + _index2.default.required : "";
                    switch (d.type) {
                        case "input":
                            placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                            condition = _react2.default.createElement(
                                "div",
                                { className: _index2.default.section },
                                _react2.default.createElement("input", { className: _index2.default.filter + requiredClassName,
                                    placeholder: placeholder, type: "text",
                                    value: _this5.state[d.id + "Condition"],
                                    onChange: function onChange(e) {
                                        _this5.setConditionState(d.id + "Condition", e.target.value);
                                    } })
                            );
                            break;
                        case "integer":
                            placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                            condition = _react2.default.createElement(
                                "div",
                                { className: _index2.default.section },
                                _react2.default.createElement("input", { className: _index2.default.filter + requiredClassName, placeholder: placeholder, min: "0",
                                    type: "number",
                                    value: _this5.state[d.id + "Condition"], onChange: function onChange(e) {
                                        _this5.setConditionState(d.id + "Condition", e.target.value);
                                    } })
                            );
                            break;
                        case "radio":
                            condition = _react2.default.createElement(
                                "div",
                                { className: _index2.default.section },
                                _react2.default.createElement(_karlComponentRadio2.default, { data: d.data, prefix: d.name + " : ", initCallback: function initCallback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    }, callback: function callback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    } })
                            );
                            break;
                        case "day":
                        case "month":
                        case "second":
                            condition = _react2.default.createElement(
                                "div",
                                { className: _index2.default.section },
                                _react2.default.createElement(_karlComponentDatepicker2.default, { type: d.type, add: add, initCallback: function initCallback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    }, callback: function callback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    } })
                            );
                            break;
                        case "rangeDay":
                        case "rangeMonth":
                        case "rangeSecond":
                            var type = void 0;
                            switch (d.type) {
                                case "rangeDay":
                                    type = "day";
                                    break;
                                case "rangeMonth":
                                    type = "month";
                                    break;
                                case "rangeSecond":
                                    type = "second";
                                    break;
                            }
                            condition = _react2.default.createElement(
                                "div",
                                { style: { display: "inline-block" } },
                                _react2.default.createElement(
                                    "div",
                                    { className: _index2.default.section },
                                    _react2.default.createElement(_karlComponentDatepicker2.default, { type: type, add: startAdd, initCallback: function initCallback(d1) {
                                            _this5.setConditionState(d.id + "ConditionStart", d1);
                                        }, callback: function callback(d1) {
                                            _this5.setConditionState(d.id + "ConditionStart", d1);
                                        } })
                                ),
                                _react2.default.createElement(
                                    "div",
                                    { className: _index2.default.section },
                                    _react2.default.createElement(_karlComponentDatepicker2.default, { type: type, add: endAdd, initCallback: function initCallback(d1) {
                                            _this5.setConditionState(d.id + "ConditionEnd", d1);
                                        }, callback: function callback(d1) {
                                            _this5.setConditionState(d.id + "ConditionEnd", d1);
                                        } })
                                )
                            );
                            break;
                        case "select":
                            condition = _react2.default.createElement(
                                "div",
                                { className: _index2.default.section },
                                _react2.default.createElement(_karlComponentSelect2.default, { data: d.data, text: d.name, initCallback: function initCallback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    }, callback: function callback(d1) {
                                        _this5.setConditionState(d.id + "Condition", d1);
                                    } })
                            );
                            break;
                    }
                    return condition;
                }),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: this.state.loading ? _index2.default.loading + " " + _index2.default.filter : _index2.default.filter,
                            onClick: this.read, disabled: this.state.loading },
                        _react2.default.createElement("i", { className: this.state.loading ? _index2.default.loading + " fa fa-refresh" : "fa fa-refresh" }),
                        "\u5237\u65B0"
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "button",
                        { className: _index2.default.filter, onClick: this.download },
                        _react2.default.createElement("i", { className: "fa fa-download" }),
                        "\u5BFC\u51FA"
                    )
                )
            );
            return dom;
        }

        /**
         * 设置表格客户端筛选的组件dom
         * @returns {*}
         */

    }, {
        key: "setClientFilterDom",
        value: function setClientFilterDom() {
            var _this6 = this;

            var pageArr = [];
            for (var i = 0; i < Math.ceil(this.state.inputFilterData.length / this.state.rowPerPage); i++) {
                pageArr.push(i + 1);
            }

            //所有的客户端筛选字段
            var clientFilterDom = this.state.columns.filter(function (d) {
                return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
            }).map(function (d) {
                var stateId = "clientFilter" + d.id;
                var data = [];
                if (_this6.state.hasOwnProperty(stateId)) {
                    //如果有state,直接使用原来的data
                    data = _this6.state[stateId];
                } else {
                    //如果没有该state,对控件值进行初始化
                    _this6.state.sourceData.forEach(function (d1) {
                        if (!data.includes(d1[d.id])) {
                            data.push(d1[d.id]);
                        }
                    });
                    data = data.map(function (d, i) {
                        return { id: i, name: d, checked: true };
                    });
                }

                return _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(_karlComponentSelect2.default, { data: data, text: d.name, callback: function callback(d1) {
                            var json = {};
                            json["clientFilter" + d.id] = d1;
                            _this6.setState(json, function () {
                                _this6.setComponentFilterData();
                            });
                        } })
                );
            });

            var dom = _react2.default.createElement(
                "div",
                { className: _index2.default.clientFilter },
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(_karlComponentSelect2.default, { data: this.state.columns, text: "\u5217\u8FC7\u6EE4", callback: this.columnFilterCallback,
                        optionNumPerColumn: 5 })
                ),
                clientFilterDom,
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement("input", { className: _index2.default.rowFilter, onChange: function onChange(e) {
                            _this6.setInputFilterData(e.target.value);
                        }, placeholder: "\u884C\u8FC7\u6EE4",
                        value: this.state.rowFilterValue })
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(
                        "select",
                        { className: _index2.default.filter, value: this.state.pageIndex, onChange: function onChange(e) {
                                _this6.setState({ pageIndex: e.target.value }, function () {
                                    var json = _this6.sort();
                                    json.displayData = _this6.setDisplayData(json.sortedData);
                                    _this6.setState(json);
                                });
                            } },
                        pageArr.map(function (d) {
                            return _react2.default.createElement(
                                "option",
                                { value: d },
                                d
                            );
                        })
                    ),
                    _react2.default.createElement(
                        "label",
                        null,
                        "\u5171",
                        pageArr.length,
                        "\u9875"
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: _index2.default.section },
                    _react2.default.createElement(_karlComponentRadio2.default, { prefix: "\u6BCF\u9875", value: this.state.rowPerPage, suffix: "\u884C", data: [5, 10, 15, 20, 25, 50, 100],
                        callback: function callback(d) {
                            _this6.setState({
                                pageIndex: 1,
                                rowPerPage: d
                            }, function () {
                                var json = _this6.sort();
                                json.displayData = _this6.setDisplayData(_this6.state.sortedData);
                                _this6.setState(json);
                            });
                        } })
                )
            );
            return dom;
        }

        /**
         * 根据客户端过滤后的数据和当前页数计算当前页显示的数据
         * @param sortedData
         * @returns {*}
         */

    }, {
        key: "setDisplayData",
        value: function setDisplayData(sortedData) {
            var start = (this.state.pageIndex - 1) * this.state.rowPerPage;
            var end = this.state.pageIndex * this.state.rowPerPage;
            end = Math.min(end, sortedData.length);
            var displayData = sortedData.slice(start, end);
            return displayData;
        }

        /**
         * 从服务器读取数据
         */

    }, {
        key: "read",
        value: function read() {
            var _this7 = this;

            return regeneratorRuntime.async(function read$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            _context6.next = 3;
                            return regeneratorRuntime.awrap(function _callee2() {
                                var requestData, message, data, displayData, json, columns;
                                return regeneratorRuntime.async(function _callee2$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _this7.setState({
                                                    loading: true
                                                });
                                                //附加查询条件的数据
                                                requestData = {};

                                                _this7.state.serverFilter.forEach(function (d) {
                                                    switch (d.type) {
                                                        case "day":
                                                        case "month":
                                                        case "select":
                                                        case "input":
                                                        case "integer":
                                                        case "radio":
                                                            requestData[d.id] = _this7.state[d.id + "Condition"];
                                                            break;
                                                        case "rangeDay":
                                                        case "rangeMonth":
                                                        case "rangeSecond":
                                                            requestData[d.id] = {
                                                                start: _this7.state[d.id + "ConditionStart"],
                                                                end: _this7.state[d.id + "ConditionEnd"]
                                                            };
                                                            break;
                                                    }
                                                });
                                                _context5.next = 5;
                                                return regeneratorRuntime.awrap(_this7.request("read", requestData));

                                            case 5:
                                                message = _context5.sent;
                                                data = message.data;
                                                displayData = _this7.setDisplayData(data);
                                                json = {
                                                    loading: false,
                                                    sourceData: data,
                                                    sortedData: data,
                                                    componentFilterData: data,
                                                    inputFilterData: data,
                                                    displayData: displayData,
                                                    sortColumnId: "",
                                                    rowFilterValue: ""
                                                };

                                                //设置客户端筛选组件控件的值为undefind，恢复为全选

                                                _this7.state.columns.filter(function (d) {
                                                    return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
                                                }).forEach(function (d) {
                                                    var id = d.id;
                                                    var componentData = [];
                                                    data.forEach(function (d1) {
                                                        if (!componentData.includes(d1[id])) {
                                                            componentData.push(d1[id]);
                                                        }
                                                    });
                                                    componentData = componentData.map(function (d1, i) {
                                                        return { id: i, name: d1, checked: true };
                                                    });
                                                    json["clientFilter" + id] = componentData;
                                                });

                                                if (message.hasOwnProperty("columns")) {
                                                    json.columns = message.columns;
                                                }

                                                //隐藏没有数据的列,显示有数据的列
                                                if (_this7.state.isMinColumn) {
                                                    columns = json.hasOwnProperty("columns") ? json.columns : _this7.state.columns;

                                                    json.columns = columns.map(function (d) {
                                                        //判断该列是否为空
                                                        var isNotEmpty = data.some(function (d1) {
                                                            return d1.hasOwnProperty(d.id) && d1[d.id] != "" && d1[d.id] != null;
                                                        });
                                                        d.checked = isNotEmpty;
                                                        return d;
                                                    });
                                                }
                                                _this7.setState(json);

                                            case 13:
                                            case "end":
                                                return _context5.stop();
                                        }
                                    }
                                }, null, _this7);
                            }());

                        case 3:
                            _context6.next = 9;
                            break;

                        case 5:
                            _context6.prev = 5;
                            _context6.t0 = _context6["catch"](0);

                            this.setState({
                                loading: false
                            });
                            alert("刷新数据失败:" + _context6.t0);

                        case 9:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, null, this, [[0, 5]]);
        }

        /**
         * 行过滤输入改变时的回调
         */

    }, {
        key: "setInputFilterData",
        value: function setInputFilterData(value) {
            var _this8 = this;

            var matchValue = value == undefined ? this.state.rowFilterValue : value;
            var inputFilterData = this.state.componentFilterData.filter(function (d) {
                var isFind = false;
                for (var k in d) {
                    if (d[k] != null && d[k].toString().toLowerCase().includes(matchValue.toLowerCase())) {
                        isFind = true;
                        break;
                    }
                }
                return isFind;
            });
            var json = this.sort();
            var json2 = {
                pageIndex: 1,
                inputFilterData: inputFilterData
            };
            if (value != undefined) {
                json2.rowFilterValue = matchValue;
            }
            this.setState(json2, function () {
                var json1 = _this8.sort();
                for (var k in json1) {
                    json[k] = json1[k];
                }
                json.displayData = _this8.setDisplayData(json.sortedData);
                _this8.setState(json);
            });
        }

        /**
         * 列过滤改变时的回调
         * @param columns
         */

    }, {
        key: "columnFilterCallback",
        value: function columnFilterCallback(columns) {
            this.setState({ columns: columns });
        }

        /**
         * 设置筛选条件的状态
         * @param id
         * @param value
         */

    }, {
        key: "setConditionState",
        value: function setConditionState(id, value, callback) {
            var json = {};
            json[id] = value;
            this.setState(json, function () {
                if (callback) {
                    callback();
                }
            });
        }

        /**
         * 根据列的值对行排序
         * @param id
         */

    }, {
        key: "sort",
        value: function sort(id) {
            var sortDesc = this.state.sortDesc;
            if (id == undefined) {
                id = this.state.sortColumnId;
            } else {
                if (this.state.sortColumnId == id) {
                    sortDesc = !sortDesc;
                }
            }

            var sortedData = this.state.inputFilterData.concat();
            var regex = new RegExp(/^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/g);
            if (sortDesc) {
                sortedData.sort(function (a, b) {
                    var va = void 0,
                        vb = void 0;
                    if (a[id] != null && b[id] != null && a[id].toString().match(regex) != null && b[id].toString().match(regex) != null) {
                        va = a[id];
                        vb = b[id];
                    } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                        va = parseFloat(a[id]);
                        vb = parseFloat(b[id]);
                    } else {
                        va = a[id] == null ? "" : a[id];
                        vb = b[id] == null ? "" : b[id];
                    }
                    return va > vb ? 1 : -1;
                });
            } else {
                sortedData.sort(function (a, b) {
                    var va = void 0,
                        vb = void 0;
                    if (a[id] != null && b[id] != null && a[id].toString().match(regex) != null && b[id].toString().match(regex) != null) {
                        va = a[id];
                        vb = b[id];
                    } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                        va = parseFloat(a[id]);
                        vb = parseFloat(b[id]);
                    } else {
                        va = a[id] == null ? "" : a[id];
                        vb = b[id] == null ? "" : b[id];
                    }
                    return va < vb ? 1 : -1;
                });
            }
            return {
                sortColumnId: id,
                sortDesc: sortDesc,
                sortedData: sortedData
            };
        }

        /**
         * 根据客户端筛选组件的状态设置componentFilterData
         */

    }, {
        key: "setComponentFilterData",
        value: function setComponentFilterData() {
            var _this9 = this;

            var componentFilterData = this.state.sourceData.concat();
            this.state.columns.filter(function (d) {
                return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
            }).forEach(function (d) {
                var id = d.id;
                var componentData = _this9.state["clientFilter" + id];
                componentFilterData = componentFilterData.filter(function (d1) {
                    //过滤组件没有勾选的行
                    var checkedArr = componentData.filter(function (d2) {
                        return d2.checked;
                    }).map(function (d2) {
                        return d2.name;
                    });
                    var isValid = checkedArr.some(function (d2) {
                        return d2 == d1[id];
                    });
                    return isValid;
                });
            });
            this.setState({
                componentFilterData: componentFilterData
            }, function () {
                _this9.setInputFilterData();
            });
        }
    }, {
        key: "download",
        value: function download() {
            var _this10 = this;

            var header, body, data, message;
            return regeneratorRuntime.async(function download$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (!(this.state.sourceData.length == 0)) {
                                _context7.next = 2;
                                break;
                            }

                            return _context7.abrupt("return");

                        case 2:
                            header = this.state.columns.map(function (d) {
                                return d.name;
                            });
                            body = this.state.sourceData.map(function (d) {
                                var rowData = _this10.state.columns.map(function (d1) {
                                    return d[d1.id];
                                });
                                return rowData;
                            });
                            data = [header].concat(body);
                            _context7.prev = 5;
                            _context7.next = 8;
                            return regeneratorRuntime.awrap(this.request("download", { data: data }));

                        case 8:
                            message = _context7.sent;

                            location.href = "../" + message.filePath;
                            _context7.next = 15;
                            break;

                        case 12:
                            _context7.prev = 12;
                            _context7.t0 = _context7["catch"](5);

                            alert("导出数据失败:" + _context7.t0);

                        case 15:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, null, this, [[5, 12]]);
        }
    }]);

    return table;
}(_react2.default.Component);

module.exports = table;
