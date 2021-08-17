import worker from "./AnalysisWorker";
import { transfer } from "comlink";
import store from "./store/store";
import { ACTIONS, createAction } from "./store/actions";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/";

let _py = null;

function initializePython() {
    return window
        .loadPyodide({
            indexURL: PYODIDE_INDEX_URL,
        })
        .then((pyodide) => {
            _py = pyodide;
        })
        .then(() => {
            // TODO
            return py().loadPackage([
                "matplotlib",
                "pandas",
                "numpy",
                "scipy",
                "statsmodels",
            ]);
        })
        .then(() => {
            return py().runPythonAsync(`
import micropip

await micropip.install("/lfq-ms-analysis-app/python/proteomics_analysis-0.0.1-py3-none-any.whl")
import proteomics
import proteomics.plotting
lfq_col = proteomics.util.lfq_col

import numpy as np
            `);
        })
        .then(() => {
            // initialize communication between plotting and analysis threads
            const analysisThreadModule = {
                // function accessible from python to get data from worker
                // thread
                get: (name) => {
                    return getPythonWorker(name, true);
                },
            };
            py().registerJsModule("analysis_thread", analysisThreadModule);
            return py().runPythonAsync(`
import pickle
from analysis_thread import get

def get_from_analysis(name):
    # get a variable from the analysis thread by pickling it on the analysis 
    # thread, transferring bytes to the plotting thread, and unpickling it
    x = await get(name)
    return pickle.loads(memoryview(bytes(x.to_py())))
            `);
        });
}

export const ready = initializePython();
export function py() {
    return _py;
}

export function runPython(python) {
    return ready
        .then(() => py().runPythonAsync(python))
        .then((results) => {
            appendReplLog(
                "figure",
                python,
                results ? results.toString() : null,
                null
            );
        })
        .catch((err) => {
            appendReplLog("figure", python, null, err ? err.toString() : null);
        });
}

export function runPythonWorker(python, data, transfers) {
    if (transfers) data = transfer(data, transfers);
    return worker
        .asyncRun(python, data)
        .then(({ results, error }) =>
            appendReplLog("worker", python, results, error)
        );
}

export function getPythonWorker(name, pickle = false) {
    return worker.get(name, pickle);
}

function appendReplLog(context, code, results, error) {
    store.dispatch(
        createAction(ACTIONS.APPEND_REPL_LOG, {
            context,
            code: code.trim(),
            results,
            error,
        })
    );
}
