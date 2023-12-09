export class AssetManager {
    #pen
    #loaded
    constructor(pen){
        this.#pen=pen;
        this.jobs=[]
        this.#loaded=false;
    }
    //holds a list of jobs, jobs are created in the relevant load function using ()=>{} to maintain scope
    draw(){
        let loaded=true;
        let x=50;
        let y=50;
        for(let job of this.jobs){
            if(job.completed===false){
                loaded=false
                const prevStroke=this.#pen.colour.stroke;
                const prevFill=this.#pen.colour.fill
                this.#pen.colour.fill="red";
                this.#pen.colour.stroke="none";
                this.#pen.shape.rectangle(x,y-3,10);
                this.#pen.colour.fill=prevFill;
                this.#pen.colour.stroke=prevStroke;
                console.log("not done")
            } else {
                const prevFill=this.#pen.colour.fill
                this.#pen.colour.fill="green";
                this.#pen.shape.oval(x,y-3,5);
                this.#pen.colour.fill=prevFill;
            }
            this.#pen.text.draw(x+30,y,job.filepath)
            y+=25;
        }
        this.#loaded=loaded;
    }
    isLoaded(){
        return this.#loaded
    }
}

export class AssetJob {    
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