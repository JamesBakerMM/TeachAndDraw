/**
 * A simple class that represents a flipped state.
 */
export class Flip {
    #x;
    #y;
    /**
     * Creates an instance of Flip.
     * @memberof Flip
     * @example
     * const flip = new Flip();
     * flip.x = true;
     * flip.y = false;
     * @throws {Error} If the value is not a boolean.
     * @property {boolean} x - The x-axis flip value.
     * @property {boolean} y - The y-axis flip value.
     * @constructor
     */
    constructor() {
        this.#x = false;
        this.#y = false;
        Object.seal(this);
    }

    /**
     * Sets the x-axis flip if the value is valid, otherwise throws an error.
     * @param {boolean} value - The flip value to set for the x-axis.
     * @returns {boolean} The current x-axis flip value.
     * @throws {Error} If the value is not a boolean.
     */
    set x(value) {
        if (typeof value !== "boolean") {
            throw new Error("flip x needs to be given a boolean!");
        }
        this.#x = value;
    }

    /**
     * Gets the x-axis flip value.
     * @returns {boolean} The current x-axis flip value.
     */
    get x() {
        return this.#x;
    }

    /**
     * Sets the y-axis flip if the value is valid, otherwise throws an error.
     * @param {boolean} value - The flip value to set for the y-axis.
     * @returns {boolean} The current y-axis flip value.
     * @throws {Error} If the value is not a boolean.
     */
    set y(value) {
        if (typeof value !== "boolean") {
            throw new Error("flip y needs to be given a boolean!");
        }
        this.#y = value;
    }

    /**
     * Gets the y-axis flip value.
     * @returns {boolean} The current y-axis flip value.
     */
    get y() {
        return this.#y;
    }
}
