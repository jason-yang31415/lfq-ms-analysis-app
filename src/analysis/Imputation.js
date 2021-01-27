import { DataFrame, Series } from "data-forge";
import random from "random";
import MSExperiment from "./MSExperiment";
import jstat from "jstat";
import { tuple } from "immutable-tuple";

/**
 * Do imputation from uniform distribution between sample mean - 3 * std to
 * mean - 2 * std
 * @param {DataFrame} data DataFrame containing intensity data
 * @param {string[]} samples names of samples
 */
export function imputeUniform(data, samples) {
    return new DataFrame({
        columns: {
            // copy common columns from current dataframe
            ...MSExperiment.COMMON_COLUMNS.reduce(
                (obj, column) =>
                    Object.assign(obj, {
                        [column]: data.getSeries(column),
                    }),
                {}
            ),
            // perform imputation on LFQ intensity columns
            ...samples.reduce((obj, sample) => {
                // compute mean and standard deviation of non-NaN log
                // intensity values for the sample
                const series = data
                    .getSeries(`LFQ intensity ${sample}`)
                    .where((value) => !Number.isNaN(value))
                    .bake();
                const mean = series.average();
                const stdev = series.std();
                obj[`LFQ intensity ${sample}`] = data
                    .getSeries(`LFQ intensity ${sample}`)
                    .select(
                        // replace NaN's with random values drawn from
                        // uniform distribution
                        (value) =>
                            Number.isNaN(value)
                                ? random.uniform(
                                      mean - 3 * stdev,
                                      mean - 2 * stdev
                                  )()
                                : value
                    );
                return obj;
            }, {}),
        },
        index: data.getIndex(),
    }).bake();
}

// minimum correlation
const MINIMUM_CORRELATION = 0.1;

/**
 * Do relative imputation in a single condition.
 * @param {DataFrame} data DataFrame containing the relevant sample columns
 * @param {string[]} samples names of samples in the same condition
 * @param {number} replicates threshold number of replicates; do not impute if
 * the protein is detected in fewer than `replicate` replicates
 */
function imputeConditionRelative(data, samples, replicates = 2) {
    // calculate Pearson correlation coefficient between non-NaN values of two
    // samples
    const corrCache = new Map();
    const corr = (s1, s2) => {
        // return calculated correlation if already in cache
        if (corrCache.has(tuple(s1, s2))) return corrCache.get(tuple(s1, s2));

        // get sample values as arrays
        const arr1 = data.getSeries(`LFQ intensity ${s1}`).toArray();
        const arr2 = data.getSeries(`LFQ intensity ${s2}`).toArray();
        // mask proteins with NaN in either sample: true if non-NaN in both
        const arrNaN = [...Array(arr1.length).keys()].map(
            (i) => !isNaN(arr1[i]) && !isNaN(arr2[i])
        );

        // calculate Pearson correlation coefficient
        let c = jstat.corrcoeff(
            // filter both arrays to only use proteins that are not NaN in both
            // samples
            arr1.filter((v, i) => arrNaN[i]),
            arr2.filter((v, i) => arrNaN[i])
        );
        // use a minimum value for correlation
        c = Math.max(isNaN(c) ? 0 : c, MINIMUM_CORRELATION);

        // put correlation in cache and return
        corrCache.set(tuple(s1, s2), c);
        return c;
    };

    // calculate distribution of deltas between two samples
    const deltaCache = new Map();
    const delta = (s1, s2) => {
        // return calculated mean and standard deviation on delta if already in
        // cache
        if (deltaCache.has(tuple(s1, s2))) return deltaCache.get(tuple(s1, s2));

        // get sample values as arrays
        const arr1 = data.getSeries(`LFQ intensity ${s1}`).toArray();
        const arr2 = data.getSeries(`LFQ intensity ${s2}`).toArray();
        // calculate array of deltas
        const deltas = jstat(
            // array of indices 0...N
            [...Array(arr1.length).keys()]
                // filter to get indices of proteins that are not NaN in both
                // samples
                .filter((i) => !isNaN(arr1[i]) && !isNaN(arr2[i]))
                // calculate delta for each index as difference / mean
                .map((i) => (arr1[i] - arr2[i]) / ((arr1[i] + arr2[i]) / 2))
        );
        // calculate mean and standard deviation of deltas
        const res = {
            mean: deltas.mean(),
            std: deltas.stdev(),
        };

        // put mean and standard deviation of deltas in cache and return
        deltaCache.set(tuple(s1, s2), res);
        return res;
    };

    // sort samples by number of NaN proteins, from lowest to highest (use this
    // array to get the reference sample with the most non-NaN proteins)
    const samplesByNumNotNaN = samples.sort(
        (a, b) =>
            data
                .getSeries(`LFQ intensity ${a}`)
                .select((val) => (isNaN(val) ? 1 : 0))
                .sum() -
            data
                .getSeries(`LFQ intensity ${b}`)
                .select((val) => (isNaN(val) ? 1 : 0))
                .sum()
    );

    const imputedRelative = data
        // do imputation for each protein
        .select((row) => {
            // count number of non-NaN replicates for this protein
            const numNotNaN = Object.values(row)
                .map((val) => (isNaN(val) ? 0 : 1))
                .reduce((acc, val) => acc + val);
            // only do imputation if protein is not NaN in >= `replicates`
            // replicates
            if (numNotNaN < replicates) return row;

            // get reference sample by looping through samples (sorted by
            // number of non-NaN proteins, starting with highest) and choosing
            // first sample that is not NaN for this protein
            let refSample;
            for (let s of samplesByNumNotNaN) {
                if (!isNaN(row[`LFQ intensity ${s}`])) {
                    refSample = s;
                    break;
                }
            }

            // get mean correlation between selected reference sample and all
            // samples which are NaN for this protein
            const meanCorr = jstat(
                samples
                    .filter(
                        (sample) =>
                            sample !== refSample &&
                            isNaN(row[`LFQ intensity ${sample}`])
                    )
                    .map((sample) => corr(sample, refSample))
            ).mean();

            // loop through all samples for this protein
            return samples.reduce((obj, sample) => {
                const val = row[`LFQ intensity ${sample}`];
                if (isNaN(val)) {
                    // if sample is NaN for this protein, do imputation by
                    // getting distribution of deltas between sample and the
                    // reference sample
                    const { mean: Dmean, std: Dstd } = delta(sample, refSample);
                    // draw new delta value from normal distribution
                    const Dnew = random.normal(
                        Dmean,
                        Dstd / (Math.sqrt(2) * meanCorr)
                    )();
                    // calculate new intensity value and put in new row
                    obj[`LFQ intensity ${sample}`] =
                        row[`LFQ intensity ${refSample}`] * Math.abs(1 + Dnew);
                } else {
                    // if sample is not NaN for this protein, copy over the
                    // value
                    obj[`LFQ intensity ${sample}`] = val;
                }
                return obj;
            }, {});
        })
        .bake();

    // do uniform imputation to fill in remaining NaN values
    const imputedUniform = imputeUniform(data, samples).subset(
        samples.map((sample) => `LFQ intensity ${sample}`)
    );

    return (
        imputedRelative
            // loop through rows of relative and uniform imputation results
            .zip(imputedUniform, (rowRel, rowUnif) => {
                // use relative imputed row if there are no NaN values
                const useRel = Object.values(rowRel).every(
                    (val) => !isNaN(val)
                );
                return useRel ? rowRel : rowUnif;
            })
            .bake()
    );
}

/**
 * Do two-step imputation strategy with relative imputation for proteins
 * detected in >= `replicate` replicates, and uniform imputation for proteins
 * detected in < `replicate` replicates.
 * @param {DataFrame} data DataFrame containing intensity data
 * @param {Map<string, string[]>} conditions map from each condition to array
 * of sample names of replicates
 * @param {number} replicates minimum number of replicates in which protein is
 * detected to use relative imputation
 */
export function imputeRelative(data, conditions, replicates = 2) {
    // store columns with imputated data
    const columnSpec = {};
    conditions.forEach((samples, condition, m) => {
        // do relative imputation for the samples of each condition
        const result = imputeConditionRelative(
            // pass only columns for samples of this condition
            data.subset(samples.map((sample) => `LFQ intensity ${sample}`)),
            samples,
            replicates
        );
        // store resulting columns in the columnSpec object
        for (const column of result.getColumns())
            columnSpec[column.name] = column.series;
    });

    return new DataFrame({
        columns: {
            // copy common columns from current dataframe
            ...MSExperiment.COMMON_COLUMNS.reduce(
                (obj, column) =>
                    Object.assign(obj, {
                        [column]: data.getSeries(column),
                    }),
                {}
            ),
            // imputed data columns
            ...columnSpec,
        },
        index: data.getIndex(),
    }).bake();
}
