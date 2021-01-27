import React from "react";
import { connect } from "react-redux";
import { FIGURES } from "../Figures";

import "./FigureOptions.css";

function FigureOptions({
    samples,
    conditions,
    comparisons,
    figureType,
    onOptionsChange,
}) {
    const [sampleCondition, setSampleCondition] = React.useState("samples");

    let options;
    switch (figureType) {
        case FIGURES.LOG_VIOLIN:
        case FIGURES.PRE_POST_IMPUTATION_VIOLIN:
        case FIGURES.PRE_POST_IMPUTATION_BOXPLOT:
            const onFigureTypeChange = (e) => {
                setSampleCondition(e.currentTarget.value);
                onOptionsChange({
                    samples: undefined,
                    conditions: undefined,
                });
            };

            options = (
                <>
                    <div>
                        <input
                            type="radio"
                            id="figureTypeSamples"
                            name="figureType"
                            value="samples"
                            checked={sampleCondition === "samples"}
                            onChange={onFigureTypeChange}
                        />
                        <label htmlFor="figureTypeSamples">Samples</label>
                        <br />
                        <input
                            type="radio"
                            id="figureTypeConditions"
                            name="figureType"
                            value="conditions"
                            checked={sampleCondition === "conditions"}
                            onChange={onFigureTypeChange}
                        />
                        <label htmlFor="figureTypeConditions">Conditions</label>
                    </div>
                    <select
                        className="sample-condition-selector"
                        multiple
                        onChange={(e) => {
                            onOptionsChange({
                                [sampleCondition]: Array.from(
                                    e.target.selectedOptions
                                ).map((opt) => opt.value),
                            });
                        }}
                    >
                        {{ samples, conditions }[sampleCondition].map(
                            (name) => (
                                <option value={name} key={name}>
                                    {name}
                                </option>
                            )
                        )}
                    </select>
                </>
            );
            break;
        case FIGURES.VOLCANO:
        case FIGURES.P_VALUE_HISTOGRAM:
            options = (
                <>
                    <select
                        className="comparison-selector"
                        multiple
                        onChange={(e) => {
                            onOptionsChange({
                                comparisons: JSON.parse(e.target.value),
                            });
                        }}
                    >
                        {Object.entries(comparisons || {})
                            .map(([conditionA, value]) =>
                                value.map((conditionB) => (
                                    <option
                                        value={JSON.stringify([
                                            conditionA,
                                            conditionB,
                                        ])}
                                        key={JSON.stringify([
                                            conditionA,
                                            conditionB,
                                        ])}
                                    >
                                        {conditionB} vs. {conditionA}
                                    </option>
                                ))
                            )
                            .flat()}
                    </select>
                    <textarea
                        className="highlight-genes-textbox"
                        placeholder="highlight genes in volcano plot (case insensitive); one gene per line"
                        onChange={(e) =>
                            onOptionsChange({
                                highlightGenes: e.target.value
                                    .split("\n")
                                    .filter((g) => g !== ""),
                            })
                        }
                    ></textarea>
                </>
            );
            break;
    }

    return <div className="figure-sample-condition-selector">{options}</div>;
}

export default connect((state) => {
    return {
        samples: state.input.samples,
        conditions: state.input.conditions,
        comparisons: state.input.comparisons,
    };
}, null)(FigureOptions);
