import worker from "./AnalysisWorker";
import MSExperiment from "./analysis/MSExperiment";

export const FIGURES = {
    PRE_POST_IMPUTATION_VIOLIN: "PRE_POST_IMPUTATION_VIOLIN",
    PRE_POST_IMPUTATION_BOXPLOT: "PRE_POST_IMPUTATION_BOXPLOT",
    VOLCANO: "VOLCANO",
    P_VALUE_HISTOGRAM: "P_VALUE_HISTOGRAM",
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
        case FIGURES.VOLCANO:
            ret = await makeVolcanoPlot(options);
            break;
        case FIGURES.P_VALUE_HISTOGRAM:
            ret = await makePValueHistogram(options);
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
        xaxis: {
            title: "log2 intensity",
        },
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
        yaxis: {
            title: "log2 intensity",
        },
        boxmode: "group",
        boxgap: -1,
        boxgroupgap: 0,
    });
    return ret;
}

async function makeVolcanoPlot({ comparisons, highlightGenes }) {
    if (!comparisons) return { data: [], layout: {} };
    const highlightGeneSet = new Set(
        (highlightGenes || []).map((g) => g.toLowerCase())
    );
    return {
        data: [
            await Promise.all([
                worker.getComparisonData(comparisons, "log FC"),
                worker.getComparisonData(comparisons, "adjusted p value"),
                worker.getComparisonData(comparisons, "gene"),
            ]).then(([logfc, pvalues, genes]) => {
                return {
                    type: "scattergl",
                    mode: "markers",
                    x: logfc,
                    y: pvalues.map((p) => -1 * Math.log10(p)),
                    hovertext: genes,
                    marker: {
                        color: genes.map((g) =>
                            highlightGeneSet.has(g.toLowerCase()) ? 1 : 0
                        ),
                    },
                };
            }),
        ],
        layout: {
            title: `${comparisons[1]} vs. ${comparisons[0]}`,
            xaxis: {
                title: `log2 (${comparisons[1]} / ${comparisons[0]})`,
            },
            yaxis: {
                title: "-log10 (p_adjusted)",
            },
        },
    };
}

async function makePValueHistogram({ comparisons }) {
    if (!comparisons) return { data: [], layout: {} };
    return {
        data: [
            {
                type: "histogram",
                name: "p value",
                x: await worker.getComparisonData(comparisons, "p value"),
                opacity: 0.5,
                xbins: {
                    start: 0,
                    end: 1,
                    size: 0.025,
                },
            },
            {
                type: "histogram",
                name: "adjusted p value",
                x: await worker.getComparisonData(
                    comparisons,
                    "adjusted p value"
                ),
                opacity: 0.5,
                xbins: {
                    start: 0,
                    end: 1,
                    size: 0.025,
                },
            },
        ],
        layout: {
            title: `${comparisons[1]} vs. ${comparisons[0]} p values`,
            barmode: "overlay",
            xaxis: {
                title: "p",
            },
            yaxis: {
                title: "count",
            },
        },
    };
}
