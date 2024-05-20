/**
 * Manages the loading and drawing of assets to ensure they are fully loaded before use.
 */
export class AssetManager {
    #pen;
    #loaded;
    constructor(pen) {
        this.#pen = pen;
        this.jobs = [];
        this.#loaded = false;
        Object.preventExtensions(this); //protect against accidental assignment;
    }
    //holds a list of jobs, jobs are created in the relevant load function using ()=>{} to maintain scope
    draw() {
        this.#pen.state.save();
        let loaded = true;
        this.#pen.colour.stroke = "none";
        this.#pen.text.alignment.x = "left";
        this.#pen.text.size = 16;
        let x = this.#pen.text.size*1;
        let y = this.#pen.text.size*2;
        for (let job of this.jobs) {
            if (job.error) {
                loaded = false;
                this.#pen.colour.fill = "red";
                this.#pen.text.print(x, y - 3,"❌")
            } else if (job.completed === false) {
                loaded = false;
                this.#pen.colour.fill = "yellow";
                this.#pen.text.print(x, y - 3,"⏳")
            } else {
                this.#pen.colour.fill = "green";
                this.#pen.text.print(x, y - 3,"✔️")
            }
            this.#pen.text.print(x + this.#pen.text.size*2, y, job.filepath);
            y += this.#pen.text.size * 2;
            if(y>this.#pen.height-this.#pen.text.size * 2){
                y=50;
                x+=this.#pen.width/2-this.#pen.text.size;
            }
        }
        this.#loaded = loaded;
        this.#pen.state.load();
    }
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
    constructor(filepath) {
        this.id = AssetJob.getId();
        this.filepath = filepath;
        this.asset;
        this.completed = false;
    }
    finish() {
        this.completed = true;
        return this.completed
    }
}
