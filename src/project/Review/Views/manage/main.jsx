let React = require("react");
let ReactDom = require("react-dom");
require("karl-extend");
let Radio = require("karl-component-radio");
let http = require("karl-http");

let Table = require("../../util/table");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "game"
        };
        let bindArr = [];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let hash = window.location.hash.replace(/#/g, "");
        switch (hash) {
            case "game":
            case "cp":
            case "contact":
                this.setState({display: hash});
                break;
        }
    }

    render() {
        return (
            <div className="container">
                <div className="nav">
                    <div className={this.state.display == "game" ? "active" : ""} onClick={()=> {
                        this.nav("game")
                    }}>源数据-游戏
                    </div>
                    <div className={this.state.display == "cp" ? "active" : ""} onClick={()=> {
                        this.nav("cp")
                    }}>源数据-CP
                    </div>
                    <div className={this.state.display == "contact" ? "active" : ""} onClick={()=> {
                        this.nav("contact")
                    }}>源数据-沟通
                    </div>
                </div>
                <div className="info">
                    <div style={this.state.display == "game" ? {} : {display: "none"}} className="game-panel">
                        <Table tableId="game" curd="curd" attachment/>
                    </div>
                    <div style={this.state.display == "cp" ? {} : {display: "none"}} className="cp-panel">
                        <Table tableId="cp" curd="curd"/>
                    </div>
                    <div style={this.state.display == "contact" ? {} : {display: "none"}} className="contact-panel">
                        <Table tableId="contact" curd="curd" createButtonCallback={checkedData=> {
                            let firstCheckedName = checkedData[0].name;
                            let callbackPromise = new Promise(function (resolve, reject) {
                                http.post("../table/contactByName/read", {name: firstCheckedName}).then(d=> {
                                    let data = {
                                        defaultData: [{name: firstCheckedName}],
                                        displayData: d
                                    };
                                    resolve(data);
                                }).catch(d=> {
                                    reject(d);
                                });
                            });
                            return callbackPromise;
                        }}/>
                    </div>
                </div>
            </div>
        );
    }

    nav(name) {
        window.location.hash = "#" + name;
        this.setState({"display": name});
    }

}

ReactDom.render(<App/>, document.getElementById("manage"));