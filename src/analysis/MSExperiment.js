import { DataFrame } from "data-forge";
import random from "random";

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

        this.removeContaminants = this.removeContaminants.bind(this);
        this.logTransform = this.logTransform.bind(this);
        this.removeAllNaN = this.removeAllNaN.bind(this);
        this.setReplicates = this.setReplicates.bind(this);
    }

    static SNAPSHOT_KEYS = {
        REMOVE_CONTAMINANTS: "REMOVE_CONTAMINANTS",
        LOG_TRANSFORM: "LOG_TRANSFORM",
        IMPUTE_MISSING_VALUES: "IMPUTE_MISSING_VALUES",
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
            // keep only "uniprotID" and "LFQ intensity ..." columns
            .subset([
                "id",
                "uniprotID",
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
        for (const sample of this.samples) {
            this.data = this.data
                // transform column by taking log2 or setting to NaN
                .transformSeries({
                    [`LFQ intensity ${sample}`]: (value) =>
                        value > 0 ? Math.log2(value) : NaN,
                })
                .bake();
        }

        this.snapshots.set(MSExperiment.SNAPSHOT_KEYS.LOG_TRANSFORM, this.data);
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
    imputeMissingValues() {
        console.log("imputing missing values");
        for (const sample of this.samples) {
            const series = this.data
                .getSeries(`LFQ intensity ${sample}`)
                .where((value) => !Number.isNaN(value))
                .bake();
            const mean = series.average();
            const stdev = series.std();

            this.data = this.data
                .transformSeries({
                    [`LFQ intensity ${sample}`]: (value) =>
                        Number.isNaN(value)
                            ? random.uniform(
                                  mean - 3 * stdev,
                                  mean - 2 * stdev
                              )()
                            : value,
                })
                .bake();
        }

        this.snapshots.set(
            MSExperiment.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES,
            this.data
        );
    }
}

export default MSExperiment;
