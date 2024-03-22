/**
 * Manages the loading and drawing of assets to ensure they are fully loaded before use.
 */
export class AssetManager {
    #pen
    #loaded
    constructor(pen){
        this.#pen=pen;
        this.jobs=[]
        this.#loaded=false;
        Object.preventExtensions(this); //protect against accidental assignment;
    }
    //holds a list of jobs, jobs are created in the relevant load function using ()=>{} to maintain scope
    draw() {
        this.#pen.state.save();
        let loaded=true;
        let x=50;
        let y=50;
        for(let job of this.jobs){
            if(job.completed===false){
                loaded=false
                this.#pen.colour.fill="red";
                this.#pen.colour.stroke="none";
                this.#pen.shape.rectangle(x,y-3,10);
            } else {
                this.#pen.colour.fill="green";
                this.#pen.shape.oval(x,y-3,5);
            }
            this.#pen.text.print(x+30,y,job.filepath)
            y+=25;
        }
        this.#loaded=loaded;
        this.#pen.state.load();
    }
    isLoaded(){
        return this.#loaded
    }
}
/**
 * Represents a single asset loading job, tracking its completion status and associated file path.
 */
export class AssetJob{    
    static id = 0;
    static getId() {
        AssetJob.id += 1;
        return AssetJob.id;
    }
    constructor(filepath) {
        this.id=AssetJob.getId();
        this.filepath=filepath;
        this.asset;
        this.completed=false;
    }
    finish() {
        this.completed=true;
    }
}