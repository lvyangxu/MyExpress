let http = require("./http");
let React = require("react");

class radio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelShow: false,
            sourceData: [],
            value: "",
            filterOptionData: [],
            filterValue: ""
        };
        let bindArr = ["radioBlur", "panelToggle", "filterChange", "filterBlur", "select", "setOptionHtml", "setFilterOptionData"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        if (this.props.url != undefined) {
            http.post(this.props.url).then(d=> {
                let filterOptionData = this.setFilterOptionData(d);
                this.setState({
                    value: this.props.defaultBlank ? "" : d[0],
                    sourceData: d,
                    filterOptionData: filterOptionData
                });
            }).catch(d=> {
                console.log("init radio failed:" + d);
            });

        } else {
            let data = this.props.data;
            let filterOptionData = this.setFilterOptionData(data);
            this.setState({
                value: this.props.defaultBlank ? "" : data[0],
                sourceData: data,
                filterOptionData: filterOptionData,
            });
        }
    }

    render() {
        return (
            <div className="react-radio" tabIndex="0" onBlur={this.radioBlur}>
                <div className="input" onClick={this.panelToggle}>
                    {this.state.value}<i className="fa fa-caret-down"></i>
                </div>
                <div className="panel" style={(this.state.panelShow) ? {} : {display: "none"}}>
                    <div className="filter">
                        <i className="fa fa-search"></i>
                        <input onChange={this.filterChange} onBlur={this.filterBlur} value={this.state.filterValue}
                               placeholder="filter"/>
                    </div>
                    <div className="options">
                        {
                            this.state.filterOptionData.map((d, i)=> {
                                return <div key={i} className="column">
                                    {
                                        d.map((d1, j)=> {
                                            return <div className="option" onClick={()=> {
                                                this.select(d1)
                                            }} key={j} dangerouslySetInnerHTML={this.setOptionHtml(d1)}></div>;
                                        })
                                    }
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    radioBlur(e) {
        let panel = e.target.getElementsByClassName("panel")[0];
        if (panel == undefined) {
            this.setState({
                panelShow: false
            });
            return;
        }
        let selfInput = panel.getElementsByClassName("filter")[0].getElementsByTagName("input")[0];
        if (e.relatedTarget != selfInput) {
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
        let filterOptionData = this.state.sourceData.filter(d=> {
            return d.toString().includes(e.target.value);
        });
        filterOptionData = this.setFilterOptionData(filterOptionData);
        this.setState({
            filterValue: e.target.value,
            filterOptionData: filterOptionData
        });
    }

    filterBlur(e) {
        e.preventDefault();
        e.stopPropagation();
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

    setFilterOptionData(d) {
        let columnDataArr = [];
        for (let i = 0; i < d.length; i = i + 10) {
            let end = (i + 10) > d.length ? d.length : i + 10;
            let columnData = d.slice(i, end);
            columnDataArr.push(columnData);
        }
        return columnDataArr;
    }


}

module.exports = radio;