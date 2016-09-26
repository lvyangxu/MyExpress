let http = require("./http");
let React = require("react");
let Select = require("./select");

class table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: []
        };
        let bindArr = [];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let tableId = this.props.tableId;
        if (tableId) {
            http.post("../table/" + tableId + "/init").then(d=> {
                this.setState({
                    columns: d
                });
            }).catch(d=> {
                console.log("init table failed:" + d);
            });
        }
    }

    render() {
        return (
            <div className="react-table">
                <div className="table-head">
                    <div className="column-filter">
                        <Select data={this.state.columns} text="列"/>
                    </div>
                </div>
            </div>
        );
    }


}

module.exports = table;