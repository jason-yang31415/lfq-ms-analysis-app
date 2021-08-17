/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

import { expose } from "comlink";
import exceljs from "exceljs";

import { readMaxQuant } from "./analysis/DataPreparation";
import currentExperiment from "./analysis";
import MSExperiment from "./analysis/MSExperiment";

import initWorker from "./python/init_worker.py";

importScripts("https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js");
const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/";

function initializePython() {
    return loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
    })
        .then(() =>
            self.pyodide.loadPackage([
                "numpy",
                "pandas",
                "scipy",
                "statsmodels",
            ])
        )
        .then(() => fetch(initWorker))
        .then((res) => res.text())
        .then((src) => self.pyodide.runPythonAsync(src));
}

const ready = initializePython();

function asyncRun(python, data) {
    if (data != null)
        for (const key of Object.keys(data)) self[key] = data[key];
    return ready
        .then(() => {
            self.pyodide.globals.set("code_to_run", python);
            return self.pyodide.runPythonAsync("run_code(code_to_run)");
        })
        .then((results) => {
            return {
                results: results,
            };
        })
        .catch((err) => {
            return {
                error: err.message,
            };
        });
}

function get(name, pickle) {
    return ready
        .then(() => {
            if (pickle)
                return self.pyodide.runPythonAsync(`get_pickle("${name}")`);
            return self.pyodide.runPythonAsync(`get("${name}")`);
        })
        .then((result) => {
            let js = result.toJs();
            result.destroy();
            return js;
        });
}

/**
 * Continues analysis after user selects replicates in each condition.
 *  - Set experiment replicates
 * @param {Object.<string, string[]>} conditions
 */
function onReplicatesSelect(conditions) {
    const experiment = currentExperiment();
    if (!experiment) return;
    experiment.setReplicates(conditions);
}

/**
 * Continues analysis with pre-processing and imputation options
 *  - Normalize samples to match medians
 *  - Impute missing values using selected method
 * @param {object} options
 */
function onImpute(options) {
    const experiment = currentExperiment();
    if (!experiment) return;
    experiment.resetToSnapshot(MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM);
    experiment.normalizeMedians(options.normalize);
    experiment.imputeMissingValues(options.method);
}

/**
 * Continues analysis after user selects comparisons to make.
 *  - Set experiment comparisons
 *  - Calculate log2 LFQ intensity difference and perform t-test
 * @param {Object.<string, string[]>} comparisons
 */
function onComparisonsSelect(comparisons, thresholds) {
    const experiment = currentExperiment();
    if (!experiment) return;
    if (!comparisons) return;
    experiment.makeComparisons(comparisons, thresholds);
}

/**
 * Retrives a column of intensity data as an array.
 * @param {string} column name of column whose intensity data should be
 * retrieved
 * @param {string|null} key key of data snapshot to use
 */
function getData(column, key = null) {
    const experiment = currentExperiment();
    if (!experiment) return;
    if (key != null && !experiment.snapshots.has(key)) return;
    const data = key == null ? experiment.data : experiment.snapshots.get(key);
    return data.getSeries(column).toArray();
}

function getComparisonData(comparison, column) {
    const experiment = currentExperiment();
    if (!experiment) return;
    if (!experiment.comparisons.has(comparison[0])) return;
    if (!experiment.comparisons.get(comparison[0]).has(comparison[1])) return;
    return experiment.comparisons
        .get(comparison[0])
        .get(comparison[1])
        .getSeries(column)
        .toArray();
}

function getComparisonsTable(comparison) {
    const experiment = currentExperiment();
    if (!experiment) return;
    if (!comparison) return;
    if (!experiment.comparisons.has(comparison[0])) return;
    if (!experiment.comparisons.get(comparison[0]).has(comparison[1])) return;
    return experiment.comparisons
        .get(comparison[0])
        .get(comparison[1])
        .toArray();
}

/**
 * Download comparison data as an excel file. Returns an arraybuffer containing
 * bytes to save.
 */
function downloadData() {
    const experiment = currentExperiment();
    if (!experiment) return;

    // make new excel workbook
    const workbook = new exceljs.Workbook();
    for (const conditionA of experiment.comparisons.keys()) {
        for (const conditionB of experiment.comparisons
            .get(conditionA)
            .keys()) {
            // for each comparison, add a separate sheet
            const worksheet = workbook.addWorksheet(
                `${conditionB} vs. ${conditionA}`
            );
            // set columns
            worksheet.columns = Array.from(
                experiment.comparisons
                    .get(conditionA)
                    .get(conditionB)
                    .getColumns()
            ).map((column) => {
                return {
                    header: column.name,
                    key: column.name,
                    width: 20,
                };
            });
            // add data from experiment comparison dataframe
            worksheet.insertRows(
                2,
                experiment.comparisons.get(conditionA).get(conditionB).toArray()
            );
        }
    }
    // return bytes (promise)
    return workbook.xlsx.writeBuffer();
}

// expose worker thread analysis functions and getters to the main thread via
// comlink
expose({
    asyncRun,
    get,
    onReplicatesSelect,
    onImpute,
    onComparisonsSelect,
    getData,
    getComparisonData,
    getComparisonsTable,
    getSamples: () => currentExperiment().samples,
    getReplicates: () => currentExperiment().replicates,
    downloadData,
});
