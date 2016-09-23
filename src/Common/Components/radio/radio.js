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
            filterOptionData: [],
            filterValue: ""
        };
        var bindArr = ["radioBlur", "panelToggle", "filterChange", "filterBlur", "select", "setOptionHtml", "setFilterOptionData"];
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
                    var filterOptionData = _this2.setFilterOptionData(d);
                    _this2.setState({
                        value: _this2.props.defaultBlank ? "" : d[0],
                        sourceData: d,
                        filterOptionData: filterOptionData
                    });
                }).catch(function (d) {
                    console.log("init radio failed:" + d);
                });
            } else {
                var data = this.props.data;
                var filterOptionData = this.setFilterOptionData(data);
                this.setState({
                    value: this.props.defaultBlank ? "" : data[0],
                    sourceData: data,
                    filterOptionData: filterOptionData
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return React.createElement(
                "div",
                { className: "react-radio", tabIndex: "0", onBlur: this.radioBlur },
                React.createElement(
                    "div",
                    { className: "input", onClick: this.panelToggle },
                    this.state.value,
                    React.createElement("i", { className: "fa fa-caret-down" })
                ),
                React.createElement(
                    "div",
                    { className: "panel", style: this.state.panelShow ? {} : { display: "none" } },
                    React.createElement(
                        "div",
                        { className: "filter" },
                        React.createElement("i", { className: "fa fa-search" }),
                        React.createElement("input", { onChange: this.filterChange, onBlur: this.filterBlur, value: this.state.filterValue,
                            placeholder: "filter" })
                    ),
                    React.createElement(
                        "div",
                        { className: "options" },
                        this.state.filterOptionData.map(function (d, i) {
                            return React.createElement(
                                "div",
                                { key: i, className: "column" },
                                d.map(function (d1, j) {
                                    return React.createElement("div", { className: "option", onClick: function onClick() {
                                            _this3.select(d1);
                                        }, key: j, dangerouslySetInnerHTML: _this3.setOptionHtml(d1) });
                                })
                            );
                        })
                    )
                )
            );
        }
    }, {
        key: "radioBlur",
        value: function radioBlur(e) {
            var panel = e.target.getElementsByClassName("panel")[0];
            if (panel == undefined) {
                this.setState({
                    panelShow: false
                });
                return;
            }
            var selfInput = panel.getElementsByClassName("filter")[0].getElementsByTagName("input")[0];
            if (e.relatedTarget != selfInput) {
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
            var filterOptionData = this.state.sourceData.filter(function (d) {
                return d.toString().includes(e.target.value);
            });
            filterOptionData = this.setFilterOptionData(filterOptionData);
            this.setState({
                filterValue: e.target.value,
                filterOptionData: filterOptionData
            });
        }
    }, {
        key: "filterBlur",
        value: function filterBlur(e) {
            e.preventDefault();
            e.stopPropagation();
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
        key: "setFilterOptionData",
        value: function setFilterOptionData(d) {
            var columnDataArr = [];
            for (var i = 0; i < d.length; i = i + 10) {
                var end = i + 10 > d.length ? d.length : i + 10;
                var columnData = d.slice(i, end);
                columnDataArr.push(columnData);
            }
            return columnDataArr;
        }
    }]);

    return radio;
}(React.Component);

module.exports = radio;

//# sourceMappingURL=radio.js.map