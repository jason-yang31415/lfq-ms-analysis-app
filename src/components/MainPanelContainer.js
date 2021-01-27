import React from "react";
import Plot from "react-plotly.js";
import { connect } from "react-redux";
import { makePlotlyDataLayout } from "../Figures";

function MainPanelContainer({ id, figureOptions }) {
    const [plot, setPlot] = React.useState({
        data: [],
        layout: {
            autosize: true,
        },
    });

    React.useEffect(async () => {
        if (figureOptions) setPlot(await makePlotlyDataLayout(figureOptions));
    }, [figureOptions]);

    if (plot) {
        return (
            <div id={id} className="main-container">
                <Plot
                    className="main-plot"
                    data={plot.data}
                    layout={plot.layout}
                    useResizeHandler
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    divId="mainpanel-figure"
                />
            </div>
        );
    }
    return "loading...";
}

export default connect((state) => {
    return {
        figureOptions: state.view.figureOptions,
    };
}, null)(MainPanelContainer);
