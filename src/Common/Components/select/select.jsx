let http = require("./http");
let React = require("react");

class select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelShow: false,
            data: [],
            allChecked: false
        };
        let bindArr = ["selectBlur", "panelToggle", "setData", "check", "allCheck"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let data = this.setData(this.props.data);
        this.setState({data: data});
    }

    componentWillReceiveProps(nextProps){
        let data = this.setData(nextProps.data);
        this.setState({data: data});
    }

    render() {
        return (
            <div className="react-select" tabIndex="0" onBlur={this.selectBlur}>
                <div className="input" onClick={this.panelToggle}>
                    {this.state.value}<i className="fa fa-caret-down"></i>
                </div>
                <div className="panel" style={(this.state.panelShow) ? {} : {display: "none"}}>
                    <div className="allCheck">
                        <input type="checkbox" onChange={(e)=> {
                            this.allCheck(e);
                        }} checked={this.state.allChecked}/><label>全选</label>
                    </div>
                    <div className="options">
                        {
                            this.state.data.map((d, i)=> {
                                return <div key={i} className="column">
                                    {
                                        d.map((d1, j)=> {
                                            return <div className="option" key={j}>
                                                <input type="checkbox" onChange={(e)=> {
                                                    this.check(e, d1.id);
                                                }} checked={d1.checked}/><label>{d1.name}</label>
                                            </div>;
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

    selectBlur(e) {
        if (e.target.className == "react-select") {
            let child = e.relatedTarget;
            if (child != null) {
                let child1 = child.parentNode.parentNode.parentNode.parentNode.parentNode;
                let child2 = child.parentNode.parentNode.parentNode;
                if (child1 != e.target && child2 != e.target) {
                    this.setState({
                        panelShow: false
                    });
                }
            } else {
                this.setState({
                    panelShow: false
                });
            }

        }
    }

    panelToggle() {
        this.setState({
            panelShow: !this.state.panelShow
        });
    }

    setData(d) {
        let columnDataArr = [];
        for (let i = 0; i < d.length; i = i + 10) {
            let end = (i + 10) > d.length ? d.length : i + 10;
            let columnData = d.slice(i, end);
            columnDataArr.push(columnData);
        }
        return columnDataArr;
    }

    check(e, id) {
        e.target.parentNode.parentNode.parentNode.parentNode.parentNode.focus();
        let data = this.state.data.map(d=> {
            d = d.map(d1=> {
                if (d1.id == id) {
                    d1.checked = !d1.checked;
                }
                return d1;
            });
            return d;
        });
        this.setState({
            data: data
        });
        if (this.props.callback) {
            let sourceData = [];
            this.state.data.forEach(d=> {
                d.forEach(d1=> {
                    sourceData.push(d1);
                });
            });
            this.props.callback(sourceData);
        }
    }

    allCheck(e) {
        e.target.parentNode.parentNode.parentNode.focus();
        let isAllChecked = !this.state.allChecked;
        let data = this.state.data.map(d=> {
            d.map(d1=> {
                d1.checked = isAllChecked;
            });
            return d;
        });
        this.setState({
            allChecked: isAllChecked,
            data: data
        });
        if (this.props.callback) {
            let sourceData = [];
            this.state.data.forEach(d=> {
                d.forEach(d1=> {
                    sourceData.push(d1);
                });
            });
            this.props.callback(sourceData);
        }
    }
}

module.exports = select;