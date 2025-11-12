import { Tad } from "./TeachAndDraw.js";
import { Stamp } from "./Img.js";
import { Paint } from "./Paint.js";
import { Vector } from "./Vector.js";

/**
 * Manages the loading and drawing of assets to ensure they are fully loaded before use.
 */
export class AssetManager {
    #tad;
    #loaded;
    /**
     * Creates an instance of AssetManager.
     * @memberof AssetManager
     * @example
     * const assetManager = new AssetManager(pen);
     * assetManager.loadImg("img1", "path/to/img1.png");
     * assetManager.loadImg("img2", "path/to/img2.png");
     * assetManager.loadImg("img3", "path/to/img3.png");
     * assetManager.draw();
     * @param {Tad} tad - The drawing tool used for rendering the asset manager.
     * @property {Array<AssetJob>} jobs - The list of asset loading jobs.
     * @property {boolean} loaded - The loaded status of the asset manager.
     * @property {Pen} pen - The drawing tool used for rendering the asset manager.
     * @constructor
     */
    constructor(tad) {
        this.#tad = tad;
        /**
         * @type {AssetJob[]}
         */
        this.jobs = [];
        this.#loaded = false;
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * Holds a list of jobs, jobs are created in the relevant load function using ()=>{} to maintain scope
     */
    drawLoadingScreen() {
        this.#tad.state.save();
        let loaded = true;

        // this.#tad.colour.stroke = "none";
        this.#tad.text.alignment.x = "left";
        this.#tad.text.size = 16;
        this.#tad.text.font = "sans-serif";
        let x = this.#tad.text.size * 1;
        let y = this.#tad.text.size * 2;
        let jobsDone = 0;
        for (let job of this.jobs) {
            if (job.error) {
                loaded = false;
                this.#tad.text.colour = Paint.red;
                this.#tad.text._print(x, y - 3, "❌");
            } else if (job.completed === false) {
                loaded = false;
                this.#tad.text.colour = Paint.yellow;
                this.#tad.text._print(x, y - 3, "⏳");
            } else {
                jobsDone += 1;
                this.#tad.text.colour = Paint.green;
                this.#tad.text._print(x, y - 3, "✔️");
            }
            this.#tad.text._print(x + this.#tad.text.size * 2, y, job.filepath);
            y += this.#tad.text.size * 2;
            if (y > this.#tad.height - this.#tad.text.size * 2) {
                y = 50;
                x += this.#tad.width / 2 - this.#tad.text.size;
            }
        }
        this.#tad.text.colour = "white";
        if (this.jobs.length > 0) {
            const progressBarWidth = this.#tad.math.rescale(
                jobsDone,
                0,
                this.jobs.length,
                0,
                this.#tad.w
            );
            this.#tad.shape.alignment.x = "left";
            this.#tad.shape.alignment.y = "top";
            this.#tad.shape.border = "transparent";
            this.#tad.shape.colour = "black";
            this.#tad.shape.rectangle(0, 0, this.#tad.w, 20);
            this.#tad.shape.colour = "#008081";
            this.#tad.shape.rectangle(0, 0, progressBarWidth, 20);
            this.#tad.text._print(
                this.#tad.width / 2,
                10,
                `${jobsDone}/${this.jobs.length} 📁`
            );
        }
        this.#loaded = loaded;
        this.#tad.state.load();
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
