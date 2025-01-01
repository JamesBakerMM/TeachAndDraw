import { ErrorMsgManager } from "./ErrorMessageManager.js";
/**
 * Offset class used for applying an (x, y) offset to entities.
 * Used in Stamp and MovingStamp.
 */
export class Offset {
    #x;
    #y;

    /**
     * Creates an instance of Offset.
     * @memberof Object
     * @example
     * const offset = new Offset();
     * offset.x =  64;
     * offset.y = -32;
     * @throws {Error} If the x or y values are not a finite numbers.
     * @property {number} x - The x-axis offset value.
     * @property {number} y - The y-axis offset value.
     * @constructor
     */
    constructor() {
        this.#x = 0;
        this.#y = 0;
        Object.seal(this);
    }

    /**
     * Set the x-axis value of the offset
     * @param {number} value - The alignment value to set for the y-axis.
     * @throws {Error} If the value is not a finite number.
     */
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Offset.x must be a number!"
                )
            );
        }
        this.#x = value;
    }

    /**
     * Set the y-axis value of the offset
     * @param {number} value - The alignment value to set for the y-axis.
     * @throws {Error} If the value is not a finite number.
     */
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Offset.y must be a number!"
                )
            );
        }
        this.#y = value;
    }

    /**
     * Gets the x-axis value of the offset.
     * @returns {number} The current x-axis offset value.
     */
    get x() {
        return this.#x;
    }

    /**
     * Gets the y-axis value of the offset.
     * @returns {number} The current y-axis offset value.
     */
    get y() {
        return this.#y;
    }

}
