import { DataFrame, Series } from "data-forge";
import jstat from "jstat";
import { pAdjust, ttest } from "./utils";
import * as Imputation from "./Imputation";

class MSExperiment {
    /**
     *
     * @param {DataFrame} data
     * @param {string[]} samples
     */
    constructor(data, samples) {
        this.data = data;
        this.rawData = data;
        this.samples = samples;

        /** @type {Map<string, DataFrame} */
        this.snapshots = new Map();

        /** @type {Map<string, string[]>} */
        this.replicates = new Map();

        /** @type {Map<string, Map<string, DataFrame>>} */
        this.comparisons = new Map();

        this.removeContaminants = this.removeContaminants.bind(this);
        this.logTransform = this.logTransform.bind(this);
        this.removeAllNaN = this.removeAllNaN.bind(this);
        this.setReplicates = this.setReplicates.bind(this);
    }

    static SNAPSHOT_KEYS = {
        REMOVE_CONTAMINANTS: "REMOVE_CONTAMINANTS",
        LOG_TRANSFORM: "LOG_TRANSFORM",
        MEDIAN_NORMALIZATION: "MEDIAN_NORMALIZATION",
        IMPUTE_MISSING_VALUES: "IMPUTE_MISSING_VALUES",
    };

    resetToSnapshot(key) {
        if (this.snapshots.has(key)) this.data = this.snapshots.get(key);
    }

    static COMMON_COLUMNS = ["id", "uniprotID", "gene"];

    static IMPUTATION_METHODS = {
        METHOD_31: "METHOD_31",
        METHOD_46: "METHOD_46",
        METHOD_47: "METHOD_47",
    };

    /**
     * Modifies `data` to remove entries with True for "Potential contaminant"
     * or "Reverse"
     */
    removeContaminants() {
        console.log("removing contaminants");
        this.data = this.data
            // filter by "Potential contaminant" and "Reverse"
            .where((row) => !row["Potential contaminant"] && !row["Reverse"])
            // keep only common columns and "LFQ intensity ..." columns
            .subset([
                ...MSExperiment.COMMON_COLUMNS,
                ...this.samples.map((sample) => `LFQ intensity ${sample}`),
            ])
            .bake();

        this.snapshots.set(
            MSExperiment.SNAPSHOT_KEYS.REMOVE_CONTAMINANTS,
            this.data
        );
    }

    /**
     * Modifies `data` with log2
     */
    logTransform() {
        console.log("log transforming");
        this.data = new DataFrame({
            columns: {
                // copy common columns from current dataframe
                ...MSExperiment.COMMON_COLUMNS.reduce(
                    (obj, column) =>
                        Object.assign(obj, {
                            [column]: this.data.getSeries(column),
                        }),
                    {}
                ),
                // log transform LFQ intensity columns
                ...this.samples.reduce(
                    (obj, sample) =>
                        Object.assign(obj, {
                            [`LFQ intensity ${sample}`]: this.data
                                .getSeries(`LFQ intensity ${sample}`)
                                .select((value) =>
                                    // set to NaN if LFQ intensity is not
                                    // positive
                                    value > 0 ? Math.log2(value) : NaN
                                ),
                        }),
                    {}
                ),
            },
            index: this.data.getIndex(),
        }).bake();
    }

    /**
     * Modifies `data` to remove entries with NaN in all samples (i.e.
     * intensity of 0 in all samples)
     */
    removeAllNaN() {
        console.log("removing all NaN");
        this.data = this.data
            // only keep rows where not every sample is NaN
            .where(
                (row) =>
                    !this.samples.every((sample) =>
                        isNaN(row[`LFQ intensity ${sample}`])
                    )
            )
            .bake();

        this.snapshots.set(MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM, this.data);
    }

    /**
     * Modifies `data` such that each sample is scaled to have the same median
     * value, equal to the highest median pre-scaling.
     */
    normalizeMedians(normalize) {
        console.log("normalizing medians");

        if (!normalize) {
            this.snapshots.set(
                MSExperiment.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION,
                this.data
            );
            return;
        }

        // calculate medians of each sample and store in map
        /** @type {Map<string, number>} */
        const medians = new Map();
        this.samples.map((sample) =>
            medians.set(
                sample,
                this.data
                    .getSeries(`LFQ intensity ${sample}`)
                    .where((value) => !Number.isNaN(value))
                    .median()
            )
        );
        const maxMedian = Math.max.apply(null, Array.from(medians.values()));

        this.data = new DataFrame({
            columns: {
                // copy common columns from current dataframe
                ...MSExperiment.COMMON_COLUMNS.reduce(
                    (obj, column) =>
                        Object.assign(obj, {
                            [column]: this.data.getSeries(column),
                        }),
                    {}
                ),
                // median normalize LFQ intensity columns
                ...this.samples.reduce(
                    (obj, sample) =>
                        Object.assign(obj, {
                            [`LFQ intensity ${sample}`]: this.data
                                .getSeries(`LFQ intensity ${sample}`)
                                .select(
                                    // scale each sample intensity so that
                                    // sample median matches the maximum sample
                                    // median
                                    (value) =>
                                        (value * maxMedian) /
                                        medians.get(sample)
                                ),
                        }),
                    {}
                ),
            },
            index: this.data.getIndex(),
        }).bake();

        this.snapshots.set(
            MSExperiment.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION,
            this.data
        );
    }

    /**
     * Modifies `replicates` to store group replicate samples into conditions
     * @param {Object.<string, string[]>} replicates object containing
     * replicate data, where keys are condition names and values are arrays of
     * sample names
     */
    setReplicates(replicates) {
        this.replicates.clear();
        for (const [condition, samples] of Object.entries(replicates))
            this.replicates.set(condition, samples);
    }

    /**
     * Modifies `data` to replace NA's (intensity of 0) with imputed values.
     * Imputed values are drawn from a uniform distribution of log2 intensities
     * ranging from -3 * sigma to -2 * sigma among non-NA log2 intensity
     * values within the same sample.
     */
    imputeMissingValues(method) {
        console.log("imputing missing values");

        switch (method) {
            case MSExperiment.IMPUTATION_METHODS.METHOD_31:
                this.data = Imputation.imputeUniform(this.data, this.samples);
                break;
            case MSExperiment.IMPUTATION_METHODS.METHOD_46:
                this.data = Imputation.imputeRelative(
                    this.data,
                    this.replicates
                );
                break;
            case MSExperiment.IMPUTATION_METHODS.METHOD_47:
                this.data = Imputation.imputeRelative(
                    this.data,
                    this.replicates,
                    1
                );
        }

        this.snapshots.set(
            MSExperiment.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES,
            this.data
        );
    }

    /**
     * Makes specified comparisons and stores results in `comparisons.
     * @param {Object.<string, string[]>} comparisons object containing
     * comparisons to make, with condition A as key and condition B in values
     * array
     * @param {number} thresholdP threshold adjusted p value to call a protein
     * significant
     * @param {number} thresholdLogFC threshold log2 fold change in intensity
     * to call a protein significant
     * @param {number} thresholdReps threshold number of replicates detected in
     * the same condition to call a protein significant
     */
    makeComparisons(
        comparisons,
        { thresholdP = 0.05, thresholdLogFC = 1, thresholdReps = 2 } = {}
    ) {
        console.log("making comparisons");
        // loop through comparisons and set up `comparisons` map
        for (const [conditionA, value] of Object.entries(comparisons)) {
            if (!this.comparisons.has(conditionA))
                this.comparisons.set(conditionA, new Map());

            for (const conditionB of value) {
                // subset relevant columns of raw data to count number of
                // non-zero replicates later
                const rawA = this.rawData.subset(
                    this.replicates
                        .get(conditionA)
                        .map((sample) => `LFQ intensity ${sample}`)
                );
                const rawB = this.rawData.subset(
                    this.replicates
                        .get(conditionB)
                        .map((sample) => `LFQ intensity ${sample}`)
                );

                const comparisonData = DataFrame.zip(
                    [
                        // for conditionA and conditionB, zip LFQ intensity columns
                        // to make a column containing arrays of intensities from
                        // replicates for that condition
                        ...[conditionA, conditionB].map((condition) =>
                            DataFrame.zip(
                                this.replicates
                                    .get(condition)
                                    .map((sample) =>
                                        this.data.getSeries(
                                            `LFQ intensity ${sample}`
                                        )
                                    ),
                                // zip multiple replicate columns into single
                                // column containing array of values
                                (values) => values.toArray()
                            )
                        ),
                        // pass id as third item to zip
                        this.data.subset(["id"]),
                    ],
                    // zip conditionA and conditionB columns of arrays arrA and
                    // arrB
                    ([arrA, arrB, { id: rowId }]) => {
                        // calculate means of conditionA and conditionB
                        // intensities
                        const meanA = jstat(arrA).mean();
                        const meanB = jstat(arrB).mean();
                        // perform two-sample two-tailed t test (Welch) using
                        // arrays of intensities to get p value
                        const pvalue = ttest(arrA, arrB).p;

                        // count number of replicates detected in raw data in
                        // each condition
                        const countNonzeroReps = (raw) =>
                            Object.values(raw.at(rowId)).reduce((acc, val) => {
                                if (Number(val) !== 0) acc++;
                                return acc;
                            }, 0);

                        return {
                            [`mean ${conditionA}`]: meanA,
                            [`mean ${conditionB}`]: meanB,
                            "log FC": meanB - meanA,
                            "p value": pvalue,
                            [`N ${conditionA}`]: countNonzeroReps(rawA),
                            [`N ${conditionB}`]: countNonzeroReps(rawB),
                        };
                    }
                )
                    // copy common columns
                    .withSeries(
                        MSExperiment.COMMON_COLUMNS.reduce(
                            (obj, column) =>
                                Object.assign(obj, {
                                    [column]: this.data.getSeries(column),
                                }),
                            {}
                        )
                    )
                    .withIndex(this.data.getIndex())
                    .bake()
                    // calculate adjusted p value
                    .withSeries({
                        "adjusted p value": (df) =>
                            new Series({
                                index: df.getIndex(),
                                values: pAdjust(
                                    df.getSeries("p value").toArray()
                                ),
                            }),
                    })
                    .bake()
                    // check significance by p value, log FC, and replicates
                    // detected
                    .select((row) => {
                        const output = { ...row };
                        output["significant"] =
                            row["adjusted p value"] <= thresholdP &&
                            Math.abs(row["log FC"]) >= thresholdLogFC &&
                            (row[`N ${conditionA}`] >= thresholdReps ||
                                row[`N ${conditionB}`] >= thresholdReps)
                                ? "yes"
                                : "no";
                        return output;
                    })
                    .bake();

                // put comparison dataframe into `comparisons` map
                this.comparisons
                    .get(conditionA)
                    .set(conditionB, comparisonData);
            }
        }
    }
}

export default MSExperiment;
