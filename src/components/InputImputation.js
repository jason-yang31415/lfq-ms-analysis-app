import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import "./InputImputation.css";
import { onImpute } from "../RunAnalysis";
import MSExperiment from "../analysis/MSExperiment";

Modal.setAppElement("#root");

function InputImputation({ onImputeClick }) {
    const [imputationModalOpen, setImputationModalOpen] = React.useState(false);
    const [options, setOptions] = React.useState({
        normalize: true,
        method: MSExperiment.IMPUTATION_METHODS.METHOD_31,
    });

    const onOKClick = () => {
        onImputeClick(options);
        setImputationModalOpen(false);
    };

    return (
        <div>
            <span>(3) </span>
            <button onClick={() => setImputationModalOpen(true)}>
                Preprocess and impute
            </button>

            <ul>
                <li>
                    View log-transformed intensity distributions before and
                    after imputation as violin plot or boxplot.
                </li>
            </ul>

            <Modal
                isOpen={imputationModalOpen}
                id="input-imputation-modal"
                style={{
                    overlay: {
                        zIndex: 1000,
                    },
                }}
            >
                <h1 id="input-imputation-modal-head">Imputation options</h1>

                <div id="input-imputation-modal-body">
                    <h2>Pre-processing</h2>
                    <input
                        type="checkbox"
                        id="normalizeMedians"
                        checked={options.normalize}
                        onChange={(e) =>
                            setOptions(
                                Object.assign({}, options, {
                                    normalize: e.target.checked,
                                })
                            )
                        }
                    />
                    <label htmlFor="normalizeMedians">Normalize medians</label>
                    <h2>Imputation</h2>
                    <select
                        onChange={(e) =>
                            setOptions(
                                Object.assign({}, options, {
                                    method: e.currentTarget.value,
                                })
                            )
                        }
                    >
                        <option
                            value={MSExperiment.IMPUTATION_METHODS.METHOD_31}
                        >
                            method 3.1
                        </option>
                        <option
                            value={MSExperiment.IMPUTATION_METHODS.METHOD_46}
                        >
                            method 4.6
                        </option>
                        <option
                            value={MSExperiment.IMPUTATION_METHODS.METHOD_47}
                        >
                            method 4.7
                        </option>
                    </select>
                </div>

                <div id="input-replicate-modal-foot">
                    <button onClick={onOKClick}>OK</button>
                </div>
            </Modal>
        </div>
    );
}

export default connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return {
            onImputeClick: (options) => {
                dispatch(onImpute(options));
            },
        };
    }
)(InputImputation);
