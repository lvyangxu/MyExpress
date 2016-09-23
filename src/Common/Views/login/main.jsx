let React = require("react");
let ReactDom = require("react-dom");
require("../../util/myString").extend();
let Login = require("../../util/login");

ReactDom.render(<Login/>,document.getElementById("login"));