//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

export class Velocity {
    /**
     * @type {number}
     */
    #x;

    /**
     * @type {number}
     */
    #y;

    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * @param {number} value 
     */
    set _perfX(value) {
        this.#x = value;
        return;
    }
    
    /**
     * @return {number}
     */
    get _perfX() {
        return this.#x;
    }

    /**
     * @param {number} value 
     */
    set _perfY(value) {
        this.#y = value;
        return;
    }

    /**
     * @returns {number}
     */
    get _perfY() {
        return this.#y;
    }

    /** @param {number} value */
    set x(value) {
        if (Number.isFinite(value)) {
            this.#x = value;
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value, "x has to be a number!")
        );
    }
    /**
     * @returns {number}
     */
    get x() {
        return this.#x;
    }
    /**
     * @param {number} value 
     */
    set y(value) {
        if (Number.isFinite(value)) {
            this.#y = value;
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value, "y has to be a number!")
        );
    }

    /**
     * @returns {number}
     */
    get y() {
        return this.#y;
    }
    
    /**
     * @param {number} mx 
     * @param {number} my 
     * @returns 
     */
    modify(mx, my) {
        this.x = this.#x + mx;
        this.y = this.#y + my;
        return;
    }
}

//Locks
Object.defineProperty(Velocity.prototype, "modify", {
    value: Velocity.prototype.modify,
    writable: false,
    configurable: false,
});
