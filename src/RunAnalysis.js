import worker from "./AnalysisWorker";
import { transfer } from "comlink";
import { ACTIONS, createAction } from "./store/actions";

/**
 * This file interfaces between UI and analysis. UI changes are handled on the
 * main thread (this file) while analysis is handled in a worker (see
 * worker.js); each function calls the equivalent function in the worker, via
 * comlink proxy, to handle the analysis aspect off of the main thread.
 */

export function onDataUpload(file) {
    return (dispatch) => {
        new Response(file)
            // wrap file blob in response to read data as array buffer
            .arrayBuffer()
            // transfer array buffer to worker for processing and analysis
            .then((ab) => {
                return worker.onDataUpload(transfer(ab, [ab]));
            })
            // retrieve sample names
            .then(() => {
                return worker.getSamples();
            })
            // update UI with sample names
            .then((samples) => {
                dispatch(createAction(ACTIONS.SET_INPUT_SAMPLES, samples));
            });
    };
}

export function onReplicatesSelect(conditions) {
    return (dispatch) => {
        // transfer conditions object to worker for processing
        worker.onReplicatesSelect(conditions).then(() => {
            // update UI with condition names
            dispatch(
                createAction(
                    ACTIONS.SET_INPUT_CONDITIONS,
                    Object.keys(conditions)
                )
            );
        });
    };
}

export function onImpute(options) {
    return (dispatch) => {
        // transfer options to worker and do processing/imputation
        worker.onImpute(options);
    };
}

export function onComparisonsSelect(comparisons) {
    return (dispatch) => {
        // transfer comparisons object to worker for processing
        worker.onComparisonsSelect(comparisons).then(() => {
            dispatch(createAction(ACTIONS.SET_INPUT_COMPARISONS, comparisons));
        });
    };
}

export function downloadData() {
    return (dispatch) => {
        // get bytes to save as excel file from worker
        worker.downloadData().then((data) => {
            // make new blob and link pointing to blob, click to save file
            const blob = new Blob([data], { type: "application/vnd.ms-excel" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "results.xlsx";
            link.click();
        });
    };
}
