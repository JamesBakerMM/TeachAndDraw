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

//Locks
Object.defineProperty(MovementManager.prototype, 'handleMovement', {
    value: MovementManager.prototype.handleMovement,
    writable: false,
    configurable: false
});