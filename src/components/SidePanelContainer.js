import React from "react";
import { connect } from "react-redux";
import worker from "../AnalysisWorker";

import "./SidePanelContainer.css";

import MUIDataTable from "mui-datatables";
import ReplOutput from "./ReplOutput";
import { getComparisonTable } from "../RunAnalysis";

function SidePanelContainer({ id, samples, figureOptions, replLog }) {
    const [tab, setTab] = React.useState("table");
    const [data, setData] = React.useState();

    React.useEffect(async () => {
        if (figureOptions.comparisons) {
            getComparisonTable(figureOptions.comparisons).then((table) => {
                setData(table);
            });
        }
    }, [figureOptions.comparisons]);

    let content;
    switch (tab) {
        case "table":
            content = (
                <MUIDataTable
                    title={
                        figureOptions.comparisons
                            ? `${figureOptions.comparisons[1]} vs. ${figureOptions.comparisons[0]}`
                            : "no data: make and select a comparison"
                    }
                    data={data}
                    columns={data ? Object.keys(data[0]) : []}
                    options={{
                        selectableRows: "none",
                    }}
                />
            );
            break;
        case "repl":
            content = (
                <div className="repl">
                    <div className="repl-output">
                        {replLog.map((log) => (
                            <ReplOutput
                                index={log.index}
                                context={log.context}
                                code={log.code}
                                results={log.results}
                                error={log.error}
                            ></ReplOutput>
                        ))}
                    </div>
                    <div className="repl-input">
                        <textarea className="repl-inputbox" rows={5}></textarea>
                        <div className="repl-inputrun">
                            <button className="repl-runworker">
                                run in worker
                            </button>
                            <button className="repl-runfigure">
                                run in figure
                            </button>
                        </div>
                    </div>
                </div>
            );
            break;
    }

    return (
        <div id={id} className="sidepanel-container">
            <div className="sidepanel-top">{content}</div>
            <div className="sidepanel-bottom">
                <span
                    className={"tab" + (tab === "table" ? " tab-selected" : "")}
                    onClick={() => setTab("table")}
                >
                    table
                </span>
                <span
                    className={"tab" + (tab === "repl" ? " tab-selected" : "")}
                    onClick={() => setTab("repl")}
                >
                    REPL
                </span>
            </div>
        </div>
    );
}

export default connect((state) => {
    return {
        figureOptions: state.view.figureOptions,
        replLog: state.repl,
    };
}, null)(SidePanelContainer);
