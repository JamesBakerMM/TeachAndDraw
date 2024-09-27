import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { AssetJob } from "./AssetManager.js";

export class FontFileAsset extends Array {
    /**
     * @param {string} filepath
     * @param {AssetJob} job
     */
    constructor(filepath, job) {
        super();
        this.filepath = filepath;
        this.job = job;
        this.completed = false;

        // Load the font file
        fetch(filepath)
            .then((response) => {
                const OK = 200;
                if (response.status !== OK) {
                    const errorMessage = ErrorMsgManager.loadFileFailed(
                        filepath,
                        "font"
                    );
                    throw new Error("Loading Font: " + errorMessage);
                } else {
                    this.completed = true;
                    job.finish();
                }
                return response;
            })
            .catch((error) => {
                console.error(error);
                job.error = error;
            });
    }
}
