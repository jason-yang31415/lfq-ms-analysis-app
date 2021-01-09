import worker from "./AnalysisWorker";
import MSExperiment from "./analysis/MSExperiment";

export const FIGURES = {
    PRE_POST_IMPUTATION_VIOLIN: "PRE_POST_IMPUTATION_VIOLIN",
};

export async function makePlotlyDataLayout(options) {
    const { type } = options;

    let ret = { data: [], layout: {} };
    switch (type) {
        case FIGURES.PRE_POST_IMPUTATION_VIOLIN:
            ret = await makePrePostImputationViolin(options);
            break;
    }
    ret.layout.autosize = true;

    return ret;
}

async function makePrePostImputationViolin({ samples, conditions }) {
    const makeViolinTrace = (trace) => {
        return Object.assign(trace, {
            type: "violin",
            width: 3,
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
                            MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM
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
                                    MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM
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
