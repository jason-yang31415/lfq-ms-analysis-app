const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/";

let _py = window.pyodide;

function initializePython() {
    return window
        .loadPyodide({
            indexURL: PYODIDE_INDEX_URL,
        })
        .then(() => {
            _py = window.pyodide;
        })
        .then(() => {
            // TODO
            py().loadPackage([]);
        });
}

export const ready = initializePython();
export function py() {
    return _py;
}

ready.then(() => {
    console.log(py().runPython("5 + 7"));
});
