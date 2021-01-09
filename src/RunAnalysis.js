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
