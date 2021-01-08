import React from "react";
import { connect } from "react-redux";

import "./FigureSampleConditionSelector.css";

function FigureSampleConditionSelector({
    samples,
    conditions,
    onSampleConditionChange,
}) {
    const [figureType, setFigureType] = React.useState("samples");

    const onFigureTypeChange = (e) => {
        setFigureType(e.currentTarget.value);
        console.log(e.currentTarget.value);
    };

    return (
        <div className="figure-sample-condition-selector">
            <div>
                <input
                    type="radio"
                    id="figureTypeSamples"
                    name="figureType"
                    value="samples"
                    checked={figureType === "samples"}
                    onChange={onFigureTypeChange}
                />
                <label htmlFor="figureTypeSamples">Samples</label>
                <br />
                <input
                    type="radio"
                    id="figureTypeConditions"
                    name="figureType"
                    value="conditions"
                    checked={figureType === "conditions"}
                    onChange={onFigureTypeChange}
                />
                <label htmlFor="figureTypeConditions">Conditions</label>
            </div>
            <select
                multiple
                onChange={(e) => {
                    onSampleConditionChange({
                        [figureType]: Array.from(e.target.selectedOptions).map(
                            (opt) => opt.value
                        ),
                    });
                }}
            >
                {{ samples, conditions }[figureType].map((name) => (
                    <option value={name} key={name}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default connect((state) => {
    return {
        samples: state.input.samples,
        conditions: state.input.conditions,
    };
}, null)(FigureSampleConditionSelector);
