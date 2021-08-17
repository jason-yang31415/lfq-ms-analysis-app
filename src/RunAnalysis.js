import worker from "./AnalysisWorker";
import { ACTIONS, createAction } from "./store/actions";
import Plotly from "plotly.js";

import { runPython, runPythonWorker, getPythonWorker } from "./PyAnalysis";
import { makePlotCode } from "./Figures";
import MSExperiment from "./analysis/MSExperiment";

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
        // set replicates dictionary on analysis thread
        runPythonWorker(
            `
replicates = {
${Object.entries(conditions)
    .map(
        ([condition, samples]) =>
            `    "${condition}": [${samples.map((x) => `"${x}"`)}]`
    )
    .join(",\n")}
}
            `
        ).then(() => {
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
        const { normalize, method } = options;
        let src = "";
        if (normalize)
            src += `
data_normalized = data.copy()
max_median = data[lfq_col(samples)].median(axis=0).max()
data_normalized[lfq_col(samples)] = data_normalized[lfq_col(samples)].apply(
    lambda col: col * max_median / col.median(), axis=0
)
            `;
        else
            src += `
data_normalized = data.copy()
            `;

        src += `
data_imputed = []
for i in range(1):
    df = data_normalized.copy()
    for cond, reps in replicates.items():
        `;
        switch (method) {
            case MSExperiment.IMPUTATION_METHODS.METHOD_31:
                src += `
        df[lfq_col(reps)] = proteomics.imputation.impute_3_1(df[lfq_col(reps)])
                `;
                break;
            case MSExperiment.IMPUTATION_METHODS.METHOD_46:
                src += `
        df[lfq_col(reps)] = proteomics.imputation.impute_twostep(
            proteomics.imputation.impute_4_6(df[lfq_col(reps)]),
            proteomics.imputation.impute_3_1(df[lfq_col(reps)])
        )
                `;
                break;
            case MSExperiment.IMPUTATION_METHODS.METHOD_47:
                src += `
        df[lfq_col(reps)] = proteomics.imputation.impute_twostep(
            proteomics.imputation.impute_4_6(df[lfq_col(reps)], n_rep=1),
            proteomics.imputation.impute_3_1(df[lfq_col(reps)])
        )
                `;
                break;
        }

        src += `
        data_imputed.append(df)
        `;
        runPythonWorker(src);
    };
}

export function onComparisonsSelect(comparisons, thresholds) {
    return (dispatch) => {
        let src = `
comparisons = [
${Object.entries(comparisons)
    .map(([a, listb]) => listb.map((b) => `    ("${a}", "${b}"),`))
    .flat()
    .join("\n")}
]

data_comparisons = proteomics.imputation.compare(
    comparisons, 
    replicates, 
    data_normalized,
    data_imputed,
    sig_p=${thresholds.thresholdP},
    sig_fc=${thresholds.thresholdLogFC},
    sig_reps=${thresholds.thresholdReps}
)
        `;
        runPythonWorker(src).then(() => {
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

export function getComparisonTable(comparison) {
    // convert dataframe to list of dicts
    return runPythonWorker(`
table = data_comparisons[("${comparison[0]}", "${comparison[1]}")].fillna("").assign(significant=lambda df: df["significant"].apply(str)).to_dict("records")
        `)
        .then(() => {
            // retrieve comparison data from worker python instance
            return getPythonWorker("table");
        })
        .then((table) => {
            // pyodide converts dict to map; convert maps to objects
            return table.map((row) => Object.fromEntries(row));
        });
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
