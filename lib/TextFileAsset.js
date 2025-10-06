import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { AssetJob } from "./AssetManager.js";
import { Group } from "./Group.js";

export class TextFile extends Group {
    /**
     * @param {string} filepath
     * @param {AssetJob} job
     */
    constructor(filepath, job) {
        super();
        this.name = filepath;
        this.filepath = filepath;
        this.job = job;
        this.completed = false;
        Group.all.push(new WeakRef(this));

        // Load the text file
        fetch(filepath)
            .then((response) => {
                const OK = 200;
                if (response.status !== OK) {
                    const errorMessage = ErrorMsgManager.loadFileFailed(
                        filepath,
                        "text"
                    );
                    throw new Error("Loading Text:" + errorMessage);
                }
                return response;
            })
            .then((response) => response.text())
            .then((text) => {
                const lines = text.split(/\r?\n/);
                for (let line of lines) {
                    this.push(line);
                }
                this.completed = true;
                job.finish();
            })
            .catch((error) => {
                console.error(error);
                job.error = error;
            });
    }

    get [Symbol.toStringTag]() {
        return "Group";
    }
}
