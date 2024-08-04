/**
 * Alignment class that controls and tracks valid values being set for x and y axis
 * Used in shape and text libs to ensure a consistent experience
 */
export class Alignment {
    #x;
    #y;
    #validXValues;
    #validYValues;

    /**
     * Creates an instance of Alignment.
     * @memberof Alignment
     * @example
     * const alignment = new Alignment();
     * alignment.x = "center";
     * alignment.y = "center";
     * @throws {Error} If the value is not a string or is not a valid x-axis alignment value.
     * @throws {Error} If the value is not a string or is not a valid y-axis alignment value.
     * @returns {Alignment} An instance of Alignment.
     * @property {string} x - The x-axis alignment value.
     * @property {string} y - The y-axis alignment value.
     * @property {"left" | "center" | "right"} validXValues - The valid x-axis alignment values.
     * @property {"left" | "center" | "right"} validYValues - The valid y-axis alignment values.
     * @constructor
     */
    constructor() {
        this.#x = "center";
        this.#y = "center";
        this.#validXValues = new Set();
        this.#validXValues.add("center");
        this.#validXValues.add("left");
        this.#validXValues.add("right");

        this.#validYValues = new Set();
        this.#validYValues.add("center");
        this.#validYValues.add("top");
        this.#validYValues.add("bottom");
        Object.seal(this);
    }

    /**
     * Sets the x-axis alignment if the value is valid, otherwise throws an error.
     * @param {"left" | "center" | "right"} value - The alignment value to set for the x-axis.
     * @returns {string} The current x-axis alignment value.
     * @throws {Error} If the value is not a string or is not a valid x-axis alignment value.
     */
    set x(value) {
        if (typeof value !== "string") {
            throw new Error(
                `value given must be a string you gave ${value}:${typeof value}`
            );
        }
        if (this.#validXValues.has(value) === false) {
            throw new Error(
                `Invalid value for alignment.x You provided "${value}". Valid values are: ${Array.from(
                    this.#validXValues
                ).join('", "')}`
            );
        }
        this.#x = value;
    }

    /**
     * Gets the x-axis alignment value.
     * @returns {string} The current x-axis alignment value.
     */
    get x() {
        return this.#x;
    }

    /**
     * Sets the y-axis alignment if the value is valid, otherwise throws an error.
     * @param {"bottom" | "center" | "top"} value - The alignment value to set for the y-axis.
     * @returns {string} The current y-axis alignment value.
     * @throws {Error} If the value is not a string or is not a valid y-axis alignment value.
     */
    set y(value) {
        if (typeof value !== "string") {
            throw new Error("value given must be a string");
        }
        if (this.#validYValues.has(value) === false) {
            throw new Error(
                `Invalid value for alignment.y You provided "${value}". Valid values are: ${Array.from(
                    this.#validYValues
                ).join('", "')}`
            );
        }
        this.#y = value;
    }

    /**
     * Gets the y-axis alignment value.
     * @returns {string} The current y-axis alignment value.
     */
    get y() {
        return this.#y;
    }
}
