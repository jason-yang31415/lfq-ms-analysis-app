import React from "react";
import { connect } from "react-redux";
import worker from "../AnalysisWorker";

import MUIDataTable from "mui-datatables";

function SidePanelContainer({ id, samples, figureOptions }) {
    const [data, setData] = React.useState();

    React.useEffect(async () => {
        if (figureOptions.comparisons)
            setData(
                await worker.getComparisonsTable(figureOptions.comparisons)
            );
    }, [figureOptions.comparisons]);

    return (
        <div id={id}>
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
        </div>
    );
}

export default connect((state) => {
    return {
        figureOptions: state.view.figureOptions,
    };
}, null)(SidePanelContainer);
