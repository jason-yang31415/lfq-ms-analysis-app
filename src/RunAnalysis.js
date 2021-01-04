import getCurrentExperiment from "./analysis";
import { readMaxQuant } from "./analysis/DataPreparation";
import currentExperiment from "./analysis";

/**
 * Begin analysis after file is uploaded by user.
 *  - Parse data as MaxQuant output
 *  - Remove potential contaminants and reverse sequences
 *  - Log transform LFQ intensities
 * @param {File} file uploaded data file
 */
export function onDataUpload(file) {
    return (dispatch) => {
        const fileUrl = URL.createObjectURL(file);
        readMaxQuant(fileUrl)
            .then(() => {
                URL.revokeObjectURL(fileUrl);
            })
            .then(() => {});
    };
}
