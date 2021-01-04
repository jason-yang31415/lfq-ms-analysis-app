import MSExperiment from "./MSExperiment";

export let currentExperiment = null;

/**
 *
 * @param {MSExperiment} experiment
 */
export function setCurrentExperiment(experiment) {
    currentExperiment = experiment;
}

/**
 * @returns {MSExperiment}
 */
export function getCurrentExperiment() {
    return currentExperiment;
}
