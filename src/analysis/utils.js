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
