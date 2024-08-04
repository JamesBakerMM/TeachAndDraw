import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { AssetJob } from "./AssetManager.js";

/**
 * Represents a JSON file asset and is responsible for loading the file.
 * Upon successful loading, the file's properties are assigned to this instance,
 * and the filepath and job references are removed.
 */
export class JsonFileAsset {
    /**
     * @param {string} filepath
     * @param {AssetJob} job
     */
    constructor(filepath, job) {
        this.filepath = filepath;
        this.job = job;

        //load
        fetch(filepath)
            .then((response) => {
                const OK = 200;
                if (response.status !== OK) {
                    throw new Error(
                        "Loading JSON:" +
                            ErrorMsgManager.loadFileFailed(
                                this.filepath,
                                "json"
                            )
                    );
                }
                return response;
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                job.finish();

                //remove old properties
                delete this.filepath;
                delete this.job;
                Object.assign(this, data); //assign new properties
            })
            .catch((error) => {
                console.error(error);
                job.error = error;
            });
    }
}
