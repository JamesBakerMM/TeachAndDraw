export class Sound {
    #pen
    constructor(pen){
        this.#pen=pen;
        this.context=new AudioContext();
        console.clear(""); //really unsure about this but I don't want students to have think about audioContexts we can just tell them that things are muted by default
    }
} 

export class AudioFile {

}

export class AudioWrapper {
    constructor(){
        
    }
}