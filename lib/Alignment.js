/**
 * Alignment class that controls and tracks valid values being set for x and y axis
 * Used in shape and text libs to ensure a consistent experience
 */
export class Alignment {
    #x
    #y
    #validXValues;
    #validYValues;
    constructor(){
        this.#x="center";
        this.#y="center";
        this.#validXValues=new Set();
            this.#validXValues.add("center");
            this.#validXValues.add("left");
            this.#validXValues.add("right");

        this.#validYValues=new Set();
            this.#validYValues.add("center");
            this.#validYValues.add("top");
            this.#validYValues.add("bottom");
        Object.seal(this);
    }
    set x(value){
        if(typeof value !== 'string'){
            throw new Error("value given must be a string");
        }
        if(this.#validXValues.has(value)===false){
            throw new Error(
                `Invalid value for alignment.x You provided "${value}". Valid values are: ${this.#validXValues.join(
                    '", "'
                )}`
            );
        }
        this.#x=value;
        return this.#x
    } 
    get x(){
        return this.#x
    }
    set y(value){
        if(typeof value !== 'string'){
            throw new Error("value given must be a string");
        }
        if(this.#validYValues.has(value)===false){
            throw new Error(
                `Invalid value for alignment.y You provided "${value}". Valid values are: ${this.#validYValues.join(
                    '", "'
                )}`
            );
        }
        this.#y=value;
        return this.#y
    } 
    get y(){
        return this.#y
    }
}