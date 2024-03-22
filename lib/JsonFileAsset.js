/**
 * Represents a JSON file asset and is responsible for loading the file.
 * Upon successful loading, the file's properties are assigned to this instance,
 * and the filepath and job references are removed.
 */
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
