import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import "./InputComparisonSelection.css";
import { onComparisonsSelect } from "../RunAnalysis";

Modal.setAppElement("#root");

function InputComparisonSelection({ conditions, onComparisonSelect }) {
    const [comparisonModalOpen, setComparisonModalOpen] = React.useState(false);
    /** @type {Map.<string, Set<string>} */
    const comparisons = new Map();

    const onComparisonChange = (conditionA, conditionB, selected) => {
        if (selected) {
            if (!comparisons.has(conditionA))
                comparisons.set(conditionA, new Set());
            comparisons.get(conditionA).add(conditionB);
        } else {
            if (
                comparisons.has(conditionA) &&
                comparisons.get(conditionA).has(conditionB)
            )
                comparisons.get(conditionA).delete(conditionB);
        }
    };

    const onOKClick = () => {
        onComparisonSelect(comparisons);
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
            onComparisonSelect: (comparisons) => {
                const comparisonsObj = Array.from(comparisons.keys()).reduce(
                    (obj, condition) =>
                        Object.assign(obj, {
                            [condition]: Array.from(comparisons.get(condition)),
                        }),
                    {}
                );
                dispatch(onComparisonsSelect(comparisonsObj));
            },
        };
    }
)(InputComparisonSelection);
