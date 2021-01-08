import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import "./InputReplicateSelection.css";
import { onReplicatesSelect } from "../RunAnalysis";

Modal.setAppElement("#root");

function InputReplicateSelection({ samples, onReplicatesSelect }) {
    const [replicatesModalOpen, setReplicatesModalOpen] = React.useState(false);
    const [selectedReplicates, setSelectedReplicates] = React.useState([]);
    const [conditionName, setConditionName] = React.useState("");
    const [conditions, setConditions] = React.useState({});

    const onAddCondition = () => {
        if (conditionName.length === 0) return;
        setConditions(
            Object.assign({}, conditions, {
                [conditionName]: selectedReplicates,
            })
        );
        setConditionName("");
    };

    const onOKClick = () => {
        onReplicatesSelect(conditions);
        setReplicatesModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => setReplicatesModalOpen(true)}>
                Select replicates
            </button>
            <Modal isOpen={replicatesModalOpen} id="input-replicate-modal">
                <h1 id="input-replicate-modal-head">Select replicates</h1>

                <select
                    multiple
                    onChange={(e) => {
                        setSelectedReplicates(
                            Array.from(e.target.selectedOptions).map(
                                (opt) => opt.value
                            )
                        );
                    }}
                >
                    {samples.map((sample) => (
                        <option value={sample} key={sample}>
                            {sample}
                        </option>
                    ))}
                </select>

                <div>
                    <label htmlFor="conditionName">Condition name: </label>
                    <input
                        type="text"
                        id="conditionName"
                        name="conditionName"
                        value={conditionName}
                        onChange={(e) => setConditionName(e.target.value)}
                    />
                    <br />
                    <button onClick={onAddCondition}>Add condition</button>
                    <br />
                    <button onClick={() => setConditions({})}>
                        Reset conditions
                    </button>
                </div>

                <div>
                    {Object.entries(conditions).map(
                        ([condition, replicates]) => (
                            <p key={condition}>
                                {condition}: {replicates.join(", ")}
                            </p>
                        )
                    )}
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
        return {
            samples: state.input.samples,
        };
    },
    (dispatch) => {
        return {
            onReplicatesSelect: (conditions) => {
                dispatch(onReplicatesSelect(conditions));
            },
        };
    }
)(InputReplicateSelection);
