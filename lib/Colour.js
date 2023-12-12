export class Colour {
    #fill;
    #stroke;
    constructor(context) {
        this.context = context;
        this.#fill = "#000000"; // default fill color
        this.#stroke = "#000000"; // default stroke color
    }

    get fill() {
        return this.#fill;
    }

    set fill(value) {
        this.#fill = value;
        this.context.fillStyle = value;
    }

    get stroke() {
        return this.#stroke;
    }

    set stroke(value) {
        this.#stroke = value;
        this.context.strokeStyle = value;
    }
    isValidState(newState){
        //validates newState has the 2 parameters required and they they are valid
        // console.warn("isValidState not yet impelemtened")
        return true
    }
    set state(newState) {
        if(newState===undefined){
            throw Error("undefined state given!");
        }
        if(this.isValidState(newState)===false){
            throw Error("invalid properties on given state!",newState)
        }
        this.fill=newState.fill
        this.stroke=newState.stroke
    }
}
