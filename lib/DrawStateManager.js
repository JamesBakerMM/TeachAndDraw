import { Tad } from "./TeachAndDraw.js";

/**
 * Manages the drawing states for a given 'tad' object.
 * This class allows saving and restoring drawing states stored on a stack.
 */
export class DrawStateManager {
    #tad;
    /**
     * Creates an instance of DrawStateManager.
     * @param {Tad} tad - The tad object to manage drawing states for.
     * @property {DrawState[]} stack - The stack of drawing states.
     * @constructor
     */
    constructor(tad) {
        this.#tad = tad;

        /**
         * @type {DrawState[]}
         */
        this.stack = [];

        this.reset(); //reset program drawing state to initial state
    }

    /**
     * Stores the current drawing state in the stack, saves the current context state ff the canvas, and also checks if the stack is over 100 and issues a warning if so
     */
    save() {
        this.stack.push(new DrawState(this.#tad));
        this.#tad.context.save();
        if (this.stack.length > 100) {
            console.warn(
                "over 100 drawing states are saved currently this could cause performance impacts! check how often you are calling state.save() before you call state.load()"
            );
        }
    }

    /**
     * Restores the most recently saved drawing state from the stack.
     * @throws {Error} If no states are saved in the stack.
     */
    load() {
        if (this.stack.length <= 0) {
            throw new Error(
                "Tried to load a previous drawing state but none were saved? :("
            );
        }
        const newState = this.stack.pop();
        this.#tad.text.state = newState;
        this.#tad.shape.state = newState;
        this.#tad.colour.state = newState; //grab the last created state and remove it, use its values
        this.#tad.context.restore();
    }

    /**
     * Resets the drawing state to its default values.
     */
    reset() {
        this.#tad.shape.alignment.x = "center";
        this.#tad.shape.alignment.y = "center";
        this.#tad.shape.strokeWidth = 1;
        this.#tad.shape.strokeDash = 0;
        this.#tad.shape.rounding = 0;
        this.#tad.shape.rotation = 0;
        this.#tad.shape.movedByCamera = false;
        this.#tad.colour.fill = "white";
        this.#tad.colour.stroke = "white";

        this.#tad.text.bold = false;
        this.#tad.text.hyphenation = true;
        this.#tad.text.italic = false;
        this.#tad.text.alignment.x = "center";
        this.#tad.text.alignment.y = "center";
        this.#tad.text.maxWidth = null;
        this.#tad.text.size = 16;
        this.#tad.text.rotation = 0;
        this.#tad.text.movedByCamera = false;
    }
}

/**
 * Represents the state of a drawing at a given moment.
 * Stores properties related to colour, shape, and text.
 */
export class DrawState {
    /**
     * Creates an instance of DrawState.
     * @param {Tad} tad - The tad object to store the drawing state for.
     * @property {string} colourFill - The fill colour of the current state.
     * @property {string} colourStroke - The stroke colour of the current state.
     * @property {number} shapeStrokeWidth - The stroke width of the current state.
     * @property {"left" | "center" | "right"} shapeAlignmentX - The x-axis alignment of the current state.
     * @property {"left" | "center" | "right"} shapeAlignmentY - The y-axis alignment of the current state.
     * @property {number} shapeStrokeDash - The stroke dash of the current state.
     * @property {number} shapeRounding - The rounding radius applied to the corners of shapes.
     * @property {"left" | "center" | "right"} textAlignmentX - The x-axis alignment of the current state.
     * @property {"left" | "center" | "right"} textAlignmentY - The y-axis alignment of the current state.
     * @property {number} textMaxWidth - The max width of text drawn to the canvas before wrapping is applied.
     * @property {boolean} textBold - The bold property of the current state.
     * @property {boolean} textHyphenation - The hyphenation property of the current state.
     * @property {boolean} textItalic - The italic property of the current state.
     * @property {number} textSize - The text size of the current state.
     * @property {string} textFont - The text font of the current state.
     * @property {boolean} movedByCamera - Whether the object is moved by the camera.
     * @constructor
     */
    constructor(tad) {
        this.colourFill = tad.colour.fill;
        this.colourStroke = tad.colour.stroke;

        this.shapeStrokeWidth = tad.shape.strokeWidth;
        (this.shapeAlignmentX = tad.shape.alignment.x),
            (this.shapeAlignmentY = tad.shape.alignment.y),
            (this.shapeStrokeDash = 0);
        this.shapeRounding = tad.shape.rounding;
        this.shapeMovedByCamera = tad.shape.movedByCamera;

        this.textAlignmentX = tad.text.alignment.x;
        this.textAlignmentY = tad.text.alignment.y;
        this.textMaxWidth = tad.text.maxWidth;
        this.textBold = tad.text.bold;
        this.textHyphenation = tad.text.hyphenation;
        this.textItalic = tad.text.italic;
        this.textSize = 16;
        this.textFont = tad.text.font;
        this.textMovedByCamera = tad.text.movedByCamera;
    }
}
