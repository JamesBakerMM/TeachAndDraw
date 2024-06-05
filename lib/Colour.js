import {Paint} from "./Paint.js";

/**
 * Represents color settings for drawing, managing fill and stroke colors.
 */
export class Colour {
    #fill;
    #stroke;
    #pen;
    /**
     * Constructs a Colour instance with a given drawing context.
     */
    constructor(pen) {
        this.#pen=pen;
        this.#fill = Paint.clear; // default fill color
        this.#stroke = Paint.clear; // default stroke color
        Object.preventExtensions(this); //protect against accidental assignment;
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
        if(this.isValid(value)===false){
            throw new Error(`Given colour was not valid! ${value}:${typeof value}`);
        }
        if(Paint[value.toLowerCase()]){
            this.#fill=Paint[value.toLowerCase()];
            this.#pen.context.fillStyle = value;
            return this.#fill
        }
        this.#fill = value;
        this.#pen.context.fillStyle = value;
    }

    isValid(value){
        if(value===undefined){
            return false
        } 
        if (typeof value !== "string") {
            return false
        }
        return true
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
        if(Paint[value.toLowerCase()]){
            this.#stroke=Paint[value.toLowerCase()];
            this.#pen.context.strokeStyle = value;
            return this.#stroke
        }
        this.#stroke = value;
        this.#pen.context.strokeStyle = value;
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
        this.#fill = newState.colourFill;
        this.#stroke = newState.colourStroke;
    }
}