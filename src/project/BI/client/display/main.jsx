import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Nav from "karl-component-nav";
// import Table from "karl-component-table";
import Table from "../../../../src/module/karl-component-table/index";
import css from "./index.css";

ReactDom.render(
    <Nav sectionStyle={{padding: "50px"}} data={[
        {
            id: "dataQuery", name: "数据查询", group: "数据",
            dom: <Table project="BI" tableId="channelInfo"/>
        },
        {
            id: "dailyDataUpload", name: "每日数据上传", group: "数据",
            dom: <Table project="BI" tableId="dailyDataUpload"/>
        },
        {
            id: "channelQuery", name: "渠道查询", group: "数据",
            dom: <Table project="BI" tableId="channelInfo"/>
        },
        {
            id: "channelDataAlterHistory", name: "渠道数据修改记录", group: "数据",
            dom: <Table project="BI" tableId="channelAlterHistory"/>
        },
        {
            id: "invoiceQuery", name: "invoice查询", group: "财务",
            dom: <Table project="BI" tableId="channelDataAlterHistory"/>
        },
        {
            id: "invoiceMount", name: "invoice录入", group: "财务",
            dom: <Table project="BI" tableId="channelDataAlterHistory"/>
        },
    ]}/>
    , document.getElementById("display"));

ReactDom.render(
    <div className={css.top}>
        <div className={css.tips}>
            所有查询条件均不选或不输入时，默认匹配该条件的所有数据。
        </div>
    </div>
    , document.getElementById("top"));