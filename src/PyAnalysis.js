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
