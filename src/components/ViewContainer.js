import React from "react";
import { connect } from "react-redux";
import { FIGURES } from "../Figures";
import { downloadData } from "../RunAnalysis";
import { ACTIONS, createAction } from "../store/actions";

import FigureOptions from "./FigureOptions";

import "./ViewContainer.css";

function ViewContainer({ id, onOptionsSet, onDownloadClick }) {
    const [figureOptions, setFigureOptions] = React.useState({});

    return (
        <div id={id} className="main-figure-options">
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

            <button onClick={onDownloadClick}>Download data</button>
        </div>
    );
}

export default connect(null, (dispatch) => {
    return {
        onOptionsSet: (figureOptions) => {
            dispatch(
                createAction(ACTIONS.SET_VIEW_FIGURE_OPTIONS, figureOptions)
            );
        },
        onDownloadClick: () => {
            dispatch(downloadData());
        },
    };
})(ViewContainer);
