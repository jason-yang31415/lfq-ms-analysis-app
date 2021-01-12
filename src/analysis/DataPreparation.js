// import { tsv } from "d3";
import { fromCSV, DataFrame } from "data-forge";
import MSExperiment from "./MSExperiment";
import { setCurrentExperiment } from "./CurrentExperiment";

/**
 * Parse MaxQuant proteinGroups.txt output and set current MSExperiment
 * @param {Blob} file file (or blob) containing MaxQuant data
 */
export async function readMaxQuant(file) {
    // read file blob as string
    const tsvString = await new Response(file).text();
    // parse string to dataframe
    const table = fromCSV(tsvString).setIndex("id").bake();

    // get names of samples from column names
    const samples = table
        .getColumns()
        .where((col) => col.name.startsWith("LFQ intensity "))
        .select((col) => col.name.split("LFQ intensity ")[1])
        .toArray();

    // combine relevant columns into new dataframe
    const data = new DataFrame({
        columns: {
            // entry id
            id: table.getSeries("id"),
            // new series "uniprotID" with first protein ID
            uniprotID: table
                .getSeries("Protein IDs")
                .select((value) => value.split(";")[0]),
            // new series "gene" with first gene name
            gene: table
                .getSeries("Gene names")
                .select((value) => value.split(";")[0]),
            // LFQ intensity columns for each sample
            ...samples.reduce(
                (obj, sample) =>
                    Object.assign(obj, {
                        [`LFQ intensity ${sample}`]: table.getSeries(
                            `LFQ intensity ${sample}`
                        ),
                    }),
                {}
            ),
            // cast series "Potential contaminant" and "Reverse" to boolean
            "Potential contaminant": table
                .getSeries("Potential contaminant")
                .select((value) => value === "+"),
            Reverse: table
                .getSeries("Reverse")
                .select((value) => value === "+"),
        },
        index: table.getIndex(),
    }).bake();

    // make new MSExperiment object and set as current experiment
    const experiment = new MSExperiment(data, samples);
    setCurrentExperiment(experiment);
}
