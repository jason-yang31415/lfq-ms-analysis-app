import { expose } from "comlink";

import { readMaxQuant } from "./analysis/DataPreparation";
import currentExperiment from "./analysis";

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
        experiment.normalizeMedians();
        experiment.imputeMissingValues();
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

// expose worker thread analysis functions and getters to the main thread via
// comlink
expose({
    onDataUpload,
    onReplicatesSelect,
    onComparisonsSelect,
    getData,
    getComparisonData,
    getComparisonsTable,
    getSamples: () => currentExperiment().samples,
    getReplicates: () => currentExperiment().replicates,
});
