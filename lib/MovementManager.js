import { Tad } from "./TeachAndDraw.js"
import { Entity } from "./Entity.js";
export class MovementManager {
    #tad;
    #fractionOfMovement;
    /**
     * @param {Tad} tad 
     */
    constructor(tad) {
        this.#tad = tad;
        this.#fractionOfMovement = 1;
    }
    handleMovement() {
        for (let entity of Entity.all) {
            entity.move();
        }
    }
}

//Locks
Object.defineProperty(MovementManager.prototype, "handleMovement", {
    value: MovementManager.prototype.handleMovement,
    writable: false,
    configurable: false,
});
