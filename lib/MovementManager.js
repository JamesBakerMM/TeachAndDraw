import { Pen } from "./TeachAndDraw.js"
import { Entity } from "./Entity.js";
export class MovementManager {
    #pen;
    #fractionOfMovement;
    /**
     * @param {Pen} pen 
     */
    constructor(pen) {
        this.#pen = pen;
        this.#fractionOfMovement = 1;
    }
    handleMovement() {
        for (let entity of Entity.all) {
            entity.move(
                // this.#fractionOfMovement
            );
        }
    }
}

//Locks
Object.defineProperty(MovementManager.prototype, "handleMovement", {
    value: MovementManager.prototype.handleMovement,
    writable: false,
    configurable: false,
});
