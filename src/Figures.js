import currentExperiment from "./analysis";
import MSExperiment from "./analysis/MSExperiment";

export const FIGURES = {
    PRE_POST_IMPUTATION_VIOLIN: "PRE_POST_IMPUTATION_VIOLIN",
};

export function makePlotlyDataLayout(options) {
    const { type } = options;

    let ret = { data: [], layout: {} };
    switch (type) {
        case FIGURES.PRE_POST_IMPUTATION_VIOLIN:
            ret = makePrePostImputationViolin(options);
            break;
    }
    ret.layout.autosize = true;

    return ret;
}

function makePrePostImputationViolin({ samples, conditions }) {
    const experiment = currentExperiment();
    const makeViolinTrace = (trace) => {
        return Object.assign(trace, {
            type: "violin",
            width: 3,
            points: "suspectedoutliers",
            jitter: 0.1,
        });
    };

    let ret = { data: [], layout: {} };
    if (samples != undefined && conditions == undefined) {
        ret = {
            data: [
                ...samples.map((sample) =>
                    makeViolinTrace({
                        name: "pre",
                        x: experiment.snapshots
                            .get(MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM)
                            .getSeries(`LFQ intensity ${sample}`)
                            .toArray(),
                        y0: sample,
                        legendgroup: "pre",
                        side: "positive",
                        pointpos: 0.1,
                    })
                ),
                ...samples.map((sample) =>
                    makeViolinTrace({
                        name: "post",
                        x: experiment.snapshots
                            .get(
                                MSExperiment.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES
                            )
                            .getSeries(`LFQ intensity ${sample}`)
                            .toArray(),
                        y0: sample,
                        legendgroup: "post",
                        side: "negative",
                        pointpos: -0.1,
                    })
                ),
            ],
            layout: {},
        };
    } else if (samples == undefined && conditions != undefined) {
        ret = {
            data: [
                ...conditions.map((condition) =>
                    makeViolinTrace({
                        name: "pre",
                        x: experiment.replicates
                            .get(condition)
                            .map((sample) =>
                                experiment.snapshots
                                    .get(
                                        MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM
                                    )
                                    .getSeries(`LFQ intensity ${sample}`)
                                    .toArray()
                            )
                            .flat(),
                        y0: condition,
                        legendgroup: "pre",
                        side: "positive",
                        pointpos: 0.1,
                    })
                ),
                ...conditions.map((condition) =>
                    makeViolinTrace({
                        name: "post",
                        x: experiment.replicates
                            .get(condition)
                            .map((sample) =>
                                experiment.snapshots
                                    .get(
                                        MSExperiment.SNAPSHOT_KEYS
                                            .IMPUTE_MISSING_VALUES
                                    )
                                    .getSeries(`LFQ intensity ${sample}`)
                                    .toArray()
                            )
                            .flat(),
                        y0: condition,
                        legendgroup: "post",
                        side: "negative",
                        pointpos: -0.1,
                    })
                ),
            ],
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
