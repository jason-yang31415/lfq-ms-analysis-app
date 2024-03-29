import React from "react";
import { connect } from "react-redux";
import { FIGURES } from "../Figures";
import { showPlot } from "../RunAnalysis";
import { ACTIONS, createAction } from "../store/actions";

import FigureOptions from "./FigureOptions";

import "./ViewContainer.css";

function ViewContainer({ id, onOptionsSet }) {
    const [figureOptions, setFigureOptions] = React.useState({});

    return (
        <div id={id} className="view-container">
            <p>Select data to view.</p>
            <div className="figure-options">
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
                    onOptionsChange={(changedOptions) =>
                        setFigureOptions(
                            Object.assign({}, figureOptions, changedOptions)
                        )
                    }
                />

                {/* set options */}
                <button onClick={() => onOptionsSet(figureOptions)}>
                    View data
                </button>
            </div>
        </div>
    );
}

export default connect(null, (dispatch) => {
    return {
        onOptionsSet: (figureOptions) => {
            dispatch(showPlot(figureOptions));
            dispatch(
                createAction(ACTIONS.SET_VIEW_FIGURE_OPTIONS, figureOptions)
            );
        },
    };
})(ViewContainer);
