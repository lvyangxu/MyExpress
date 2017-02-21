import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import $ from "jquery";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchor: "home",
            backWidth: 0,
            backHeight: 0,
            isDownloadExpand: false
        };
        let bindArr = [];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {

        $(document).ready(()=> {
            this.setState({
                backWidth: $(this.home).width() + 10,
                backLeft: $(this.home).offset().left
            })
        });
    }

    componentWillMount() {

    }

    render() {
        return <div>
            <div className="top">
                <img className="logo" src="image/logo.png"/>
                <img className="share" src="image/share.png"/>
            </div>
            <div className="home" style={this.state.anchor == "home" ? {} : {display: "none"}}>

            </div>
            <div className="story" style={this.state.anchor == "story" ? {} : {display: "none"}}>

            </div>
            <div className="characters" style={this.state.anchor == "characters" ? {} : {display: "none"}}>

            </div>
            <div className="gallery" style={this.state.anchor == "gallery" ? {} : {display: "none"}}>

            </div>
            <div className="news" style={this.state.anchor == "news" ? {} : {display: "none"}}>

            </div>

            <img className="fire" src="image/fire.gif" onClick={()=> {
                if (this.state.isDownloadExpand) {
                    $(this.download).animate({width: "80px", marginLeft: "100%"}, 300, "linear", ()=> {
                        this.setState({isDownloadExpand: false});
                    });
                    $(this.google).animate({width: "0px"}, 300, "linear");
                    $(this.apple).animate({width: "0px"}, 300, "linear");
                } else {
                    this.setState({isDownloadExpand: true}, ()=> {
                        $(this.download).css({width: "80px", marginLeft: "100%"});
                        $(this.google).css({width: "0px"});
                        $(this.apple).css({width: "0px"});
                        $(this.download).animate({width: "100%", marginLeft: "0%"}, 300, "linear");
                        $(this.google).animate({width: "100px"}, 300, "linear");
                        $(this.apple).animate({width: "100px"}, 300, "linear");
                    });
                }
            }}/>


            <div className="download" style={this.state.isDownloadExpand ? {} : {display: "none"}} ref={d=> {
                this.download = d;
            }}>
                <div className="content">
                    <div className="google"><img src="image/google.png" ref={d=> {
                        this.google = d;
                    }}/></div>
                    <div className="apple"><img src="image/apple.png" ref={d=> {
                        this.apple = d;
                    }}/></div>
                </div>
            </div>
            <div className="bottom">
                <div className="background" style={{
                    height: "40px",
                    width: this.state.backWidth + "px",
                    left: this.state.backLeft + "px"
                }}>
                </div>
                <div className="butterfly" style={{
                    left: this.state.backLeft - 20 + "px"
                }}>
                    <img src="image/butterfly.gif"/>
                </div>
                {
                    ["home", "story", "characters", "gallery", "news"].map(d=> {
                        return <div className={"nav"} onClick={()=> {
                            this.setState({
                                anchor: d,
                                backWidth: $(this[d]).width() + 10,
                                backLeft: $(this[d]).offset().left
                            });
                        }}>
                            <div className="image"><img src={`image/${d}.png`} ref={d1=> {
                                this[d] = d1;
                            }}/></div>
                            <div className="text"><img src={`image/${d}T.png`}/></div>
                        </div>;
                    })
                }
            </div>
        </div>;
    }


}

ReactDom.render(
    <App/>
    , document.getElementById("content"));
