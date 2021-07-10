import worker from "./AnalysisWorker";
import MSExperiment from "./analysis/MSExperiment";

export const FIGURES = {
    LOG_VIOLIN: "LOG_VIOLIN",
    PRE_POST_IMPUTATION_VIOLIN: "PRE_POST_IMPUTATION_VIOLIN",
    PRE_POST_IMPUTATION_BOXPLOT: "PRE_POST_IMPUTATION_BOXPLOT",
    VOLCANO: "VOLCANO",
    P_VALUE_HISTOGRAM: "P_VALUE_HISTOGRAM",
};

export function makePlotCode(options) {
    const { type } = options;
    switch (type) {
        case FIGURES.LOG_VIOLIN:
            return makeLogViolin(options);
        case FIGURES.PRE_POST_IMPUTATION_VIOLIN:
            return makePrePostImputationViolin(options);
    }
}

export async function makePlotlyDataLayout(options) {
    const { type } = options;

    let ret = { data: [], layout: {} };
    switch (type) {
        case FIGURES.LOG_VIOLIN:
            ret = await makeLogViolin(options);
            break;
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

function makeLogViolin({ samples, conditions }) {
    let src = `
fig, ax = reset()
data = await get_from_analysis("data")
    `;

    if (samples != undefined && conditions == undefined) {
        src += `
samples = [${samples.map((x) => `"${x}"`).join()}]
x = data[lfq_col(samples)].values
filtered = [i[j] for i, j in zip(x.T, (~np.isnan(x)).T)]

ax.violinplot(filtered, vert=False)
ax.set_yticks(range(1, len(samples) + 1))
ax.set_yticklabels(samples)
ax.set_ylabel("sample")
ax.set_title("distribution of protein intensities by sample")
        `;
    } else if (samples == undefined && conditions != undefined) {
        src += `
conditions = [${conditions.map((x) => `"${x}"`).join()}]
replicates = await get_from_analysis("replicates")
x = [data[lfq_col(replicates[c])].values.flatten() for c in conditions]
filtered = [i[~np.isnan(i)] for i in x]

ax.violinplot(filtered, vert=False)
ax.set_yticks(range(1, len(conditions) + 1))
ax.set_yticklabels(conditions)
ax.set_ylabel("condition")
ax.set_title("distribution of protein intensities by condition")
        `;
    }

    src += `
ax.set_xlabel("$\\log_2$ intensity")
ax.invert_yaxis()
plt.tight_layout()
show()
    `;
    return src;
}

/* async function makeLogViolin({ samples, conditions }) {
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
            data: await Promise.all(
                samples.map((sample) =>
                    worker
                        .getData(
                            `LFQ intensity ${sample}`,
                            MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM
                        )
                        .then((data) =>
                            makeViolinTrace({
                                x: data,
                                y0: sample,
                                side: "positive",
                            })
                        )
                )
            ),
            layout: {},
        };
    } else if (samples == undefined && conditions != undefined) {
        const replicates = await worker.getReplicates();
        ret = {
            data: await Promise.all(
                conditions.map((condition) =>
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
                                x: data,
                                y0: condition,
                                side: "positive",
                            })
                        )
                )
            ),
            layout: {},
        };
    }

    Object.assign(ret.layout, {
        title: "log2 intensities",
        showlegend: false,
        xaxis: {
            title: "log2 intensity",
        },
        yaxis: {
            automargin: true,
        },
    });
    return ret;
} */

function makePrePostImputationViolin({ samples, conditions }) {
    let src = `
fig, ax = reset()
data = await get_from_analysis("data_normalized")
imputed = (await get_from_analysis("data_imputed"))[0]
    `;

    if (samples != undefined && conditions == undefined) {
        src += `
samples = [${samples.map((x) => `"${x}"`).join()}]
x = data[lfq_col(samples)].values
x_filtered = [i[j] for i, j in zip(x.T, (~np.isnan(x)).T)]
y = imputed[lfq_col(samples)].values
y_filtered = [i[j] for i, j in zip(y.T, (~np.isnan(y)).T)]

v1 = ax.violinplot(x_filtered, vert=False)
for b in v1["bodies"]:
    center = np.mean(b.get_paths()[0].vertices[:,1])
    b.get_paths()[0].vertices[:, 1] = np.clip(b.get_paths()[0].vertices[:,1], -np.inf, center)

v2 = ax.violinplot(y_filtered, vert=False)
for b in v2["bodies"]:
    center = np.mean(b.get_paths()[0].vertices[:,1])
    b.get_paths()[0].vertices[:, 1] = np.clip(b.get_paths()[0].vertices[:,1], center, np.inf)

ax.set_yticks(range(1, len(samples) + 1))
ax.set_yticklabels(samples)
ax.set_ylabel("sample")
ax.set_title("distribution of protein intensities by sample")
        `;
    } else if (samples == undefined && conditions != undefined) {
        src += `
conditions = [${conditions.map((x) => `"${x}"`).join()}]
replicates = await get_from_analysis("replicates")
x = [data[lfq_col(replicates[c])].values.flatten() for c in conditions]
x_filtered = [i[~np.isnan(i)] for i in x]
y = [imputed[lfq_col(replicates[c])].values.flatten() for c in conditions]
y_filtered = [i[~np.isnan(i)] for i in y]

v1 = ax.violinplot(x_filtered, vert=False)
for b in v1["bodies"]:
    center = np.mean(b.get_paths()[0].vertices[:,1])
    b.get_paths()[0].vertices[:, 1] = np.clip(b.get_paths()[0].vertices[:,1], -np.inf, center)

v2 = ax.violinplot(y_filtered, vert=False)
for b in v2["bodies"]:
    center = np.mean(b.get_paths()[0].vertices[:,1])
    b.get_paths()[0].vertices[:, 1] = np.clip(b.get_paths()[0].vertices[:,1], center, np.inf)

ax.set_yticks(range(1, len(conditions) + 1))
ax.set_yticklabels(conditions)
ax.set_ylabel("condition")
ax.set_title("distribution of protein intensities by condition")
        `;
    }

    src += `
ax.set_xlabel("$\\log_2$ intensity")
ax.invert_yaxis()
plt.tight_layout()
show()
    `;
    return src;
}

/* async function makePrePostImputationViolin({ samples, conditions }) {
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
                                line: {
                                    color: "#1f77b4",
                                },
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
                                line: {
                                    color: "#ff7f0e",
                                },
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
                                line: {
                                    color: "#1f77b4",
                                },
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
                                line: {
                                    color: "#ff7f0e",
                                },
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
} */

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
                                marker: {
                                    color: "#1f77b4",
                                },
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
                                marker: {
                                    color: "#ff7f0e",
                                },
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
                                marker: {
                                    color: "#1f77b4",
                                },
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
                                marker: {
                                    color: "#ff7f0e",
                                },
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
                worker.getComparisonData(comparisons, "significant"),
            ]).then(([logfc, pvalues, genes, significant]) => {
                return {
                    type: "scattergl",
                    mode: "markers",
                    x: logfc,
                    y: pvalues.map((p) => -1 * Math.log10(p)),
                    hovertext: genes,
                    marker: {
                        color:
                            highlightGeneSet.size === 0
                                ? significant.map((sig) =>
                                      sig === "yes" ? 1 : 0
                                  )
                                : genes.map((g) =>
                                      highlightGeneSet.has(g.toLowerCase())
                                          ? 1
                                          : 0
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
