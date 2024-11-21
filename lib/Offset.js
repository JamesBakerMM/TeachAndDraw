/**
 * Alignment class that controls and tracks valid values being set for x and y axis
 * Used in shape and text libs to ensure a consistent experience
 */
export class Offset {
    #x;
    #y;

    /**
     * Creates an instance of Alignment.
     * @memberof Object
     * @example
     * const offset = new Offset();
     * alignment.x =  64;
     * alignment.y = -32;
     * @throws {Error} If the x or y values are not a finite numbers.
     * @returns {Offset} An instance of Offset.
     * @property {number} x - The x-axis offset value.
     * @property {number} y - The y-axis offset value.
     * @constructor
     */
    constructor() {
        this.#x = 0;
        this.#y = 0;
        Object.seal(this);
    }

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

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

}
