import jstat from "jstat";

/**
 * Calculates two-sample Welch's t-test (two tail).
 * @param {number[]} arr1 sample 1
 * @param {number[]} arr2 sample 2
 */
export function ttest(arr1, arr2) {
    const m1 = jstat(arr1).mean();
    const m2 = jstat(arr2).mean();
    const s1 = jstat(arr1).stdev(true);
    const s2 = jstat(arr2).stdev(true);
    const se = Math.sqrt(
        Math.pow(s1, 2) / arr1.length + Math.pow(s2, 2) / arr2.length
    );
    const df = Math.floor(
        Math.pow(
            Math.pow(s1, 2) / arr1.length + Math.pow(s2, 2) / arr2.length,
            2
        ) /
            (Math.pow(s1, 4) / (Math.pow(arr1.length, 2) * (arr1.length - 1)) +
                Math.pow(s2, 4) /
                    (Math.pow(arr2.length, 2) * (arr2.length - 1)))
    );
    const t = (m2 - m1) / se;
    const p = 2 * jstat.studentt.cdf(-Math.abs(t), df);
    return { t, p, df };
}

/**
 * Adjust p values using Benjamini-Hochberg method (FDR)
 * @param {number[]} pvalues array containing p values
 */
export function pAdjust(pvalues) {
    // enumerate indices for original order, then sort by p value
    const entries = pvalues
        .map((p, index) => {
            return { index, p };
        })
        .sort((a, b) => a.p - b.p);
    // calculate BH corrected p value
    for (let i = entries.length - 1; i >= 0; i--) {
        entries[i].padj = Math.min(
            1,
            Math.min(
                (entries.length * entries[i].p) / (i + 1),
                i < entries.length - 1 ? entries[i + 1].padj : 1
            )
        );
    }
    // use original order (sort by index) then return adjusted p values
    return entries.sort((a, b) => a.index - b.index).map((entry) => entry.padj);
}
