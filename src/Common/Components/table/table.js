"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require("./http");
var React = require("react");
var Select = require("./select");
var upload = require("./upload");

var table = function (_React$Component) {
    _inherits(table, _React$Component);

    function table(props) {
        _classCallCheck(this, table);

        var _this = _possibleConstructorReturn(this, (table.__proto__ || Object.getPrototypeOf(table)).call(this, props));

        _this.state = {
            curd: _this.props.curd == undefined ? "r" : _this.props.curd,
            panel: "main",
            columns: [],
            sourceData: [],
            filterData: [],
            displayData: [],
            rowFilterValue: "",
            rowAllChecked: false,
            sortDesc: true,
            sortColumnId: "",
            createLineNum: 5,
            ct: [],
            ut: [],
            attachmentList: [],
            attachmentProgress: "0%",
            loading: false,
            selectFilter: [],
            createReferTableData: []
        };
        var bindArr = ["columnFilterCallback", "rowFilterChange", "refresh", "radioFilterChange", "tdCallback", "sort", "rowAllCheck", "rowCheck", "backToMain", "create", "createSubmit", "createTdChange", "update", "updateSubmit", "updateTdChange", "delete"];
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
                    d[1] = d[1].map(function (d1) {
                        d1.checkboxChecked = false;
                        return d1;
                    });
                    var ct = [];

                    var _loop = function _loop(i) {
                        var ctRow = {};
                        d[0].forEach(function (d1) {
                            ctRow[d1.id] = "";
                        });
                        ct.push(ctRow);
                    };

                    for (var i = 0; i < _this2.state.createLineNum; i++) {
                        _loop(i);
                    }
                    var selectFilter = d[0].filter(function (d1) {
                        return d1.select;
                    }).map(function (d1) {
                        var values = [];
                        var data = [];
                        d[1].forEach(function (d2, j) {
                            if (!values.includes(d2[d1.id])) {
                                values.push(d2[d1.id]);
                                data.push({ id: j, name: d2[d1.id], checked: true });
                            }
                        });
                        return { id: d1.id, name: d1.name, data: data };
                    });

                    _this2.setState({
                        columns: d[0],
                        sourceData: d[1],
                        filterData: d[1],
                        displayData: d[1],
                        ct: ct,
                        selectFilter: selectFilter
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
                    { style: this.state.panel == "main" ? {} : { display: "none" } },
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
                            { className: "create",
                                style: this.state.curd.includes("c") ? { marginLeft: "20px" } : { display: "none" } },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        _this3.create();
                                    } },
                                React.createElement("i", { className: "fa fa-plus" }),
                                "添加"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "update",
                                style: this.state.curd.includes("u") ? { marginLeft: "20px" } : { display: "none" } },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        _this3.update();
                                    } },
                                React.createElement("i", { className: "fa fa-edit" }),
                                "更改"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "refresh",
                                style: this.state.curd.includes("r") ? { marginLeft: "20px" } : { display: "none" } },
                            React.createElement(
                                "button",
                                { className: this.state.loading ? "loading" : "", onClick: function onClick() {
                                        _this3.refresh();
                                    } },
                                React.createElement("i", { className: this.state.loading ? "fa fa-refresh loading" : "fa fa-refresh" }),
                                "刷新"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "delete",
                                style: this.state.curd.includes("d") ? { marginLeft: "20px" } : { display: "none" } },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        _this3.delete();
                                    } },
                                React.createElement("i", { className: "fa fa-times" }),
                                "删除"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "attachment",
                                style: this.props.attachment ? { marginLeft: "20px" } : { display: "none" } },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        _this3.attachment();
                                    } },
                                React.createElement("i", { className: "fa fa-paperclip" }),
                                "附件"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "select-filter", style: this.state.columns.filter(function (d) {
                                    return d.select;
                                }).length > 0 ? { marginTop: "20px" } : {} },
                            this.state.selectFilter.map(function (d, i) {
                                var select = React.createElement(Select, { key: i, data: d.data, text: d.name,
                                    callback: function callback(d1) {
                                        _this3.rowFilterCallback(d.id, d1);
                                    },
                                    optionNumPerColumn: 5 });
                                return select;
                            })
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
                                    React.createElement(
                                        "th",
                                        { className: "checkbox",
                                            style: this.state.curd.includes("u") || this.state.curd.includes("d") ? {} : { display: "none" } },
                                        React.createElement("input", { type: "checkbox", checked: this.state.rowAllChecked, onChange: function onChange() {
                                                _this3.rowAllCheck();
                                            } })
                                    ),
                                    this.state.columns.map(function (d) {
                                        return React.createElement(
                                            "th",
                                            { key: d.id, onClick: function onClick() {
                                                    _this3.sort(d.id);
                                                }, "data-columnId": d.id, className: d.checked ? "" : "hide" },
                                            d.name,
                                            _this3.state.sortColumnId == d.id ? _this3.state.sortDesc ? React.createElement("i", { className: "fa fa-caret-up" }) : React.createElement("i", { className: "fa fa-caret-down" }) : ""
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
                                        React.createElement(
                                            "td",
                                            { className: "checkbox",
                                                style: _this3.state.curd.includes("d") || _this3.state.curd.includes("d") ? {} : { display: "none" } },
                                            React.createElement("input", { checked: d.checkboxChecked, type: "checkbox", onChange: function onChange() {
                                                    _this3.rowCheck(d);
                                                } })
                                        ),
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
                ),
                React.createElement(
                    "div",
                    { className: "panel-create",
                        style: this.state.panel == "create" ? {} : { display: "none" } },
                    React.createElement(
                        "div",
                        { className: "panel-head" },
                        React.createElement(
                            "button",
                            { className: "backToMain", onClick: function onClick() {
                                    _this3.backToMain();
                                } },
                            React.createElement("i", { className: "fa fa-arrow-left" }),
                            "返回表格主界面"
                        ),
                        React.createElement(
                            "button",
                            { className: "submit", onClick: function onClick() {
                                    _this3.createSubmit();
                                } },
                            React.createElement("i", { className: "fa fa-plus" }),
                            "提交"
                        )
                    ),
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                this.state.columns.filter(function (d) {
                                    var filter = d.id == "id";
                                    return !filter;
                                }).map(function (d) {
                                    return React.createElement(
                                        "th",
                                        { key: d.id },
                                        d.name
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            this.state.createReferTableData.map(function (d, i) {
                                return React.createElement(
                                    "tr",
                                    { key: i },
                                    _this3.state.columns.filter(function (d1) {
                                        var filter = d1.id == "id";
                                        return !filter;
                                    }).map(function (d1) {
                                        var td = React.createElement("td", { "data-columnId": d1.id, key: d1.id, dangerouslySetInnerHTML: { __html: d[d1.id].toString().replace(/\n/g, "<br/>") } });
                                        return td;
                                    })
                                );
                            }),
                            this.state.ct.map(function (d, i) {
                                return React.createElement(
                                    "tr",
                                    { key: i },
                                    _this3.state.columns.filter(function (d1) {
                                        var filter = d1.id == "id";
                                        return !filter;
                                    }).map(function (d1) {
                                        var td = void 0;
                                        switch (d1.type) {
                                            case "textarea":
                                                td = React.createElement("textarea", { disabled: d1.createReadonly, value: d[d1.id],
                                                    onChange: function onChange(e) {
                                                        _this3.createTdChange(e, i, d1.id);
                                                    } });
                                                break;
                                            case "radio":
                                                td = React.createElement(
                                                    "select",
                                                    { disabled: d1.createReadonly,
                                                        value: d[d1.id],
                                                        onChange: function onChange(e) {
                                                            _this3.createTdChange(e, i, d1.id);
                                                        } },
                                                    React.createElement("option", null),
                                                    d1.radioArr.map(function (d2, j) {
                                                        return React.createElement(
                                                            "option",
                                                            { key: j },
                                                            d2
                                                        );
                                                    })
                                                );
                                                break;
                                            default:
                                                td = React.createElement("input", { disabled: d1.createReadonly, value: d[d1.id],
                                                    onChange: function onChange(e) {
                                                        _this3.createTdChange(e, i, d1.id);
                                                    } });
                                                break;
                                        }
                                        td = React.createElement(
                                            "td",
                                            { key: d1.id },
                                            td
                                        );
                                        return td;
                                    })
                                );
                            })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-update", style: this.state.panel == "update" ? {} : { display: "none" } },
                    React.createElement(
                        "div",
                        { className: "panel-head" },
                        React.createElement(
                            "button",
                            { className: "backToMain", onClick: function onClick() {
                                    _this3.backToMain();
                                } },
                            React.createElement("i", { className: "fa fa-arrow-left" }),
                            "返回表格主界面"
                        ),
                        React.createElement(
                            "button",
                            { className: "submit", onClick: function onClick() {
                                    _this3.updateSubmit();
                                } },
                            React.createElement("i", { className: "fa fa-edit" }),
                            "提交"
                        )
                    ),
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                this.state.columns.filter(function (d) {
                                    var filter = d.id == "id";
                                    return !filter;
                                }).map(function (d) {
                                    return React.createElement(
                                        "th",
                                        { key: d.id },
                                        d.name
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            this.state.ut.map(function (d, i) {
                                return React.createElement(
                                    "tr",
                                    { key: i },
                                    _this3.state.columns.filter(function (d1) {
                                        var filter = d1.id == "id";
                                        return !filter;
                                    }).map(function (d1) {
                                        var td = void 0;
                                        switch (d1.type) {
                                            case "textarea":
                                                td = React.createElement("textarea", { disabled: d1.updateReadonly,
                                                    value: _this3.state.ut.length == 0 ? "" : _this3.state["ut" + i + "_" + d1.id] == undefined ? "" : _this3.state["ut" + i + "_" + d1.id],
                                                    onChange: function onChange(e) {
                                                        _this3.updateTdChange(e, i, d1.id);
                                                    } });
                                                break;
                                            case "radio":
                                                td = React.createElement(
                                                    "select",
                                                    { disabled: d1.updateReadonly,
                                                        value: _this3.state.ut.length == 0 ? "" : _this3.state["ut" + i + "_" + d1.id] == undefined ? "" : _this3.state["ut" + i + "_" + d1.id],
                                                        onChange: function onChange(e) {
                                                            _this3.updateTdChange(e, i, d1.id);
                                                        } },
                                                    d1.radioArr.map(function (d2, j) {
                                                        return React.createElement(
                                                            "option",
                                                            { key: j },
                                                            d2
                                                        );
                                                    })
                                                );
                                                break;
                                            default:
                                                td = React.createElement("input", { disabled: d1.updateReadonly,
                                                    value: _this3.state.ut.length == 0 ? "" : _this3.state["ut" + i + "_" + d1.id] == undefined ? "" : _this3.state["ut" + i + "_" + d1.id],
                                                    onChange: function onChange(e) {
                                                        _this3.updateTdChange(e, i, d1.id);
                                                    } });
                                                break;
                                        }
                                        td = React.createElement(
                                            "td",
                                            { key: d1.id },
                                            td
                                        );
                                        return td;
                                    })
                                );
                            })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-attachment", style: this.state.panel == "attachment" ? {} : { display: "none" } },
                    React.createElement(
                        "div",
                        { className: "panel-head" },
                        React.createElement(
                            "button",
                            { className: "backToMain", onClick: function onClick() {
                                    _this3.backToMain();
                                } },
                            React.createElement("i", { className: "fa fa-arrow-left" }),
                            "返回表格主界面"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "upload" },
                        React.createElement("input", { type: "file", multiple: "multiple" }),
                        React.createElement(
                            "div",
                            { className: "progress" },
                            this.state.attachmentProgress
                        ),
                        React.createElement(
                            "button",
                            { onClick: function onClick(e) {
                                    _this3.uploadAttachment(e);
                                } },
                            "上传附件"
                        )
                    ),
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "th",
                                    null,
                                    "附件名称"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "删除"
                                )
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            this.state.attachmentList.length == 0 ? React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "td",
                                    { colSpan: "2" },
                                    "no attachment"
                                )
                            ) : this.state.attachmentList.map(function (d) {
                                return React.createElement(
                                    "tr",
                                    { key: d },
                                    React.createElement(
                                        "td",
                                        null,
                                        d
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        React.createElement("i", { className: "fa fa-times", onClick: function onClick() {
                                                _this3.deleteAttachment(d);
                                            } })
                                    )
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
        key: "rowFilterCallback",
        value: function rowFilterCallback(id, data) {
            var checkedValues = data.filter(function (d) {
                return d.checked;
            }).map(function (d) {
                return d.name;
            });
            var filterData = this.state.sourceData.filter(function (d) {
                var isFind = false;
                checkedValues.forEach(function (d1) {
                    if (d[id] != null && d[id].toString().toLowerCase() == d1.toString().toLowerCase()) {
                        isFind = true;
                    }
                });
                return isFind;
            });
            this.state.selectFilter.filter(function (d) {
                return d.id != id;
            }).map(function (d) {
                var checkedValues = d.data.filter(function (d1) {
                    return d1.checked;
                });

                filterData = filterData.filter(function (d1) {
                    var isFind = false;
                    checkedValues.forEach(function (d2) {
                        var tdValue = d1[d.id];
                        var matchValue = d2.name.toString().toLowerCase();
                        if (tdValue != null && tdValue.toString().toLowerCase() == matchValue) {
                            isFind = true;
                        }
                    });
                    return isFind;
                });
            });

            this.setState({
                filterData: filterData,
                displayData: filterData
            });
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var _this4 = this;

            var tableId = this.props.tableId;
            this.setState({
                loading: true
            });
            http.post("../table/" + tableId + "/read").then(function (d) {
                d = d.map(function (d1) {
                    d1.checkboxChecked = false;
                    return d1;
                });
                _this4.setState({
                    loading: false,
                    sourceData: d,
                    filterData: d,
                    displayData: d,
                    rowFilterValue: "",
                    rowAllCheck: false
                });
            }).catch(function (d) {
                _this4.setState({
                    loading: false
                });
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
    }, {
        key: "sort",
        value: function sort(id) {
            var sortDesc = this.state.sortDesc;
            if (this.state.sortColumnId == id) {
                sortDesc = !sortDesc;
            }
            var sortedData = this.state.displayData.concat();
            var regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/g);
            if (sortDesc) {
                sortedData.sort(function (a, b) {
                    var va = void 0,
                        vb = void 0;
                    if (a[id] != null && b[id] != null && a[id].match(regex) != null && b[id].match(regex) != null) {
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
                    if (a[id] != null && b[id] != null && a[id].match(regex) != null && b[id].match(regex) != null) {
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

            this.setState({
                sortColumnId: id,
                sortDesc: sortDesc,
                displayData: sortedData
            });
        }
    }, {
        key: "rowAllCheck",
        value: function rowAllCheck() {
            var _this5 = this;

            var newData = this.state.displayData.map(function (d) {
                d.checkboxChecked = !_this5.state.rowAllChecked;
                return d;
            });
            this.setState({
                rowAllChecked: !this.state.rowAllChecked,
                displayData: newData
            });
        }
    }, {
        key: "rowCheck",
        value: function rowCheck(d) {
            var newData = this.state.displayData.map(function (d1) {
                if (d1 == d) {
                    d1.checkboxChecked = !d1.checkboxChecked;
                }
                return d1;
            });
            this.setState({
                displayData: newData
            });
        }
    }, {
        key: "backToMain",
        value: function backToMain() {
            this.setState({
                panel: "main"
            });
        }
    }, {
        key: "create",
        value: function create() {
            var _this6 = this;

            var data = { panel: "create", createReferTableData: [] };
            if (this.props.createButtonCallback) {
                var checkedData = this.state.displayData.filter(function (d) {
                    return d.checkboxChecked;
                });
                if (checkedData.length != 0) {
                    this.props.createButtonCallback(checkedData).then(function (d) {
                        var defaultCreateValue = d.defaultData;
                        if (d.hasOwnProperty("displayData")) {
                            data.createReferTableData = d.displayData;
                        }

                        var ct = defaultCreateValue.concat();

                        var _loop2 = function _loop2(i) {
                            if (defaultCreateValue[i]) {
                                _this6.state.columns.forEach(function (d1) {
                                    if (!defaultCreateValue[i].hasOwnProperty(d1.id)) {
                                        ct[i][d1.id] = "";
                                    }
                                });
                            } else {
                                (function () {
                                    var row = {};
                                    _this6.state.columns.forEach(function (d1) {
                                        row[d1.id] = "";
                                    });
                                    ct.push(row);
                                })();
                            }
                        };

                        for (var i = 0; i < _this6.state.createLineNum; i++) {
                            _loop2(i);
                        }
                        data.ct = ct;
                        _this6.setState(data);
                    }).catch(function (d) {
                        _this6.setState(data);
                    });
                } else {
                    this.setState(data);
                }
            } else {
                this.setState(data);
            }
        }
    }, {
        key: "createSubmit",
        value: function createSubmit() {
            var _this7 = this;

            var rows = this.state.ct.filter(function (d) {
                var isEmpty = true;
                for (var k in d) {
                    if (d[k].trim() != "") {
                        isEmpty = false;
                        break;
                    }
                }
                return !isEmpty;
            });
            if (rows.length == 0) {
                alert("请至少填写一行数据");
                return;
            }
            if (confirm("你确认要提交以下" + rows.length + "行数据吗?")) {
                (function () {
                    var data = { requestRowsLength: rows.length.toString() };
                    _this7.state.columns.forEach(function (d) {
                        var v = rows.map(function (d1) {
                            return d1[d.id];
                        }).join(",");
                        data[d.id] = v;
                    });
                    var tableId = _this7.props.tableId;
                    http.post("../table/" + tableId + "/create", data).then(function (d) {
                        _this7.refresh();
                        alert("提交成功");
                        _this7.setState({ panel: "main" });
                    }).catch(function (d) {
                        alert("提交失败:" + d);
                    });
                })();
            }
        }
    }, {
        key: "createTdChange",
        value: function createTdChange(e, i, id) {
            var ct = this.state.ct;
            ct[i][id] = e.target.value;
            this.setState({
                ct: ct
            });
        }
    }, {
        key: "update",
        value: function update() {
            var checkedData = this.state.displayData.filter(function (d) {
                return d.checkboxChecked;
            });
            if (checkedData.length == 0) {
                alert("请至少选择一行数据");
                return;
            }
            var json = {
                panel: "update",
                ut: checkedData
            };
            checkedData.map(function (d, i) {
                for (var k in d) {
                    json["ut" + i + "_" + k] = d[k];
                }
            });
            this.setState(json);
        }
    }, {
        key: "updateSubmit",
        value: function updateSubmit() {
            var _this8 = this;

            var rows = this.state.ut;
            if (confirm("你确认要提交以下" + rows.length + "行数据吗?")) {
                (function () {
                    var data = { requestRowsLength: rows.length.toString() };
                    _this8.state.columns.forEach(function (d) {
                        var v = "";
                        for (var i = 0; i < rows.length; i++) {
                            v += _this8.state["ut" + i + "_" + d.id];
                            if (i != rows.length - 1) {
                                v += ",";
                            }
                        }
                        data[d.id] = v;
                    });
                    var tableId = _this8.props.tableId;
                    http.post("../table/" + tableId + "/update", data).then(function (d) {
                        _this8.refresh();
                        alert("提交成功");
                        _this8.setState({ panel: "main" });
                    }).catch(function (d) {
                        alert("提交失败:" + d);
                    });
                })();
            }
        }
    }, {
        key: "updateTdChange",
        value: function updateTdChange(e, i, id) {
            var json = {};
            json["ut" + i + "_" + id] = e.target.value;
            this.setState(json);
        }
    }, {
        key: "delete",
        value: function _delete() {
            var _this9 = this;

            var checkedData = this.state.displayData.filter(function (d) {
                return d.checkboxChecked;
            });
            if (checkedData.length == 0) {
                alert("请至少选择一行数据");
                return;
            }
            var v = checkedData.map(function (d) {
                return d.id;
            }).join(",");
            var data = {
                id: v
            };
            if (confirm("确定要删除以下勾选的" + checkedData.length + "行数据吗?")) {
                var tableId = this.props.tableId;
                http.post("../table/" + tableId + "/delete", data).then(function (d) {
                    _this9.refresh();
                    alert("删除成功");
                }).catch(function (d) {
                    alert("删除失败:" + d);
                });
            }
        }
    }, {
        key: "attachment",
        value: function attachment() {
            var checkedData = this.state.displayData.filter(function (d) {
                return d.checkboxChecked;
            });
            if (checkedData.length != 1) {
                alert("请选择一行数据");
                return;
            }
            var attachmentId = checkedData.map(function (d) {
                return d.id;
            })[0];
            this.setState({
                panel: "attachment",
                attachmentId: attachmentId
            });
            this.refreshAttachment(attachmentId);
        }
    }, {
        key: "refreshAttachment",
        value: function refreshAttachment(id) {
            var _this10 = this;

            var tableId = this.props.tableId;
            http.post("../table/" + tableId + "/attachmentRead", { id: id.toString() }).then(function (d) {
                var attachment = d.map(function (d1) {
                    d1 = d1.base64Decode();
                    return d1;
                });
                _this10.setState({
                    panel: "attachment",
                    attachmentList: attachment
                });
            }).catch(function (d) {
                alert("获取附件列表失败:" + d);
            });
        }
    }, {
        key: "deleteAttachment",
        value: function deleteAttachment(d) {
            var _this11 = this;

            var id = this.state.attachmentId;
            var tableId = this.props.tableId;
            var data = {
                id: id.toString(),
                name: d
            };
            http.post("../table/" + tableId + "/attachmentDelete", data).then(function (d1) {
                _this11.refreshAttachment(id);
                alert("删除成功");
            }).catch(function (d1) {
                alert("删除失败:" + d1);
            });
        }
    }, {
        key: "uploadAttachment",
        value: function uploadAttachment(e) {
            var _this12 = this;

            var id = this.state.attachmentId;
            var tableId = this.props.tableId;
            upload.do("../table/" + tableId + "/attachmentUpload?id=" + id.toString().base64UrlEncode(), e.target.parentNode.childNodes[0], function (d) {
                _this12.setState({
                    attachmentProgress: d + "%"
                });
            }).then(function (d) {
                _this12.refreshAttachment(id);
                alert("上传成功");
            }).catch(function (d) {
                alert("上传失败:" + d);
            });
        }
    }]);

    return table;
}(React.Component);

module.exports = table;

//# sourceMappingURL=table.js.map