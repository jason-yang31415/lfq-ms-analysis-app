// import { tsv } from "d3";
import { fromCSV } from "data-forge";
import MSExperiment from "./MSExperiment";
import { setCurrentExperiment } from "./CurrentExperiment";

/**
 * Parse MaxQuant proteinGroups.txt output and set current MSExperiment
 * @param {string} url url to MaxQuant proteinGroups.txt file
 */
export async function readMaxQuant(file) {
    // read file blob as string
    const tsvString = await new Response(file).text();
    // parse string to dataframe
    const data = fromCSV(tsvString)
        .setIndex("id")
        // add series "uniprotID" with first protein ID
        .generateSeries({
            uniprotID: (row) => row["Protein IDs"].split(";")[0],
        })
        // cast series "Potential contaminant" and "Reverse" to boolean
        .transformSeries({
            "Potential contaminant": (value) => value === "+",
            Reverse: (value) => value === "+",
        })
        .bake();

    // get names of samples from column names
    const samples = data
        .getColumns()
        .where((col) => col.name.startsWith("LFQ intensity "))
        .select((col) => col.name.split("LFQ intensity ")[1])
        .toArray();

    // make new MSExperiment object and set as current experiment
    const experiment = new MSExperiment(data, samples);
    setCurrentExperiment(experiment);
}
