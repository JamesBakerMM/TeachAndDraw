export class JsonFileAsset {
    constructor(filepath, job) {
        this.filepath = filepath;
        this.job = job;

        //load
        fetch(filepath)
            .then((response) => response.json())
            .then((data) => {
                job.finish();

                //remove old properties
                delete this.filepath;
                delete this.job;
                Object.assign(this, data); //assign new properties
            })
            .catch((error) => {
                console.error("Error loading JSON file:", error);
                job.error = error;
            });
    }
}
