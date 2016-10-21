let React = require("react");
let ReactDom = require("react-dom");
require("karl-extend");
let Login = require("../../util/login");

ReactDom.render(<Login/>,document.getElementById("login"));