let React = require("react");

class nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNav: "",
            data: []
        };
        let bindArr = [];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        let hash = window.location.hash.replace(/#/g, "");
        let data = this.props.data;
        let activeNav = "";
        if (hash != "") {
            activeNav = hash;
        } else {
            if (data.length != 0) {
                activeNav = data[0];
            }
        }
        this.setState({
            data: data,
            activeNav: activeNav
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {

        }
    }

    render() {
        return (
            <div className="react-nav">
                {
                    this.state.data.map((d, i)=> {
                        return <div key={i} onClick={()=> {
                            this.switchNav(d);
                        }}>
                            {d}
                        </div>
                    })
                }
            </div>
        );
    }

    switchNav(d){

    }

}

module.exports = nav;