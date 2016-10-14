"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require("./http");
var React = require("react");

var radio = function (_React$Component) {
    _inherits(radio, _React$Component);

    function radio(props) {
        _classCallCheck(this, radio);

        var _this = _possibleConstructorReturn(this, (radio.__proto__ || Object.getPrototypeOf(radio)).call(this, props));

        _this.state = {
            panelShow: false,
            sourceData: [],
            value: "",
            filterData: [],
            pageData: [],
            filterValue: "",
            pageIndex: 0
        };
        var bindArr = ["radioBlur", "panelToggle", "filterChange", "select", "setOptionHtml", "slicePageData"];
        bindArr.forEach(function (d) {
            _this[d] = _this[d].bind(_this);
        });
        return _this;
    }

    _createClass(radio, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            if (this.props.url != undefined) {
                http.post(this.props.url).then(function (d) {
                    var pageData = _this2.slicePageData(d, 0);
                    _this2.setState({
                        value: _this2.props.defaultBlank ? "" : d[0],
                        sourceData: d,
                        filterData: d,
                        pageData: pageData
                    });
                }).catch(function (d) {
                    console.log("init radio failed:" + d);
                });
            } else {
                var data = this.props.data;
                var pageData = this.slicePageData(data, 0);
                this.setState({
                    value: this.props.defaultBlank ? "" : data[0],
                    sourceData: data,
                    filterData: data,
                    pageData: pageData
                });
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (this.props.value != nextProps.value) {
                this.setState({
                    value: nextProps.value
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { className: "react-radio react-radio-child", tabIndex: "0", onBlur: this.radioBlur },
                React.createElement(
                    "div",
                    { className: "input", onClick: this.panelToggle },
                    this.state.value,
                    React.createElement("i", { className: "fa fa-caret-down" })
                ),
                React.createElement(
                    "div",
                    { className: "react-radio-child panel", style: this.state.panelShow ? {} : { display: "none" } },
                    React.createElement(
                        "div",
                        { className: "filter" },
                        React.createElement("i", { className: "fa fa-search" }),
                        React.createElement("input", { className: "react-radio-child", onChange: this.filterChange,
                            value: this.state.filterValue,
                            placeholder: "filter" })
                    ),
                    React.createElement(
                        "div",
                        { className: "options" },
                        this.state.pageData.map(function (d, i) {
                            return React.createElement("div", { key: i, className: "option", onClick: function onClick() {
                                    _this3.select(d);
                                }, dangerouslySetInnerHTML: _this3.setOptionHtml(d) });
                        }),
                        React.createElement(
                            "div",
                            { className: "page" },
                            React.createElement(
                                "button",
                                { className: "react-radio-child page-left", onClick: function onClick() {
                                        _this3.pageLeft();
                                    } },
                                React.createElement("i", { className: "fa fa-angle-left" })
                            ),
                            this.state.pageIndex + 1 + "/" + (Math.ceil(this.state.filterData.length / 10) == 0 ? 1 : Math.ceil(this.state.filterData.length / 10)),
                            React.createElement(
                                "button",
                                { className: "react-radio-child page-right", onClick: function onClick() {
                                        _this3.pageRight();
                                    } },
                                React.createElement("i", { className: "fa fa-angle-right" })
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "radioBlur",
        value: function radioBlur(e) {
            console.log(e.relatedTarget.className);
            if (e.relatedTarget == null || !e.relatedTarget.className.includes("react-radio-child")) {
                this.setState({
                    panelShow: false
                });
            }
        }
    }, {
        key: "panelToggle",
        value: function panelToggle() {
            this.setState({
                panelShow: !this.state.panelShow
            });
        }
    }, {
        key: "filterChange",
        value: function filterChange(e) {
            var filterData = this.state.sourceData.filter(function (d) {
                return d.toString().includes(e.target.value);
            });
            var pageData = this.slicePageData(filterData, 0);
            this.setState({
                filterValue: e.target.value,
                pageIndex: 0,
                filterData: filterData,
                pageData: pageData
            });
        }
    }, {
        key: "select",
        value: function select(d) {
            this.setState({
                panelShow: false,
                value: d
            });

            if (this.props.selectCallback) {
                this.props.selectCallback(d);
            }
        }
    }, {
        key: "setOptionHtml",
        value: function setOptionHtml(d) {
            d = d.toString();
            var v = this.state.filterValue;
            var regex = new RegExp(v, "g");
            if (v == "") {
                return { __html: d };
            } else {
                var result = d.toString().replace(regex, function () {
                    return "<strong>" + v + "</strong>";
                });
                return { __html: result };
            }
        }
    }, {
        key: "slicePageData",
        value: function slicePageData(data, i) {
            var filterData = data;
            var start = i * 10;
            var end = i * 10 + 10;
            end = end > filterData.length ? filterData.length : end;
            var columnData = filterData.slice(start, end);
            return columnData;
        }
    }, {
        key: "pageLeft",
        value: function pageLeft() {
            var i = this.state.pageIndex;
            if (i != 0) {
                i--;
            }
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }, {
        key: "pageRight",
        value: function pageRight() {
            var i = this.state.pageIndex;
            var end = Math.ceil(this.state.filterData.length / 10);
            if (i < end - 1) {
                i++;
            }
            this.setState({
                pageIndex: i,
                pageData: this.slicePageData(this.state.filterData, i)
            });
        }
    }]);

    return radio;
}(React.Component);

module.exports = radio;

//# sourceMappingURL=radio.js.map