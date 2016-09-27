let http = require("./http");
let React = require("react");
let Select = require("./select");

class table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            sourceData: [],
            filterData: [],
            displayData: [],
            rowFilterValue: "",
            rowAllCheck: false
        };
        let bindArr = ["columnFilterCallback", "rowFilterChange", "tdCallback"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let tableId = this.props.tableId;
        if (tableId) {
            let promiseInit = http.post("../table/" + tableId + "/init");
            let promiseRead = http.post("../table/" + tableId + "/read");
            Promise.all([promiseInit, promiseRead]).then(d=> {
                this.setState({
                    columns: d[0],
                    sourceData: d[1],
                    filterData: d[1],
                    displayData: d[1]
                });
            }).catch(d=> {
                console.log("init table failed:" + d);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.rowFilterValue != nextProps.rowFilterValue) {
            this.rowFilterChange({target: {value: nextProps.rowFilterValue}});
            this.setState({
                rowFilterValue: nextProps.rowFilterValue
            });
        }
    }

    render() {
        return (
            <div className="react-table">
                <div className="table-head">
                    <div className="column-filter">
                        <Select data={this.state.columns} text="列过滤" callback={this.columnFilterCallback}
                                optionNumPerColumn={5}/>
                    </div>
                    <div className="row-filter">
                        <input onChange={this.rowFilterChange} placeholder="行过滤"
                               value={this.state.rowFilterValue}/>
                    </div>
                    <div className="radio-filter">
                        {
                            this.state.columns.filter(d=> {
                                return d.radio;
                            }).map(d=> {
                                let radioValues = [];
                                this.state.sourceData.forEach(d1=> {
                                    if (!radioValues.includes(d1[d.id])) {
                                        radioValues.push(d1[d.id]);
                                    }
                                });
                                let select = <select key={d.id} onChange={(e)=> {
                                    this.radioFilterChange(e, d);
                                }}>
                                    <option>{d.name}</option>
                                    {radioValues.map(d1=> {
                                        return <option key={d1}>{d1}</option>;
                                    })}</select>;
                                return select;
                            })
                        }
                    </div>
                    <div className="refresh">
                        <button onClick={()=> {
                            this.refresh();
                        }}><i className="fa fa-refresh"></i>刷新数据
                        </button>
                    </div>
                </div>
                <div className="table-body">
                    <table>
                        <thead>
                        <tr>
                            {
                                this.state.columns.map(d=> {
                                    return <th key={d.id} data-columnId={d.id}
                                               className={d.checked ? "" : "hide"}>{d.name}</th>
                                })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.displayData.map((d, i)=> {
                                return <tr key={i}>{
                                    this.state.columns.map(d1=> {
                                        let tdHtml = d[d1.id];
                                        if (tdHtml) {
                                            tdHtml = tdHtml.toString().replace(/\n/g, "<br/>");
                                        }
                                        if (this.props[d1.id + "TdCallback"] != undefined) {
                                            return <td data={d[d1.id]} key={d1.id}
                                                       data-columnId={d1.id}
                                                       className={d1.checked ? "" : "hide"}
                                                       onClick={()=> {
                                                           this.tdCallback(d1.id, d[d1.id])
                                                       }}
                                                       dangerouslySetInnerHTML={{__html: tdHtml}}></td>
                                        } else {
                                            return <td data={d[d1.id]} key={d1.id}
                                                       data-columnId={d1.id}
                                                       className={d1.checked ? "" : "hide"}
                                                       dangerouslySetInnerHTML={{__html: tdHtml}}></td>
                                        }
                                    })
                                }</tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    columnFilterCallback(columns) {
        this.setState({columns: columns});
    }

    rowFilterChange(e) {
        let matchValue = e.target.value;
        let filterData = this.state.sourceData.filter(d=> {
            let isFind = false;
            for (let k in d) {
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

    refresh() {
        let tableId = this.props.tableId;
        http.post("../table/" + tableId + "/read").then(d=> {
            d = d.map(d1=> {
                d1.checkboxChecked = false;
                return d1;
            });
            this.setState({
                sourceData: d,
                filterData: d,
                displayData: d,
                rowFilterValue: "",
                rowAllCheck: false
            });
        }).catch(d=> {
            alert("刷新数据失败:" + d);
        });
    }

    radioFilterChange(e, d) {
        let filterData = (e.target.value == d.name) ? this.state.sourceData : this.state.sourceData.filter(d1=> {
            d1 = d1[d.id];
            d1 = (d1 == null) ? "" : d1.toString();
            return d1 == e.target.value;
        });
        this.setState({
            filterData: filterData,
            displayData: filterData
        });
    }

    tdCallback(id, value) {
        this.props[id + "TdCallback"](value);
    }
}

module.exports = table;