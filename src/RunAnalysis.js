import worker from "./AnalysisWorker";
import { ACTIONS, createAction } from "./store/actions";
import Plotly from "plotly.js";

import { runPython, runPythonWorker, getPythonWorker } from "./PyAnalysis";
import { makePlotCode } from "./Figures";

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
            // transfer array buffer to worker python instance to import as
            // maxquant file
            .then((ab) =>
                runPythonWorker(
                    `
from js import raw_data
import io

data, samples = proteomics.io.import_maxquant(
    io.BytesIO(raw_data.to_py()),
    normalize=False
)
print(data)
print(samples)
                `,
                    {
                        raw_data: ab,
                    },
                    [ab]
                )
            )
            // get "samples" variable from worker python instance
            .then(() => getPythonWorker("samples"))
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

export function onComparisonsSelect(comparisons, thresholds) {
    return (dispatch) => {
        // transfer comparisons object to worker for processing
        worker.onComparisonsSelect(comparisons, thresholds).then(() => {
            dispatch(createAction(ACTIONS.SET_INPUT_COMPARISONS, comparisons));
        });
    };
}

export function showPlot(figureOptions) {
    return (dispatch) => {
        let src = makePlotCode(figureOptions);
        runPython(src);
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

export function saveFigure() {
    return (dispatch) => {
        Plotly.downloadImage("mainpanel-figure", {
            format: "png",
            width: 1024,
            height: 1024,
            filename: "figure",
        });
    };
}
