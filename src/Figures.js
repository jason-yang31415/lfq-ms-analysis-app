import worker from "./AnalysisWorker";
import MSExperiment from "./analysis/MSExperiment";
import FigureSampleConditionSelector from "./components/FigureSampleConditionSelector";

export const FIGURES = {
    PRE_POST_IMPUTATION_VIOLIN: "PRE_POST_IMPUTATION_VIOLIN",
    PRE_POST_IMPUTATION_BOXPLOT: "PRE_POST_IMPUTATION_BOXPLOT",
};

export async function makePlotlyDataLayout(options) {
    const { type } = options;

    let ret = { data: [], layout: {} };
    switch (type) {
        case FIGURES.PRE_POST_IMPUTATION_VIOLIN:
            ret = await makePrePostImputationViolin(options);
            break;
        case FIGURES.PRE_POST_IMPUTATION_BOXPLOT:
            ret = await makePrePostImputationBoxplot(options);
            break;
    }
    ret.layout.autosize = true;

    return ret;
}

async function makePrePostImputationViolin({ samples, conditions }) {
    const makeViolinTrace = (trace) => {
        return Object.assign(trace, {
            type: "violin",
            width: 1,
            points: false,
        });
    };

    let ret = { data: [], layout: {} };
    if (samples != undefined && conditions == undefined) {
        ret = {
            data: await Promise.all([
                ...samples.map((sample) =>
                    worker
                        .getData(
                            `LFQ intensity ${sample}`,
                            MSExperiment.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION
                        )
                        .then((data) =>
                            makeViolinTrace({
                                name: "pre",
                                x: data,
                                y0: sample,
                                legendgroup: "pre",
                                side: "positive",
                            })
                        )
                ),
                ...samples.map((sample) =>
                    worker
                        .getData(
                            `LFQ intensity ${sample}`,
                            MSExperiment.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES
                        )
                        .then((data) =>
                            makeViolinTrace({
                                name: "post",
                                x: data,
                                y0: sample,
                                legendgroup: "post",
                                side: "negative",
                            })
                        )
                ),
            ]),
            layout: {},
        };
    } else if (samples == undefined && conditions != undefined) {
        const replicates = await worker.getReplicates();
        ret = {
            data: await Promise.all([
                ...conditions.map((condition) =>
                    Promise.all(
                        replicates
                            .get(condition)
                            .map((sample) =>
                                worker.getData(
                                    `LFQ intensity ${sample}`,
                                    MSExperiment.SNAPSHOT_KEYS
                                        .MEDIAN_NORMALIZATION
                                )
                            )
                    )
                        .then((array) => array.flat())
                        .then((data) =>
                            makeViolinTrace({
                                name: "pre",
                                x: data,
                                y0: condition,
                                legendgroup: "pre",
                                side: "positive",
                            })
                        )
                ),
                ...conditions.map((condition) =>
                    Promise.all(
                        replicates
                            .get(condition)
                            .map((sample) =>
                                worker.getData(
                                    `LFQ intensity ${sample}`,
                                    MSExperiment.SNAPSHOT_KEYS
                                        .IMPUTE_MISSING_VALUES
                                )
                            )
                    )
                        .then((array) => array.flat())
                        .then((data) =>
                            makeViolinTrace({
                                name: "post",
                                x: data,
                                y0: condition,
                                legendgroup: "post",
                                side: "negative",
                            })
                        )
                ),
            ]),
            layout: {},
        };
    }

    Object.assign(ret.layout, {
        title: "log2 intensities pre- and post-imputation",
        yaxis: {
            automargin: true,
        },
    });
    return ret;
}

async function makePrePostImputationBoxplot({ samples, conditions }) {
    const makeBoxplotTrace = (trace) => {
        return Object.assign(trace, {
            type: "box",
        });
    };

    let ret = { data: [], layout: {} };
    if (samples != undefined && conditions == undefined) {
        ret = {
            data: await Promise.all([
                ...samples.map((sample) =>
                    worker
                        .getData(
                            `LFQ intensity ${sample}`,
                            MSExperiment.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION
                        )
                        .then((data) =>
                            makeBoxplotTrace({
                                name: "pre",
                                y: data,
                                x0: sample,
                                legendgroup: "pre",
                            })
                        )
                ),
                ...samples.map((sample) =>
                    worker
                        .getData(
                            `LFQ intensity ${sample}`,
                            MSExperiment.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES
                        )
                        .then((data) =>
                            makeBoxplotTrace({
                                name: "post",
                                y: data,
                                x0: sample,
                                legendgroup: "post",
                            })
                        )
                ),
            ]),
            layout: {},
        };
    } else if (samples == undefined && conditions != undefined) {
        const replicates = await worker.getReplicates();
        ret = {
            data: await Promise.all([
                ...conditions.map((condition) =>
                    Promise.all(
                        replicates
                            .get(condition)
                            .map((sample) =>
                                worker.getData(
                                    `LFQ intensity ${sample}`,
                                    MSExperiment.SNAPSHOT_KEYS
                                        .MEDIAN_NORMALIZATION
                                )
                            )
                    )
                        .then((array) => array.flat())
                        .then((data) =>
                            makeBoxplotTrace({
                                name: "pre",
                                y: data,
                                x0: condition,
                                legendgroup: "pre",
                            })
                        )
                ),
                ...conditions.map((condition) =>
                    Promise.all(
                        replicates
                            .get(condition)
                            .map((sample) =>
                                worker.getData(
                                    `LFQ intensity ${sample}`,
                                    MSExperiment.SNAPSHOT_KEYS
                                        .IMPUTE_MISSING_VALUES
                                )
                            )
                    )
                        .then((array) => array.flat())
                        .then((data) =>
                            makeBoxplotTrace({
                                name: "post",
                                y: data,
                                x0: condition,
                                legendgroup: "post",
                            })
                        )
                ),
            ]),
            layout: {},
        };
    }

    Object.assign(ret.layout, {
        title: "log2 intensities pre- and post-imputation",
        xaxis: {
            automargin: true,
        },
        boxmode: "group",
        boxgap: -1,
        boxgroupgap: 0,
    });
    return ret;
}
