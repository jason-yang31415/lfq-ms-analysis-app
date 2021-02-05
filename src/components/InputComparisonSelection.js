import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import "./InputComparisonSelection.css";
import { onComparisonsSelect } from "../RunAnalysis";

Modal.setAppElement("#root");

function InputComparisonSelection({ conditions, onComparisonSelect }) {
    const [comparisonModalOpen, setComparisonModalOpen] = React.useState(false);

    const [thresholdP, setThresholdP] = React.useState(0.05);
    const [thresholdLogFC, setThresholdLogFC] = React.useState(1);
    const [thresholdReps, setThresholdReps] = React.useState(2);

    /** @type {Map.<string, Set<string>} */
    const [comparisons, setComparisons] = React.useState({});

    const onComparisonChange = (conditionA, conditionB, selected) => {
        let cpy = { ...comparisons };
        if (selected) {
            cpy[conditionA] = [...(cpy[conditionA] || [])];
            if (!cpy[conditionA].includes(conditionB))
                cpy[conditionA].push(conditionB);
        } else {
            if (conditionA in cpy && cpy[conditionA].includes(conditionB)) {
                cpy[conditionA] = [...cpy[conditionA]].splice(
                    cpy[conditionA].indexOf(conditionB),
                    1
                );
            }
        }
        setComparisons(cpy);
    };

    const onOKClick = () => {
        onComparisonSelect(comparisons, {
            thresholdP,
            thresholdLogFC,
            thresholdReps,
        });
        setComparisonModalOpen(false);
    };

    return (
        <div>
            <span>(4) </span>
            <button onClick={() => setComparisonModalOpen(true)}>
                Select comparisons
            </button>

            <ul>
                <li>
                    View enriched and depleted proteins per comparison as
                    volcano plot.
                </li>
                <li>View distribution of p values and adjusted p values.</li>
                <li>
                    View mean intensities, log fold changes, p values as data
                    table.
                </li>
            </ul>

            <Modal
                isOpen={comparisonModalOpen}
                id="input-comparison-modal"
                style={{
                    overlay: {
                        zIndex: 1000,
                    },
                }}
            >
                <h1 id="input-comparison-modal-head">Select comparisons</h1>

                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            {conditions.map((condition) => (
                                <td key={`${condition} B`}>{condition}</td>
                            ))}
                        </tr>
                        {conditions.map((conditionA) => (
                            <tr key={`${conditionA} row`}>
                                <td key={`${conditionA} A`}>{conditionA}</td>
                                {conditions.map((conditionB) => (
                                    <td key={`${conditionA},${conditionB}`}>
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                onComparisonChange(
                                                    conditionA,
                                                    conditionB,
                                                    e.target.checked
                                                )
                                            }
                                            disabled={conditionA === conditionB}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                    <label htmlFor="threshold-p">Significant p-value: </label>
                    <input
                        type="number"
                        step="any"
                        min={0}
                        value={thresholdP}
                        onChange={(e) => setThresholdP(e.target.value)}
                        id="threshold-p"
                    />
                    <br />
                    <label htmlFor="threshold-logfc">
                        Significant log fold change:{" "}
                    </label>
                    <input
                        type="number"
                        step="any"
                        min={0}
                        value={thresholdLogFC}
                        onChange={(e) => setThresholdLogFC(e.target.value)}
                        id="threshold-logfc"
                    />
                    <br />
                    <label htmlFor="threshold-reps">
                        Significant number of replicates:{" "}
                    </label>
                    <input
                        type="number"
                        step={1}
                        min={0}
                        value={thresholdReps}
                        onChange={(e) => setThresholdReps(e.target.value)}
                        id="threshold-reps"
                    />
                </div>

                <div id="input-comparison-modal-foot">
                    <button onClick={onOKClick}>OK</button>
                </div>
            </Modal>
        </div>
    );
}

export default connect(
    (state) => {
        return {
            conditions: state.input.conditions,
        };
    },
    (dispatch) => {
        return {
            onComparisonSelect: (comparisons, thresholds) => {
                dispatch(onComparisonsSelect(comparisons, thresholds));
            },
        };
    }
)(InputComparisonSelection);
