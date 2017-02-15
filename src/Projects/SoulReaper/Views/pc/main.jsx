import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Scroll from "karl-component-scroll";
import $ from "jquery";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchor: "home",
        };
        let bindArr = ["doNav"];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        $(document).ready(()=> {
            $(this.middle).css({height: $(window).height() - 130 + "px"});
        });
        $(window).resize(()=> {
            $(this.middle).css({height: $(window).height() - 130 + "px"});
        });

    }

    render() {
        let style = {color: "rgba(72,166,246,1)"};
        return <Scroll>
            <div className="page1">
                <img className="logo" src="image/logo.png"/>
                <div className="top">
                    <img src="image/facebook.png"/>
                    <img src="image/twitter.png"/>
                </div>
                <div className="middle" ref={d=> {
                    this.middle = d;
                }}>
                    <img src="image/top.png"/>
                </div>
                <div className="bottom">
                    <div className="left">
                        <div className="nav" style={this.state.anchor == "home" ? style : {}} onClick={()=> {
                            this.doNav("home");
                        }}>
                            HOME
                        </div>
                        <div className="nav" style={this.state.anchor == "story" ? style : {}} onClick={()=> {
                            this.doNav("story");
                        }}>
                            STORY
                        </div>
                        <div className="nav" style={this.state.anchor == "news" ? style : {}} onClick={()=> {
                            this.doNav("news");
                        }}>
                            NEWS
                        </div>
                        <div className="nav" style={this.state.anchor == "characters" ? style : {}} onClick={()=> {
                            this.doNav("characters");
                        }}>
                            CHARACTERS
                        </div>
                        <div className="nav" style={this.state.anchor == "gallery" ? style : {}} onClick={()=> {
                            this.doNav("gallery");
                        }}>
                            GALLERY
                        </div>
                    </div>
                    <div className="right">
                        <div className="fire"><img src="image/fire.gif"/></div>
                        <div className="google"><img src="image/google.png"/></div>
                        <div className="apple"><img src="image/apple.png"/></div>
                    </div>
                </div>
            </div>
            <div className="page2"></div>
        </Scroll>;
    }

    doNav(anchor) {
        this.setState({
            anchor: anchor
        });
    }
}

ReactDom.render(
    <App/>
    , document.getElementById("content"));
