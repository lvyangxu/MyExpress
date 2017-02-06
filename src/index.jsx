import React from "react";
import css from "./index.scss";
import http from "karl-http";
import "font-awesome-webpack";
import Select from "karl-component-select";
import Datepicker from "karl-component-datepicker";
import Chart from "karl-component-chart";
import Radio from "karl-component-radio";

class table extends React.Component {
    constructor(props) {
        super(props);

        //数据顺序为 sourceData > componentFilterData > inputFilterData > sortedData > displayData
        this.state = {
            tableId: this.props.tableId,
            project: this.props.project,
            columns: [],
            sectionStyle: this.props.sectionStyle ? this.props.sectionStyle : {},
            serverFilter: [],
            rowPerPage: this.props.rowPerPage ? this.props.rowPerPage : 10,
            pageIndex: 1,
            isMinColumn: false,
            sourceData: [],
            componentFilterData: [],
            inputFilterData: [],
            sortedData: [],
            displayData: [],
            sortDesc: true,
            sortColumnId: "",
        };

        let bindArr = ["setTable", "setInputFilterData", "columnFilterCallback", "read", "setConditionState", "setChart", "download"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });

    }

    async componentWillMount() {
        try {
            let data = await this.request("init");
            let initData = {
                columns: data.columns,
                curd: data.curd
            };

            let serverFilter = data.columns.filter(d=> {
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

            this.setState(initData, ()=> {
                if (data.hasOwnProperty("autoRead") && data.autoRead == true) {
                    this.read();
                }
            });
        } catch (e) {
            console.log("init table " + this.state.tableId + " failed:" + e);
        }
    }

    async componentDidMount() {

    }


    componentWillReceiveProps(nextProps) {

    }

    /**
     * 带jwt的http请求
     */
    async request(action, data) {
        data = (data == undefined) ? {} : data;
        let jwt = localStorage.getItem(this.state.project + "-jwt");
        if (jwt == null) {
            location.href = "../login/";
        } else {
            data.jwt = jwt;
            let d = await http.post("../table/" + this.state.tableId + "/" + action, data);
            return d;
        }
    }

    render() {
        return (
            <div style={this.state.sectionStyle} className={css.base + " react-table"}>
                {
                    this.setServerFilterDom()
                }
                {
                    this.setChart()
                }
                {
                    this.setClientFilterDom()
                }
                {
                    this.setTable()
                }
                {
                    this.setBottom()
                }
            </div>
        );
    }

    setChart() {
        if (this.state.chart == undefined || this.state.sourceData.length == 0) {
            return "";
        }
        let dom = <div style={this.state.chart ? {} : {display: "none"}} className={css.chart}>
            {
                this.state.chart.map(d=> {
                    let data = this.state.sourceData;
                    data = data ? data : [];
                    let yAxisText = d.hasOwnProperty("yAxisText") ? d.yAxisText : "";
                    let chartSection = <div className={css.section}>
                        {
                            <Chart tipsSuffix={d.tipsSuffix} type={d.type} title={d.title} x={d.x} y={d.y}
                                   yAxisText={d.yAxisText} data={data} group={d.group} xAxisGroupNum={d.xAxisGroupNum}/>
                        }
                    </div>;
                    return chartSection;
                })
            }
        </div>;
        return dom;
    }

    setTable() {
        let dom = <div className={css.middle}>
            <table>
                <thead>
                <tr>
                    {
                        this.state.columns.map(d=> {
                            let style = d.hasOwnProperty("thStyle") ? d.thStyle : {};
                            if (d.hasOwnProperty("checked") && d.checked == false) {
                                style.display = "none";
                            }
                            let th = <th style={style} onClick={() => {
                                let json = this.sort(d.id);
                                json.displayData = this.setDisplayData(json.sortedData);
                                this.setState(json);
                            }}>{d.name}{
                                (this.state.sortColumnId == d.id) ? (
                                    this.state.sortDesc ?
                                        <i className="fa fa-caret-up"></i> :
                                        <i className="fa fa-caret-down"></i>
                                ) : ""
                            }</th>;
                            return th;
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.state.displayData.map((d, i) => {
                        return <tr key={i}>
                            {
                                this.state.columns.map((d1, j) => {
                                    let tdHtml = d[d1.id];
                                    if (tdHtml) {
                                        tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                                    }
                                    //当含有后缀并且不为空字符串时，附加后缀
                                    if (d1.hasOwnProperty("suffix") && tdHtml != "") {
                                        tdHtml += d1.suffix;
                                    }
                                    let style = d1.hasOwnProperty("tdStyle") ? d1.tdStyle : {};
                                    if (d1.hasOwnProperty("checked") && d1.checked == false) {
                                        style.display = "none";
                                    }
                                    return <td key={j} style={style}
                                               dangerouslySetInnerHTML={{__html: tdHtml}}></td>

                                })
                            }
                        </tr>;
                    })
                }
                </tbody>
            </table>
        </div>;
        return dom;
    }

    setBottom() {

    }

    /**
     * 设置表格服务端筛选的组件dom
     * @returns {*}
     */
    setServerFilterDom() {
        let dom = <div className={css.serverFilter}>
            {
                this.state.serverFilter.map(d=> {
                    let condition;
                    //设置条件筛选的默认日期
                    let [add,startAdd,endAdd] = [0, -7, 0];
                    if (d.type == "rangeMonth") {
                        startAdd = -1;
                    }
                    if (d.type == "rangeSecond") {
                        startAdd = -60 * 60 * 24 * 7;
                    }
                    if (d.hasOwnProperty("dateAdd")) {
                        let dateAdd = d.dateAdd;
                        add = dateAdd.hasOwnProperty("add") ? dateAdd.add : add;
                        startAdd = dateAdd.hasOwnProperty("startAdd") ? dateAdd.startAdd : startAdd;
                        endAdd = dateAdd.hasOwnProperty("endAdd") ? dateAdd.endAdd : endAdd;
                    }
                    let placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                    let requiredClassName = d.required ? (" " + css.required) : "";
                    switch (d.type) {
                        case "input":
                            placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                            condition = <div className={css.section}>
                                <input className={css.filter + requiredClassName}
                                       placeholder={placeholder} type="text"
                                       value={this.state[d.id + "Condition"]}
                                       onChange={e=> {
                                           this.setConditionState(d.id + "Condition", e.target.value);
                                       }}/>
                            </div>;
                            break;
                        case "integer":
                            placeholder = d.hasOwnProperty("placeholder") ? d.placeholder : d.name;
                            condition = <div className={css.section}>
                                <input className={css.filter + requiredClassName} placeholder={placeholder} min="0"
                                       type="number"
                                       value={this.state[d.id + "Condition"]} onChange={e=> {
                                    this.setConditionState(d.id + "Condition", e.target.value);
                                }}/>
                            </div>;
                            break;
                        case "radio":
                            condition = <div className={css.section}>
                                <Radio data={d.data} prefix={d.name + " : "} initCallback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }} callback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }}/>
                            </div>;
                            break;
                        case "day":
                        case "month":
                        case "second":
                            condition = <div className={css.section}>
                                <Datepicker type={d.type} add={add} initCallback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }} callback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }}/>
                            </div>;
                            break;
                        case "rangeDay":
                        case "rangeMonth":
                        case "rangeSecond":
                            let type;
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
                            condition = <div style={{display: "inline-block"}}>
                                <div className={css.section}>
                                    <Datepicker type={type} add={startAdd} initCallback={d1=> {
                                        this.setConditionState(d.id + "ConditionStart", d1);
                                    }} callback={d1=> {
                                        this.setConditionState(d.id + "ConditionStart", d1);
                                    }}/>
                                </div>
                                <div className={css.section}>
                                    <Datepicker type={type} add={endAdd} initCallback={d1=> {
                                        this.setConditionState(d.id + "ConditionEnd", d1);
                                    }} callback={d1=> {
                                        this.setConditionState(d.id + "ConditionEnd", d1);
                                    }}/>
                                </div>
                            </div>;
                            break;
                        case "select":
                            condition = <div className={css.section}>
                                <Select data={d.data} text={d.name} initCallback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }} callback={d1=> {
                                    this.setConditionState(d.id + "Condition", d1);
                                }}/>
                            </div>;
                            break;
                    }
                    return condition;
                })
            }
            <div className={css.section}>
                <button className={this.state.loading ? (css.loading + " " + css.filter) : css.filter}
                        onClick={this.read} disabled={this.state.loading}>
                    <i className={this.state.loading ? (css.loading + " fa fa-refresh") : "fa fa-refresh"}></i>刷新
                </button>
            </div>
            <div className={css.section}>
                <button className={css.filter} onClick={this.download}>
                    <i className="fa fa-download"></i>导出
                </button>
            </div>
        </div>;
        return dom;
    }

    /**
     * 设置表格客户端筛选的组件dom
     * @returns {*}
     */
    setClientFilterDom() {
        let pageArr = [];
        for (let i = 0; i < Math.ceil(this.state.inputFilterData.length / this.state.rowPerPage); i++) {
            pageArr.push(i + 1);
        }

        //所有的客户端筛选字段
        let clientFilterDom = this.state.columns.filter(d=> {
            return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
        }).map(d=> {
            let stateId = "clientFilter" + d.id;
            let data = [];
            if (this.state.hasOwnProperty(stateId)) {
                //如果有state,直接使用原来的data
                data = this.state[stateId];
            } else {
                //如果没有该state,对控件值进行初始化
                this.state.sourceData.forEach(d1=> {
                    if (!data.includes(d1[d.id])) {
                        data.push(d1[d.id]);
                    }
                });
                data = data.map((d, i)=> {
                    return {id: i, name: d, checked: true};
                });
            }

            return <div className={css.section}>
                <Select data={data} text={d.name} callback={d1=> {
                    let json = {};
                    json["clientFilter" + d.id] = d1;
                    this.setState(json, ()=> {
                        this.setComponentFilterData();
                    });
                }}/>
            </div>;
        });

        let dom = <div className={css.clientFilter}>
            <div className={css.section}>
                <Select data={this.state.columns} text="列过滤" callback={this.columnFilterCallback}
                        optionNumPerColumn={5}/>
            </div>
            {
                clientFilterDom
            }
            <div className={css.section}>
                <input className={css.rowFilter} onChange={e=> {
                    this.setInputFilterData(e.target.value);
                }} placeholder="行过滤"
                       value={this.state.rowFilterValue}/>
            </div>
            <div className={css.section}>
                <select className={css.filter} value={this.state.pageIndex} onChange={e=> {
                    this.setState({pageIndex: e.target.value}, ()=> {
                        let json = this.sort();
                        json.displayData = this.setDisplayData(json.sortedData);
                        this.setState(json);
                    });
                }}>
                    {
                        pageArr.map(d=> {
                            return <option value={d}>{d}</option>
                        })
                    }
                </select>
                <label>共{pageArr.length}页</label>
            </div>
            <div className={css.section}>
                <Radio prefix="每页" value={this.state.rowPerPage} suffix="行" data={[5, 10, 15, 20, 25, 50, 100]}
                       callback={d=> {
                           this.setState({
                               pageIndex: 1,
                               rowPerPage: d
                           }, ()=> {
                               let json = this.sort();
                               json.displayData = this.setDisplayData(this.state.sortedData);
                               this.setState(json);
                           });


                       }}/>
            </div>
        </div>;
        return dom;
    }

    /**
     * 根据客户端过滤后的数据和当前页数计算当前页显示的数据
     * @param sortedData
     * @returns {*}
     */
    setDisplayData(sortedData) {
        let start = (this.state.pageIndex - 1) * this.state.rowPerPage;
        let end = this.state.pageIndex * this.state.rowPerPage;
        end = Math.min(end, sortedData.length);
        let displayData = sortedData.slice(start, end);
        return displayData;
    }

    /**
     * 从服务器读取数据
     */
    async read() {
        try {
            this.setState({
                loading: true
            });
            //附加查询条件的数据
            let requestData = {};
            this.state.serverFilter.forEach(d=> {
                switch (d.type) {
                    case "day":
                    case "month":
                    case "select":
                    case "input":
                    case "integer":
                    case "radio":
                        requestData[d.id] = this.state[d.id + "Condition"];
                        break;
                    case "rangeDay":
                    case "rangeMonth":
                    case "rangeSecond":
                        requestData[d.id] = {
                            start: this.state[d.id + "ConditionStart"],
                            end: this.state[d.id + "ConditionEnd"]
                        };
                        break;
                }
            });
            let message = await this.request("read", requestData);
            let data = message.data;
            let displayData = this.setDisplayData(data);
            let json = {
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
            this.state.columns.filter(d=> {
                return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
            }).forEach(d=> {
                let id = d.id;
                let componentData = [];
                data.forEach(d1=> {
                    if (!componentData.includes(d1[id])) {
                        componentData.push(d1[id]);
                    }
                });
                componentData = componentData.map((d1, i)=> {
                    return {id: i, name: d1, checked: true};
                });
                json["clientFilter" + id] = componentData;
            });

            if (message.hasOwnProperty("columns")) {
                json.columns = message.columns;
            }

            //隐藏没有数据的列,显示有数据的列
            if (this.state.isMinColumn) {
                let columns = json.hasOwnProperty("columns") ? json.columns : this.state.columns;
                columns = columns.map(d=> {
                    //判断该列是否为空
                    let isNotEmpty = data.some(d1=> {
                        return d1.hasOwnProperty(d.id) && d1[d.id] != "" && d1[d.id] != null;
                    });
                    d.checked = isNotEmpty;
                    return d;
                });
                this.setState({
                    columns: columns
                }, ()=> {
                    this.setState(json);
                })
            } else {
                this.setState(json);
            }


        } catch (e) {
            this.setState({
                loading: false
            });
            alert("刷新数据失败:" + e);
        }
    }

    /**
     * 行过滤输入改变时的回调
     */
    setInputFilterData(value) {
        let matchValue = value == undefined ? this.state.rowFilterValue : value;
        let inputFilterData = this.state.componentFilterData.filter(d => {
            let isFind = false;
            for (let k in d) {
                if (d[k] != null && d[k].toString().toLowerCase().includes(matchValue.toLowerCase())) {
                    isFind = true;
                    break;
                }
            }
            return isFind;
        });
        let json = this.sort();
        let json2 = {
            pageIndex: 1,
            inputFilterData: inputFilterData
        };
        if (value != undefined) {
            json2.rowFilterValue = matchValue;
        }
        this.setState(json2, ()=> {
            let json1 = this.sort();
            for (let k in json1) {
                json[k] = json1[k];
            }
            json.displayData = this.setDisplayData(json.sortedData);
            this.setState(json);
        });
    }

    /**
     * 列过滤改变时的回调
     * @param columns
     */
    columnFilterCallback(columns) {
        this.setState({columns: columns});
    }

    /**
     * 设置筛选条件的状态
     * @param id
     * @param value
     */
    setConditionState(id, value, callback) {
        let json = {};
        json[id] = value;
        this.setState(json, ()=> {
            if (callback) {
                callback();
            }
        });
    }

    /**
     * 根据列的值对行排序
     * @param id
     */
    sort(id) {
        let sortDesc = this.state.sortDesc;
        if (id == undefined) {
            id = this.state.sortColumnId;
        } else {
            if (this.state.sortColumnId == id) {
                sortDesc = !sortDesc;
            }
        }

        let sortedData = this.state.inputFilterData.concat();
        let regex = new RegExp(/^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/g);
        if (sortDesc) {
            sortedData.sort((a, b) => {
                let va, vb;
                if (a[id] != null && b[id] != null && a[id].toString().match(regex) != null && b[id].toString().match(regex) != null) {
                    va = a[id];
                    vb = b[id];
                } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                    va = parseFloat(a[id]);
                    vb = parseFloat(b[id]);
                } else {
                    va = (a[id] == null) ? "" : a[id];
                    vb = (b[id] == null) ? "" : b[id];
                }
                return va > vb ? 1 : -1;
            });
        } else {
            sortedData.sort((a, b) => {
                let va, vb;
                if (a[id] != null && b[id] != null && a[id].toString().match(regex) != null && b[id].toString().match(regex) != null) {
                    va = a[id];
                    vb = b[id];
                } else if (!isNaN(parseFloat(a[id])) && !isNaN(parseFloat(b[id]))) {
                    va = parseFloat(a[id]);
                    vb = parseFloat(b[id]);
                } else {
                    va = (a[id] == null) ? "" : a[id];
                    vb = (b[id] == null) ? "" : b[id];
                }
                return va < vb ? 1 : -1;
            });
        }
        return {
            sortColumnId: id,
            sortDesc: sortDesc,
            sortedData: sortedData,
        };
    }

    /**
     * 根据客户端筛选组件的状态设置componentFilterData
     */
    setComponentFilterData() {
        let componentFilterData = this.state.sourceData.concat();
        this.state.columns.filter(d=> {
            return d.hasOwnProperty("clientFilter") && d.clientFilter == true;
        }).forEach(d=> {
            let id = d.id;
            let componentData = this.state["clientFilter" + id];
            componentFilterData = componentFilterData.filter(d1=> {
                //过滤组件没有勾选的行
                let checkedArr = componentData.filter(d2=> {
                    return d2.checked;
                }).map(d2=> {
                    return d2.name;
                });
                let isValid = checkedArr.some(d2=> {
                    return d2 == d1[id];
                });
                return isValid;
            });
        });
        this.setState({
            componentFilterData: componentFilterData
        }, ()=> {
            this.setInputFilterData();
        });
    }

    async download() {
        let header = this.state.columns.map(d=> {
            return d.name;
        });
        let body = this.state.sourceData.map(d=> {
            let rowData = this.state.columns.map(d1=> {
                return d[d1.id];
            });
            return rowData;
        });
        let data = [header].concat(body);
        try {
            let message = await this.request("download", {data: data});
            location.href = "../" + message.filePath;
        } catch (e) {
            alert("导出数据失败:" + e);
        }

    }
}

module.exports = table;