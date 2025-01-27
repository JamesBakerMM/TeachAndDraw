//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

/**
 * Represents a point in a 2D space with x and y coordinates.
 * Intended for internal library use only
 * private_internal
 */
export class Point {
    /**
     * The x-coordinate of the point.
     * private_internal
     */
    #x;

    /**
     * The y-coordinate of the point.
     * private_internal
     */
    #y;

    /**
     * Reference to the tad object.
     * private_internal
     */
    #tad;

    /**
     * Creates a Point instance.
     * @param {Tad} tad - The pen object associated with the point.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */
    constructor(tad, x, y) {
        this.#tad = tad;
        this.#x = x;
        this.#y = y;
        Object.preventExtensions(this); // Protect against accidental assignment
    }

    /**
     * Gets the x-coordinate of the point.
     * @returns {number} The x-coordinate.
     */
    get x() {
        return this.#x;
    }

    /**
     * Gets the y-coordinate of the point.
     * @returns {number} The y-coordinate.
     */
    get y() {
        return this.#y;
    }

    /**
     * Sets a new x-coordinate for the point.
     * @param {number} value - The new x-coordinate.
     */
    set x(value) {
        this.#x = value;
    }

    /**
     * Sets a new y-coordinate for the point.
     * @param {number} value - The new y-coordinate.
     */
    set y(value) {
        this.#y = value;
    }
}
