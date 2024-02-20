import {Entity} from "./Entity.js"
export class MovementManager {
    #pen
    constructor(pen){
        this.#pen=pen;
    }
    handleMovement(){
        for(let entity of Entity.all){
            entity.move();
        }
    }
}