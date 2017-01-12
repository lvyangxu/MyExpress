import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Nav from "karl-component-nav";
import Table from "../table/index.jsx";
import css from "./index.css";

// {
//     id: "weekly", name: "每周信息", group: "服务器信息",
//     dom: <div>
//
// </div>
// },
// {
//     id: "monthly", name: "每月信息", group: "服务器信息",
//     dom: <div>
//
// </div>
// },

ReactDom.render(
    <Nav sectionStyle={{padding: "50px"}} data={[
        {
            id: "online", name: "每日信息", group: "服务器信息",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="daily"/>
            </div>
        },
        {
            id: "charge-query", name: "充值流水", group: "日志查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="charge"/>
            </div>
        },
        {
            id: "cost-query", name: "消耗流水", group: "日志查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="cost"/>
            </div>
        },
        {
            id: "stamina-query", name: "体力购买流水", group: "日志查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="stamina"/>
            </div>
        },
        {
            id: "produce-query", name: "产出流水", group: "日志查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="produce"/>
            </div>
        },
        {
            id: "log-query", name: "操作日志", group: "日志查询",
            dom: <div>

            </div>
        },
        {
            id: "retentionAndLtv", name: "留存和LTV", group: "用户分析",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="retentionAndLtv"/>
            </div>
        },
        {
            id: "level", name: "等级分布", group: "用户分析",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="level"/>
            </div>
        },
        {
            id: "vipLevel", name: "VIP等级分布", group: "用户分析",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="vipLevel"/>
            </div>
        },
        {
            id: "snap-diamond", name: "当前钻石持有排名", group: "快照查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="diamond"/>
            </div>
        },
        {
            id: "snap", name: "汇总表", group: "快照查询",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="snap"/>
            </div>
        },
        {
            id: "charge-range", name: "当日充值排名", group: "排名相关",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="chargeRank"/>
            </div>
        },
        {
            id: "device-charge-range", name: "当日充值排名(设备)", group: "排名相关",
            dom: <div>
                <Table project="G02DataAnalysis" tableId="deviceChargeRank"/>
            </div>
        },
    ]}/>
    , document.getElementById("display"));

ReactDom.render(
    <div className={css.top}>
        <div className={css.tips}>
            所有查询条件均不选或不输入时，默认匹配该条件的所有数据
        </div>
    </div>
    , document.getElementById("top"));