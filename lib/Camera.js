import {Entity} from "./Entity.js";

class Camera {
    #x
    #y
    #isActive
    #pen
    constructor(pen){
        this.#x=pen.w/2;
        this.#y=pen.h/2;
        this.#pen=pen;
        this.#isActive=true;
    }
    set isActive(value){
        if(typeof value === 'boolean'){
            ErrorMsgManager.booleanCheckFailed(value);
        }
        return this.#isActive
    }
    get isActive(){
        return this.#isActive
    }
    set x(value){
        if (Number.isFinite(value)===false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value,"x has to be a number!"));
        }
            //go through every entity
        //for each entity update its location
            //update it and its children to be marked them as moved for the current frame
        return this.#x;
    }
    get x(){
        return this.#x;
    }
    set y(value){
        if(Number.isFinite(value)===false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value,"y has to be a number"));
        }
        //go through every entity
            //for each entity update its location
                //update it and its children to be marked them as moved for the current frame
        return this.#y;
    }
    get y(){
        return this.#y;
    }
    
}