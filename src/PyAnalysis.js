import worker from "./AnalysisWorker";
import { transfer } from "comlink";

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
            return py().loadPackage(["matplotlib"]);
        })
        .then(() => {
            // TODO
        });
}

export const ready = initializePython();
export function py() {
    return _py;
}

export function runPythonWorker(python, data, transfers) {
    return worker
        .asyncRun(python, transfer(data, transfers))
        .then(({ results, error }) => console.log(results, error));
}

export function getPythonWorker(name) {
    return worker.get(name);
}
