import getCurrentExperiment from "./analysis";
import { readMaxQuant } from "./analysis/DataPreparation";
import currentExperiment from "./analysis";
import { ACTIONS, createAction } from "./store/actions";
import { dispatch } from "d3";

/**
 * Begin analysis after file is uploaded by user.
 *  - Parse data as MaxQuant output
 *  - Remove potential contaminants and reverse sequences
 *  - Log transform LFQ intensities
 * @param {File} file uploaded data file
 */
export function onDataUpload(file) {
    return (dispatch) => {
        readMaxQuant(file).then(() => {
            const experiment = currentExperiment();
            experiment.removeContaminants();
            experiment.logTransform();
            experiment.removeAllNaN();

            experiment.imputeMissingValues();

            dispatch(
                createAction(ACTIONS.SET_INPUT_SAMPLES, experiment.samples)
            );
        });
    };
}

export function onReplicatesSelect(conditions) {
    return (dispatch) => {
        const experiment = currentExperiment();
        experiment.setReplicates(conditions);
        dispatch(
            createAction(ACTIONS.SET_INPUT_CONDITIONS, Object.keys(conditions))
        );
    };
}
