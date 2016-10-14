let http = require("./http");
let React = require("react");

class radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelShow: false,
            sourceData: [],
            value: "",
            filterData: [],
            pageData: [],
            filterValue: "",
            pageIndex: 0
        };
        let bindArr = ["radioBlur", "panelToggle", "filterChange", "select", "setOptionHtml", "slicePageData"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        if (this.props.url != undefined) {
            http.post(this.props.url).then(d=> {
                let pageData = this.slicePageData(d, 0);
                this.setState({
                    value: this.props.defaultBlank ? "" : d[0],
                    sourceData: d,
                    filterData: d,
                    pageData: pageData
                });
            }).catch(d=> {
                console.log("init radio failed:" + d);
            });

        } else {
            let data = this.props.data;
            let pageData = this.slicePageData(data, 0);
            this.setState({
                value: this.props.defaultBlank ? "" : data[0],
                sourceData: data,
                filterData: data,
                pageData: pageData
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    render() {
        return (
            <div className="react-radio react-radio-child" tabIndex="0" onBlur={this.radioBlur}>
                <div className="input" onClick={this.panelToggle}>
                    {this.state.value}<i className="fa fa-caret-down"></i>
                </div>
                <div className="react-radio-child panel" style={(this.state.panelShow) ? {} : {display: "none"}}>
                    <div className="filter">
                        <i className="fa fa-search"></i>
                        <input className="react-radio-child" onChange={this.filterChange}
                               value={this.state.filterValue}
                               placeholder="filter"/>
                    </div>
                    <div className="options">
                        {
                            this.state.pageData.map((d, i)=> {
                                return <div key={i} className="option" onClick={()=> {
                                    this.select(d)
                                }} dangerouslySetInnerHTML={this.setOptionHtml(d)}></div>
                            })
                        }
                        <div className="page">
                            <button className="react-radio-child page-left" onClick={()=> {
                                this.pageLeft();
                            }}>
                                <i className="fa fa-angle-left"></i>
                            </button>
                            {(this.state.pageIndex + 1) + "/" + ((Math.ceil(this.state.filterData.length / 10) == 0)
                                ? 1 : Math.ceil(this.state.filterData.length / 10))}
                            <button className="react-radio-child page-right" onClick={()=> {
                                this.pageRight();
                            }}>
                                <i className="fa fa-angle-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    radioBlur(e) {
        console.log(e.relatedTarget.className);
        if (e.relatedTarget == null || !e.relatedTarget.className.includes("react-radio-child")) {
            this.setState({
                panelShow: false
            });
        }
    }

    panelToggle() {
        this.setState({
            panelShow: !this.state.panelShow
        });
    }

    filterChange(e) {
        let filterData = this.state.sourceData.filter(d=> {
            return d.toString().includes(e.target.value);
        });
        let pageData = this.slicePageData(filterData, 0);
        this.setState({
            filterValue: e.target.value,
            pageIndex: 0,
            filterData: filterData,
            pageData: pageData
        });
    }

    select(d) {
        this.setState({
            panelShow: false,
            value: d
        });

        if (this.props.selectCallback) {
            this.props.selectCallback(d);
        }
    }

    setOptionHtml(d) {
        d = d.toString();
        let v = this.state.filterValue;
        let regex = new RegExp(v, "g");
        if (v == "") {
            return {__html: d};
        } else {
            let result = d.toString().replace(regex, ()=> {
                return "<strong>" + v + "</strong>";
            });
            return {__html: result};
        }
    }

    slicePageData(data, i) {
        let filterData = data;
        let start = i * 10;
        let end = i * 10 + 10;
        end = end > filterData.length ? filterData.length : end;
        let columnData = filterData.slice(start, end);
        return columnData;
    }

    pageLeft() {
        let i = this.state.pageIndex;
        if (i != 0) {
            i--;
        }
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

    pageRight() {
        let i = this.state.pageIndex;
        let end = Math.ceil(this.state.filterData.length / 10);
        if (i < end - 1) {
            i++;
        }
        this.setState({
            pageIndex: i,
            pageData: this.slicePageData(this.state.filterData, i)
        });
    }

}

module.exports = radio;