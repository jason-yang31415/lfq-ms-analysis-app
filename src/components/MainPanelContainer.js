import React from "react";
import Plot from "react-plotly.js";
import { connect } from "react-redux";
import { FIGURES, makePlotlyDataLayout } from "../Figures";
import FigureOptions from "./FigureOptions";

import "./MainPanelContainer.css";

function MainPanelContainer({ id, samples }) {
    const [figureOptions, setFigureOptions] = React.useState({});
    const [plot, setPlot] = React.useState({
        data: [],
        layout: {
            autosize: true,
        },
    });

    const onShowPlotClick = async () => {
        setPlot(await makePlotlyDataLayout(figureOptions));
    };

    return (
        <div id={id} className="main-container">
            <div className="main-figure-options">
                {/* select figure type */}
                <select
                    onChange={(e) => {
                        setFigureOptions(
                            Object.assign({}, figureOptions, {
                                type: e.target.value,
                            })
                        );
                    }}
                    defaultValue="default"
                >
                    {[
                        <option disabled value="default" key="default">
                            -- select an option --
                        </option>,
                        ...Object.keys(FIGURES).map((fig) => (
                            <option value={fig} key={fig}>
                                {fig}
                            </option>
                        )),
                    ]}
                </select>

                {/* select figure options */}
                <FigureOptions
                    figureType={figureOptions.type}
                    onOptionsChange={({ samples, conditions, comparisons }) =>
                        setFigureOptions(
                            Object.assign({}, figureOptions, {
                                samples,
                                conditions,
                                comparisons,
                            })
                        )
                    }
                />

                {/* show plot */}
                <button onClick={onShowPlotClick}>Show plot</button>
            </div>
            <Plot
                className="main-plot"
                data={plot.data}
                layout={plot.layout}
                useResizeHandler={true}
            />
        </div>
    );
}

export default connect((state) => {
    return {
        samples: state.input.samples,
    };
}, null)(MainPanelContainer);
