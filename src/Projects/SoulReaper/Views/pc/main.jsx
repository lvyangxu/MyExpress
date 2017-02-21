import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import $ from "jquery";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchor: "story",
            index: this.props.index ? this.props.index : 0,
            isScrolling: false,
            page1DownloadDisplay: true,
            page2DownloadDisplay: true
        };
        let bindArr = [];
        bindArr.forEach(d => {
            this[d] = this[d].bind(this);
        });
    }

    componentDidMount() {
        this.delegateTouch();
        this.delegateScroll();
        this.setState({
            dots: !(this.props.dots == false || this.props.dots == "false"),
        });

        let doResize = ()=> {
            $(this.middle).css({height: $(window).height() - 130 + "px"});
            $(this.nav).css({"clip-path": `polygon(0 0,${$(".container").width() / 2 - 130}px 0,100% 100%,0 100%)`});
            $(this.current).css({width: `${$(".container").width() / 2 - 370}px`});
            this.setState({
                height: $(window).height()
            });
        };

        $(document).ready(()=> {
            doResize();
        });
        $(window).resize(()=> {
            doResize();
        });
    }

    componentWillMount() {
        this.setState({
            height: $(window).height()
        });
    }

    render() {
        return <div className="scroll">
            <div className="container" ref={d => {
                this.container = d;
            }}>
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
                            <div className="nav" style={{color: "rgba(72,166,246,1)"}}>
                                HOME
                            </div>
                            <div className="nav" onClick={()=> {
                                this.setState({
                                    anchor: "story",
                                }, ()=> {
                                    this.animateTo(1);
                                });
                            }}>
                                STORY
                            </div>
                            <div className="nav" onClick={()=> {
                                this.setState({
                                    anchor: "news"
                                }, ()=> {
                                    this.animateTo(1);
                                });
                            }}>
                                NEWS
                            </div>
                            <div className="nav" onClick={()=> {
                                this.setState({
                                    anchor: "characters"
                                }, ()=> {
                                    this.animateTo(1);
                                });
                            }}>
                                CHARACTERS
                            </div>
                            <div className="nav" onClick={()=> {
                                this.setState({
                                    anchor: "gallery"
                                }, ()=> {
                                    this.animateTo(1);
                                });
                            }}>
                                GALLERY
                            </div>
                        </div>
                        <div className="right">
                            <div className="fire"><img src="image/fire.gif"/></div>
                            <div className="google" style={this.state.page1DownloadDisplay ? {} : {display: "none"}}>
                                <img src="image/google.png"/>
                            </div>
                            <div className="apple" style={this.state.page1DownloadDisplay ? {} : {display: "none"}}>
                                <img src="image/apple.png"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page2">
                    <div className="top">
                        <div className="left" ref={d=> {
                            this.nav = d;
                        }}>
                            <div className="black"></div>
                            <div className="current" ref={d=> {
                                this.current = d;
                            }}>{this.state.anchor.toUpperCase()}</div>
                            <div className="navs">
                                {
                                    ["home", "story", "news", "character", "gallery"].filter(d=> {
                                        return d != this.state.anchor;
                                    }).map((d, i)=> {
                                        return <div className={i == 3 ? "nav last" : "nav"} onClick={()=> {
                                            if (i == 0) {
                                                this.animateTo(0);
                                            } else {
                                                this.setState({anchor: d});
                                            }
                                        }}>
                                            {d.toUpperCase()}
                                        </div>;
                                    })
                                }
                            </div>
                        </div>
                        <div className="right">
                            <div className="google" style={this.state.page2DownloadDisplay ? {} : {display: "none"}}>
                                <img src="image/google.png"/>
                            </div>
                            <div className="apple" style={this.state.page2DownloadDisplay ? {} : {display: "none"}}>
                                <img src="image/apple.png"/>
                            </div>
                        </div>
                    </div>
                    <div className="story"
                         style={this.state.anchor == "story" ? {height: this.state.height - 200 + "px"} : {display: "none"}}>
                        <div className="left">
                            <img src="image/story1.png"/>
                        </div>
                        <div className="right">
                            <div className="text">
                                fasffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                                fasffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                                fasffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                                fasffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                            </div>
                        </div>
                        <img className="rightButton" src="image/right.png"/>
                    </div>
                    <div className="character"
                         style={this.state.anchor == "character" ? {height: this.state.height - 200 + "px"} : {display: "none"}}>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i)=> {
                                return <div key={i} className="role">
                                    <img className="roleImg" src={`image/c${d}.png`}/>
                                </div>;
                            })
                        }
                    </div>
                    <div className="bottom">
                        <img src="image/facebook.png"/>
                        <img src="image/twitter.png"/>
                    </div>
                </div>
            </div>
            <div className="dots" style={this.state.dots ? {} : {display: "none"}}>
                {
                    [0, 1].map((d, i) => {
                        return <div key={i}
                                    className={this.state.index == i ? "dot active" : "dot"}
                                    onClick={() => {
                                        this.animateTo(i);
                                    }}></div>
                    })
                }
            </div>
        </div>;
    }

    /**
     * 滚动到某一页
     * @param i
     */
    animateTo(i) {
        let json = {
            isScrolling: true,
            index: i
        };
        if (i == 0) {
            json.page1DownloadDisplay = true;
            json.page2DownloadDisplay = false;
        } else {
            json.page1DownloadDisplay = false;
            json.page2DownloadDisplay = true;
        }
        this.setState(json, ()=> {
            $(this.container).animate({
                "margin-top": -$(window).height() * this.state.index
            }, 800, "linear", ()=> {
                this.setState({isScrolling: false});
            });
        });

    }

    startMove(y) {
        this.setState({
            start: y
        });
    }

    doMove(y) {
        this.setState({
            end: y
        });
    }

    endMove() {
        let delta = this.state.end - this.state.start;
        if (Math.abs(delta) < 30) {
            return;
        }
        this.doScroll(delta);
    }

    /**
     * 监听触摸事件
     */
    delegateTouch() {
        this.container.addEventListener('touchstart', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.startMove(e.touches[0].pageY);
        }, false);
        this.container.addEventListener('touchmove', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.doMove(e.touches[0].pageY);
        }, false);
        this.container.addEventListener('touchend', e => {
            e.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            this.endMove();
        });
    }

    /**
     * 执行滚动
     * @param delta
     */
    doScroll(delta) {
        let index = this.state.index;
        if (delta > 0) {
            //朝前滚动
            if (index == 0) {
                return;
            }
            index--;
        } else {
            //朝后滚动
            if (index == 2 - 1) {
                return;
            }
            index++;
        }
        this.animateTo(index);
    }

    /**
     * 监听鼠标滚动事件
     */
    delegateScroll() {
        $(document).delegate("", "mousewheel DOMMouseScroll", event=> {
            event.preventDefault();
            if (this.state.isScrolling) {
                return;
            }
            var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            this.doScroll(delta);
        });
    }
}

ReactDom.render(
    <App/>
    , document.getElementById("content"));
