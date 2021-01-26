import { expose } from "comlink";
import exceljs from "exceljs";

import { readMaxQuant } from "./analysis/DataPreparation";
import currentExperiment from "./analysis";
import MSExperiment from "./analysis/MSExperiment";

/**
 * Begin analysis after file is uploaded by user.
 *  - Parse data as MaxQuant output
 *  - Remove potential contaminants and reverse sequences
 *  - Log transform LFQ intensities
 *  - remove completely missing entries and impute missing values
 * @param {File} file uploaded data file
 */
function onDataUpload(arraybuffer) {
    return readMaxQuant(new Blob([arraybuffer])).then(() => {
        const experiment = currentExperiment();
        experiment.removeContaminants();
        experiment.logTransform();
        experiment.removeAllNaN();
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
function onComparisonsSelect(comparisons) {
    const experiment = currentExperiment();
    if (!experiment) return;
    if (!comparisons) return;
    experiment.makeComparisons(comparisons);
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
    onDataUpload,
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
