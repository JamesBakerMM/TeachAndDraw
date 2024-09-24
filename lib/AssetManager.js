import { Pen } from "./Pen.js";
import { Stamp } from "./Img.js";

/**
 * Manages the loading and drawing of assets to ensure they are fully loaded before use.
 */
export class AssetManager {
    #pen;
    #loaded;
    jobs;
    /**
     * Creates an instance of AssetManager.
     * @memberof AssetManager
     * @example
     * const assetManager = new AssetManager(pen);
     * assetManager.loadImg("img1", "path/to/img1.png");
     * assetManager.loadImg("img2", "path/to/img2.png");
     * assetManager.loadImg("img3", "path/to/img3.png");
     * assetManager.draw();
     * @param {Pen} pen - The drawing tool used for rendering the asset manager.
     * @returns {AssetManager} An instance of AssetManager.
     * @property {Array<AssetJob>} jobs - The list of asset loading jobs.
     * @property {boolean} loaded - The loaded status of the asset manager.
     * @property {Pen} pen - The drawing tool used for rendering the asset manager.
     * @constructor
     */
    constructor(pen) {
        this.#pen = pen;
        this.jobs = [];
        this.#loaded = false;
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * Holds a list of jobs, jobs are created in the relevant load function using ()=>{} to maintain scope
     */
    draw() {
        this.#pen.state.save();
        let loaded = true;
        this.#pen.colour.stroke = "none";
        this.#pen.text.alignment.x = "left";
        this.#pen.text.size = 16;
        this.#pen.text.font = "sans-serif";
        let x = this.#pen.text.size * 1;
        let y = this.#pen.text.size * 2;
        for (let job of this.jobs) {
            if (job.error) {
                loaded = false;
                this.#pen.colour.fill = "red";
                this.#pen.text._print(x, y - 3, "❌");
            } else if (job.completed === false) {
                loaded = false;
                this.#pen.colour.fill = "yellow";
                this.#pen.text._print(x, y - 3, "⏳");
            } else {
                this.#pen.colour.fill = "green";
                this.#pen.text._print(x, y - 3, "✔️");
            }
            this.#pen.text._print(x + this.#pen.text.size * 2, y, job.filepath);
            y += this.#pen.text.size * 2;
            if (y > this.#pen.height - this.#pen.text.size * 2) {
                y = 50;
                x += this.#pen.width / 2 - this.#pen.text.size;
            }
        }
        this.#loaded = loaded;
        this.#pen.state.load();
    }

    /**
     * Returns the status of all import jobs
     * @returns {boolean} the status of all import jobs.
     */
    isLoaded() {
        return this.#loaded;
    }
}
/**
 * Represents a single asset loading job, tracking its completion status and associated file path.
 */
export class AssetJob {
    static id = 0;
    static getId() {
        AssetJob.id += 1;
        return AssetJob.id;
    }
    /**
     * Loads in an asset from a file path, tracking its completion status.
     * @param {string} filepath
     * @returns {AssetJob} An instance of AssetJob.
     */
    constructor(filepath) {
        this.id = AssetJob.getId();
        this.filepath = filepath;
        this.asset = null;
        this.error = null;
        this.completed = false;
    }
    /**
     * Marks the import job as completed.
     * @returns {boolean} The completion status of the job.
     */
    finish() {
        this.completed = true;
        return this.completed;
    }
}
