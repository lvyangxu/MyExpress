require("babel-polyfill");
let React = require("react");
let ReactDom = require("react-dom");
// let Datepicker = require("../karl-component-datepicker/index");
// let Chart = require("../karl-component-chart/index");
let Scroll = require("../karl-component-scroll/index");
let data1 = [
    {date: 3, apple: 32, banana: 33, pear: 34, server: 1, region: "中国"},
    {date: 5, apple: 32, banana: -20, pear: 34, server: 2, region: "中国"},
    {date: 4, apple: 21, banana: -2, pear: 3, server: 2, region: "美国"},
    {date: 11, apple: 3, banana: 3, pear: 2, server: 1, region: "阿拉伯"},
    {date: 12, apple: 5, banana: 47, server: 1, region: "中国"},
    {date: 22, apple: 5, banana: 7, pear: 4, server: 1, region: "美国"},
    {date: 13, apple: 8, pear: 6, server: 1, region: "美国"},
    {date: 14, apple: 32, banana: 33, pear: 34, server: 1, region: "中国"},
];
let data2 = [
    {date: "2016-9-11", apple: 32, banana: 33, pear: 34, server: 1, region: "中国"},
    {date: "2016-9-11", apple: 32, banana: -20, pear: 34, server: 2, region: "中国"},
    {date: "2016-9-11", apple: 21, banana: -2, pear: 3, server: 2, region: "美国"},
    {date: "2016-9-13", apple: 3, banana: 3, pear: 2, server: 1, region: "阿拉伯"},
    {date: "2016-9-12", apple: 5, banana: 47, server: 1, region: "中国"},
    {date: "2016-10-14", apple: 5, banana: 7, pear: 4, server: 1, region: "美国"},
    {date: "2017-1-15", apple: 8, pear: 6, server: 1, region: "美国"},
    {date: "2016-9-11", apple: 32, banana: 33, pear: 34, server: 1, region: "中国"},
];

class Xx extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: data1
        };
    }

    render() {
        return (
            <div>
                <Datepicker type="second" callback={d=> {
                    console.log(d);
                }}/>
                <Chart title="chart" xAxisGroupNum={10} yAxisText="kg" x="date" y={[
                    {id: "apple", name: "apple"},
                    {id: "banana", name: "banana"},
                    {id: "pear", name: "pear"}
                ]} data={this.state.data} group={["server", "region"]} type="bar"/>
                <button onClick={()=> {
                    let data = data2;
                    this.setState({data: data});
                }}>1
                </button>
            </div>);
    }

}



ReactDom.render(
    <div>
        <Scroll>
            <div style={{backgroundColor: "yellow"}}>1</div>
            <div style={{backgroundColor: "red"}}>2</div>
            <div style={{backgroundColor: "blue"}}>3</div>
        </Scroll>

    </div>
    , document.getElementById("test"));
