import { tsv } from "d3";
import MSExperiment from "./MSExperiment";
import { setCurrentExperiment } from "./CurrentExperiment";

/**
 * Parse MaxQuant proteinGroups.txt output and set current MSExperiment
 * @param {string} url url to MaxQuant proteinGroups.txt file
 */
export async function readMaxQuant(url) {
    const data = await tsv(url, (row) => {
        const ret = {
            // set "uniprotID" as the first protein ID
            uniprotID: row["Protein IDs"].split(";")[0],
            // cast "Potential contaminant" and "reverse" to booleans
            "Potential contaminant": row["Potential contaminant"] === "+",
            Reverse: row["Reverse"] === "+",
        };
        for (const [key, value] of Object.entries(row)) {
            if (key.startsWith("LFQ intensity")) ret[key] = parseInt(value);
        }
        return ret;
    });
    // get sample names from column names that start with "LFQ Intensity"
    const samples = data.columns
        .filter((col) => col.startsWith("LFQ intensity "))
        .map((col) => col.split("LFQ intensity ")[1]);

    // make new MSExperiment object and set as current experiment
    const experiment = new MSExperiment(data, samples);
    setCurrentExperiment(experiment);
}
