import "babel-polyfill";
import React from "react";
import ReactDom from "react-dom";
import Nav from "karl-component-nav";
import Table from "karl-component-table";
import css from "./index.css";

ReactDom.render(
    <Nav sectionStyle={{padding: "50px"}} data={[
        {
            id: "online", name: "每日信息", group: "服务器信息",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次</div>
                <Table project="G02DataAnalysis" tableId="daily"/>
            </div>
        },
        {
            id: "resource", name: "资源信息", group: "服务器信息",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="resource"/>
            </div>
        },
        {
            id: "world-level", name: "世界等级", group: "服务器信息",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="worldLevel"/>
            </div>
        },
        {
            id: "charge-query", name: "充值流水", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="charge"/>
            </div>
        },
        {
            id: "cost-query", name: "消耗流水", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="cost"/>
            </div>
        },
        {
            id: "stamina-query", name: "体力购买流水", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="stamina"/>
            </div>
        },
        {
            id: "produce-query", name: "产出流水", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="produce"/>
            </div>
        },
        {
            id: "log-query", name: "操作日志", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="action"/>
            </div>
        },
        {
            id: "log-crash", name: "CRASH日志", group: "日志查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次，最多返回5000行数据</div>
                <Table project="G02DataAnalysis" tableId="crash"/>
            </div>
        },
        {
            id: "retentionAndLtv", name: "留存和LTV", group: "用户分析",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="retentionAndLtv"/>
            </div>
        },
        {
            id: "level", name: "等级分布", group: "用户分析",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次</div>
                <Table project="G02DataAnalysis" tableId="level"/>
            </div>
        },
        {
            id: "loginLevel", name: "登录等级分布", group: "用户分析",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="loginLevel"/>
            </div>
        },
        {
            id: "vipLevel", name: "VIP等级分布", group: "用户分析",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次</div>
                <Table project="G02DataAnalysis" tableId="vipLevel"/>
            </div>
        },
        {
            id: "snap-diamond", name: "当前钻石持有排名", group: "快照查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1小时更新一次</div>
                <Table project="G02DataAnalysis" tableId="diamond"/>
            </div>
        },
        {
            id: "snap", name: "角色汇总表", group: "快照查询",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="snap"/>
            </div>
        },
        {
            id: "charge-range", name: "当日充值排名", group: "排名相关",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="chargeRank"/>
            </div>
        },
        {
            id: "pointNode", name: "节点数据", group: "打点数据",
            dom: <div>
                <div className={css.tableTips}>该数据每1天更新一次</div>
                <Table project="G02DataAnalysis" tableId="pointNode"/>
            </div>
        },
    ]}/>
    , document.getElementById("display"));

ReactDom.render(
    <div className={css.top}>
        <div className={css.tips}>
            所有查询条件均不选或不输入时，默认匹配该条件的所有数据。所有数据时间所属时区均为UTC-8:00(美国太平洋时间,西八区)
        </div>
    </div>
    , document.getElementById("top"));