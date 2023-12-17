/**
 * Represents color settings for drawing, managing fill and stroke colors.
 */
export class Colour {
    #fill;
    #stroke;

    /**
     * Constructs a Colour instance with a given drawing context.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    constructor(context) {
        this.context = context;
        this.#fill = "#000000"; // default fill color
        this.#stroke = "#000000"; // default stroke color
    }

    /**
     * Gets the current fill color.
     *
     * @returns {string} The current fill color.
     */
    get fill() {
        return this.#fill;
    }

    /**
     * Sets a new fill color and updates the canvas context.
     *
     * @param {string} value - The new fill color.
     */
    set fill(value) {
        this.#fill = value;
        this.context.fillStyle = value;
    }

    /**
     * Gets the current stroke color.
     *
     * @returns {string} The current stroke color.
     */
    get stroke() {
        return this.#stroke;
    }

    /**
     * Sets a new stroke color and updates the canvas context.
     *
     * @param {string} value - The new stroke color.
     */
    set stroke(value) {
        this.#stroke = value;
        this.context.strokeStyle = value;
    }

    /**
     * Validates if the provided state object has valid fill and stroke properties.
     *
     * @param {object} newState - The state object to validate.
     * @returns {boolean} True if the state is valid, false otherwise.
     */
    isValidState(newState) {
        // Check if newState has fill and stroke properties and they are strings
        return (
            newState &&
            typeof newState.fill === 'string' &&
            typeof newState.stroke === 'string'
        );
    }

    /**
     * Sets the fill and stroke state of the Colour object.
     *
     * @param {object} newState - The new state to set.
     * @throws {Error} If newState is undefined or invalid.
     */
    set state(newState) {
        if (newState === undefined) {
            throw new Error("Undefined state given!");
        }
        if (!this.isValidState(newState)) {
            throw new Error("Invalid properties on given state!", newState);
        }
        this.fill = newState.fill;
        this.stroke = newState.stroke;
    }
}