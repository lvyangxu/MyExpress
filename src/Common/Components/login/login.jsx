let http = require("./http");
let cookie = require("./cookie");
let React = require("react");

class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            tips: "",
            loginRedirect: ""
        };
        let bindArr = ["getCookieName", "submit", "usernameChange", "passwordChange"];
        bindArr.forEach(d=> {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        this.getCookieName();
    }

    render() {
        return (
            <div className="react-login">
                <div className="row">
                    <input value={this.state.username} onChange={this.usernameChange} placeholder="username"
                           type="text"/>
                </div>
                <div className="row">
                    <input value={this.state.password} onChange={this.passwordChange} placeholder="password"
                           type="password"/>
                </div>
                <div className="row">
                    <button onClick={this.submit}>sign in</button>
                </div>
                <div className="row">
                    <div className="tips">{this.state.tips}</div>
                </div>
            </div>
        );
    }

    getCookieName() {
        //get cookie name from server
        http.post("../account/getCookieName").then(d=> {
            let usernameCookie = cookie.get(d.username);
            let passwordCookie = cookie.get(d.password);
            usernameCookie = (usernameCookie == undefined) ? "" : usernameCookie;
            passwordCookie = (passwordCookie == undefined) ? "" : passwordCookie;
            this.setState({
                username: usernameCookie,
                password: passwordCookie,
                loginRedirect: d.loginRedirect
            });
        }).catch(d=> {
            this.setState({"tips": "an error occured when set cookie:" + d});
        });
    }

    usernameChange(e) {
        let d = e.target.value;
        d = d.trim();
        this.setState({"username": d});
    }

    passwordChange(e) {
        let d = e.target.value;
        d = d.trim();
        this.setState({"password": d});
    }

    submit() {
        let data = {
            username: this.state.username,
            password: this.state.password
        };
        http.post("../account/login", data).then(d=> {
            window.location.href = "../"+this.state.loginRedirect+"/";
        }).catch(d=> {
            this.setState({"tips": d});
        });

    }
}

module.exports = login;