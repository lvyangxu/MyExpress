//
// // class table extends React.Component {
// //     constructor(props) {
// //         super(props);
// //         this.state = {
// //             curd: (this.props.curd == undefined) ? "r" : this.props.curd,
// //             panel: "main",
// //             columns: [],
// //             sourceData: [],
// //             filterData: [],
// //             displayData: [],
// //             rowFilterValue: "",
// //             rowAllChecked: false,
// //             sortDesc: true,
// //             sortColumnId: "",
// //             createLineNum: 5,
// //             ct: [],
// //             ut: [],
// //             attachmentList: [],
// //             attachmentProgress: "0%",
// //             loading: false,
// //             selectFilter: [],
// //             createReferTableData: []
// //         };
// //         let bindArr = ["columnFilterCallback", "rowFilterChange", "refresh", "radioFilterChange", "tdCallback", "sort", "rowAllCheck",
// //             "rowCheck", "backToMain", "create", "createSubmit", "createTdChange", "update", "updateSubmit", "updateTdChange", "delete"];
// //         bindArr.forEach(d => {
// //             this[d] = this[d].bind(this);
// //         });
// //     }
// //
// //     async componentDidMount() {
// //         let tableId = this.props.tableId;
// //         if (tableId) {
// //             try {
// //                 let initData = await http.post("../table/" + tableId + "/init");
// //                 let readData = await http.post("../table/" + tableId + "/read");
// //                 readData = readData.map(d => {
// //                     d.checkboxChecked = false;
// //                     return d;
// //                 });
// //
// //                 //初始化创建ct的值
// //                 let ct = [];
// //                 for (let i = 0; i < this.state.createLineNum; i++) {
// //                     let ctRow = {};
// //                     initData.forEach(d => {
// //                         ctRow[d.id] = "";
// //                     });
// //                     ct.push(ctRow);
// //                 }
// //
// //                 let selectFilter = initData.filter(d => {
// //                     return d.select;
// //                 }).map(d => {
// //                     let values = [];
// //                     let data = [];
// //                     readData.forEach((d1, j) => {
// //                         if (!values.includes(d1[d.id])) {
// //                             values.push(d1[d.id]);
// //                             data.push({id: j, name: d1[d.id], checked: true});
// //                         }
// //                     });
// //                     return {id: d.id, name: d.name, data: data};
// //                 });
// //
// //                 this.setState({
// //                     columns: initData,
// //                     sourceData: readData,
// //                     filterData: readData,
// //                     displayData: readData,
// //                     ct: ct,
// //                     selectFilter: selectFilter
// //                 });
// //
// //             } catch (e) {
// //                 console.log("init table failed:" + tableId);
// //             }
// //         }
// //
// //
// //     }
// //
// //     componentWillReceiveProps(nextProps) {
// //         if (this.props.rowFilterValue != nextProps.rowFilterValue) {
// //             this.rowFilterChange({target: {value: nextProps.rowFilterValue}});
// //             this.setState({
// //                 rowFilterValue: nextProps.rowFilterValue
// //             });
// //         }
// //     }
// //
// //     render() {
// //         return (
// //             <div className="react-table">
// //                 {
// //                     this.setTop()
// //                 }
// //                 <div style={this.state.panel == "main" ? {} : {display: "none"}}>
// /

// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>
// //                 <div className="panel-create"
// //                      style={this.state.panel == "create" ? {} : {display: "none"}}>
// //                     <div className="panel-head">
// //                         <button className="backToMain" onClick={() => {
// //                             this.backToMain();
// //                         }}><i className="fa fa-arrow-left"></i>返回表格主界面
// //                         </button>
// //                         <button className="submit" onClick={() => {
// //                             this.createSubmit();
// //                         }}><i className="fa fa-plus"></i>提交
// //                         </button>
// //                     </div>

// //                         {
// //                             this.state.ct.map((d, i) => {
// //                                 return <tr key={i}>
// //                                     {
// //                                         this.state.columns.filter(d1 => {
// //                                             let filter = (d1.id == "id");
// //                                             return !filter;
// //                                         }).map(d1 => {
// //                                             let td;
// //                                             switch (d1.type) {
// //                                                 case "textarea":
// //                                                     td = <textarea disabled={d1.createReadonly} value={d[d1.id]}
// //                                                                    onChange={(e) => {
// //                                                                        this.createTdChange(e, i, d1.id);
// //                                                                    }}/>;
// //                                                     break;
// //                                                 case "radio":
// //                                                     td = <select disabled={d1.createReadonly}
// //                                                                  value={d[d1.id]}
// //                                                                  onChange={(e) => {
// //                                                                      this.createTdChange(e, i, d1.id);
// //                                                                  }}>
// //                                                         <option></option>
// //                                                         {d1.radioArr.map((d2, j) => {
// //                                                             return <option key={j}>{d2}</option>;
// //                                                         })}</select>;
// //                                                     break;
// //                                                 default:
// //                                                     td = <input disabled={d1.createReadonly} value={d[d1.id]}
// //                                                                 onChange={(e) => {
// //                                                                     this.createTdChange(e, i, d1.id);
// //                                                                 }}/>;
// //                                                     break;
// //                                             }
// //                                             td = <td key={d1.id}>{td}</td>;
// //                                             return td;
// //                                         })
// //                                     }</tr>;
// //                             })
// //                         }
// //                         </tbody>
// //                     </table>
// //                 </div>
// //                 <div className="panel-attachment" style={this.state.panel == "attachment" ? {} : {display: "none"}}>
// //                     <div className="panel-head">
// //                         <button className="backToMain" onClick={() => {
// //                             this.backToMain();
// //                         }}><i className="fa fa-arrow-left"></i>返回表格主界面
// //                         </button>
// //                     </div>
// //                     <div className="upload">
// //                         <input type="file" multiple="multiple"/>
// //                         <div className="progress">{this.state.attachmentProgress}</div>
// //                         <button onClick={(e) => {
// //                             this.uploadAttachment(e);
// //                         }}>上传附件

// //                     </table>
// //                 </div>
// //                 {
// //                     this.setBottom()
// //                 }
// //             </div>
// //         );
// //     }
// //
// //     /**
// //      * 设置table顶部的dom
// //      * @returns {XML}
// //      */
// //     setTop() {
// //         let dom = <div className="table-head">
// //             <div className="delete"
// //                  style={this.state.curd.includes("d") ? {marginLeft: "20px"} : {display: "none"}}>
// //                 <button onClick={() => {
// //                     this.delete();
// //                 }}><i className="fa fa-times"></i>删除
// //                 </button>
// //             </div>
// //             <div className="attachment"
// //                  style={this.props.attachment ? {marginLeft: "20px"} : {display: "none"}}>
// //                 <button onClick={() => {
// //                     this.attachment();
// //                 }}><i className="fa fa-paperclip"></i>附件
// //                 </button>
// //             </div>
// //             <div className="select-filter" style={this.state.columns.filter(d => {
// //                 return d.select;
// //             }).length > 0 ? {marginTop: "20px"} : {}}>
// //                 {
// //                     this.state.selectFilter.map((d, i) => {
// //                         let select = <Select key={i} data={d.data} text={d.name}
// //                                              callback={(d1 => {
// //                                                  this.rowFilterCallback(d.id, d1);
// //                                              })}
// //                                              optionNumPerColumn={5}/>;
// //                         return select;
// //                     })
// //                 }
// //             </div>
// //         </div>;
// //         return dom;
// //     }
// //
// //

// //

// //
// //     rowFilterCallback(id, data) {
// //         let checkedValues = data.filter(d => {
// //             return d.checked;
// //         }).map(d => {
// //             return d.name;
// //         });
// //         let filterData = this.state.sourceData.filter(d => {
// //             let isFind = false;
// //             checkedValues.forEach(d1 => {
// //                 if (d[id] != null && d[id].toString().toLowerCase() == d1.toString().toLowerCase()) {
// //                     isFind = true;
// //                 }
// //             });
// //             return isFind;
// //         });
// //         this.state.selectFilter.filter(d => {
// //             return d.id != id;
// //         }).map(d => {
// //             let checkedValues = d.data.filter(d1 => {
// //                 return d1.checked;
// //             });
// //
// //             filterData = filterData.filter(d1 => {
// //                 let isFind = false;
// //                 checkedValues.forEach(d2 => {
// //                     let tdValue = d1[d.id];
// //                     let matchValue = d2.name.toString().toLowerCase();
// //                     if (tdValue != null && tdValue.toString().toLowerCase() == matchValue) {
// //                         isFind = true;
// //                     }
// //                 });
// //                 return isFind;
// //             })
// //         });
// //
// //         this.setState({
// //             filterData: filterData,
// //             displayData: filterData
// //         });
// //     }
// //
// //
// //     radioFilterChange(e, d) {
// //         let filterData = (e.target.value == d.name) ? this.state.sourceData : this.state.sourceData.filter(d1 => {
// //                 d1 = d1[d.id];
// //                 d1 = (d1 == null) ? "" : d1.toString();
// //                 return d1 == e.target.value;
// //             });
// //         this.setState({
// //             filterData: filterData,
// //             displayData: filterData
// //         });
// //     }
// //
// //     tdCallback(id, value) {
// //         this.props[id + "TdCallback"](value);
// //     }
// //

// /
// //
// //
//
// //
// //
// //     refreshAttachment(id) {
// //         let tableId = this.props.tableId;
// //         http.post("../table/" + tableId + "/attachmentRead", {id: id}).then(d => {
// //             this.setState({
// //                 panel: "attachment",
// //                 attachmentList: d
// //             });
// //         }).catch(d => {
// //             alert("获取附件列表失败:" + d);
// //         });
// //     }
// //
// //     deleteAttachment(d) {
// //         let id = this.state.attachmentId;
// //         let tableId = this.props.tableId;
// //         let data = {
// //             id: id,
// //             name: d
// //         };
// //         http.post("../table/" + tableId + "/attachmentDelete", data).then(d1 => {
// //             this.refreshAttachment(id);
// //             alert("删除成功");
// //         }).catch(d1 => {
// //             alert("删除失败:" + d1);
// //         })
// //     }
// //
// //     uploadAttachment(e) {
// //         let id = this.state.attachmentId;
// //         let tableId = this.props.tableId;
// //         upload.do("../table/" + tableId + "/attachmentUpload?id=" + id, e.target.parentNode.childNodes[0], d => {
// //             this.setState({
// //                 attachmentProgress: d + "%"
// //             });
// //         }).then(d => {
// //             this.refreshAttachment(id);
// //             alert("上传成功");
// //         }).catch(d => {
// //             alert("上传失败:" + d);
// //         });
// //     }
// // }
//
//
// module.exports = table;

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

        //数据顺序为 sourceData > filterData > sortedData > displayData
        this.state = {
            tableId: this.props.tableId,
            project: this.props.project,
            columns: [],
            sectionStyle: this.props.sectionStyle ? this.props.sectionStyle : {},
            serverFilter: [],
            rowPerPage: this.props.rowPerPage ? this.props.rowPerPage : 10,
            pageIndex: 1,
            sourceData: [],
            sortedData: [],
            filterData: [],
            displayData: [],
            sortDesc: true,
            sortColumnId: "",
        };

        let bindArr = ["setTable", "rowFilterCallback", "columnFilterCallback", "read", "setConditionState", "setChart"];
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
                return d.hasOwnProperty("queryCondition");
            });
            if (data.hasOwnProperty("extraFilter")) {
                serverFilter = serverFilter.concat(data.extraFilter);
            }
            initData.serverFilter = serverFilter;

            //初始化图表
            if (data.hasOwnProperty("chart")) {
                initData.chart = data.chart;
            }
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
                            d.group ?
                                <Chart tipsSuffix={d.tipsSuffix} type={d.type} title={d.title} x={d.x} y={d.y}
                                       yAxisText={d.yAxisText} data={data} group={d.group}/> :
                                <Chart tipsSuffix={d.tipsSuffix} type={d.type} title={d.title} x={d.x} y={d.y}
                                       yAxisText={d.yAxisText} data={data}/>
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
                        startAdd = -360;
                    }
                    if (d.hasOwnProperty("dateAdd")) {
                        let dateAdd = d.dateAdd;
                        add = dateAdd.hasOwnProperty("add") ? dateAdd.add : add;
                        startAdd = dateAdd.hasOwnProperty("startAdd") ? dateAdd.startAdd : startAdd;
                        endAdd = dateAdd.hasOwnProperty("endAdd") ? dateAdd.endAdd : endAdd;
                    }
                    switch (d.type) {
                        case "input":
                            condition = <div className={css.section}>
                                <input className={css.filter} placeholder={d.name} type="text"
                                       value={this.state[d.id + "Condition"]}
                                       onChange={e=> {
                                           this.setConditionState(d.id + "Condition", e.target.value);
                                       }}/>
                            </div>;
                            break;
                        case "integer":
                            condition = <div className={css.section}>
                                <input className={css.filter} placeholder={d.name} min="0" type="number"
                                       value={this.state[d.id + "Condition"]}
                                       onChange={e=> {
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
        </div>;
        return dom;
    }

    /**
     * 设置表格客户端筛选的组件dom
     * @returns {*}
     */
    setClientFilterDom() {
        let pageArr = [];
        for (let i = 0; i < Math.ceil(this.state.filterData.length / this.state.rowPerPage); i++) {
            pageArr.push(i + 1);
        }
        let dom = <div className={css.clientFilter}>
            <div className={css.section}>
                <Select data={this.state.columns} text="列过滤" callback={this.columnFilterCallback}
                        optionNumPerColumn={5}/>
            </div>
            <div className={css.section}>
                <input className={css.rowFilter} onChange={this.rowFilterCallback} placeholder="行过滤"
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
                filterData: data,
                displayData: displayData,
                sortColumnId: "",
                rowFilterValue: ""
            };
            if (message.hasOwnProperty("columns")) {
                json.columns = message.columns;
            }
            this.setState(json);

        } catch (e) {
            this.setState({
                loading: false
            });
            alert("刷新数据失败:" + e);
        }
    }

    /**
     * 行过滤输入改变时的回调
     * @param e
     */
    rowFilterCallback(e) {
        let matchValue = e.target.value;
        let filterData = this.state.sourceData.filter(d => {
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
        this.setState({
            pageIndex: 1,
            filterData: filterData,
            rowFilterValue: matchValue
        }, ()=> {
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

        let sortedData = this.state.filterData.concat();
        let regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/g);
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
}

module.exports = table;