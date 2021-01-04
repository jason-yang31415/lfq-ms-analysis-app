class MSExperiment {
    constructor(data, samples) {
        this.data = data;
        this.rawData = data;
        this.samples = samples;

        this.removeContaminants = this.removeContaminants.bind(this);
        this.logTransform = this.logTransform.bind(this);
    }

    removeContaminants() {}

    logTransform() {}
}

export default MSExperiment;
