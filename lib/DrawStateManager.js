/**
 * Manages the drawing states for a given 'pen' object.
 * This class allows saving and restoring drawing states stored on a stack.
 */
export class DrawStateManager {
    #pen;
    constructor(pen) {
        this.#pen = pen;
        this.stack = [];
        this.reset(); //reset program drawing state to initial state
    }

    /**
     * Stores the current drawing state in the stack, saves the current context state ff the canvas, and also checks if the stack is over 100 and issues a warning if so
     */
    save() {
        this.stack.push(new DrawState(this.#pen));
        this.#pen.context.save();
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
        this.#pen.text.state = newState;
        this.#pen.shape.state = newState;
        this.#pen.colour.state = newState; //grab the last created state and remove it, use its values
        this.#pen.context.restore();
    }

    /**
     * Resets the drawing state to its default values.
     */
    reset() {
            this.#pen.shape.alignment.x = "center";
            this.#pen.shape.alignment.y = "center";
            this.#pen.shape.strokeWidth = 1;
            this.#pen.shape.strokeDash = 0;
            
            this.#pen.colour.fill = "white";
            this.#pen.colour.stroke = "white";
            
            this.#pen.text.bold=false;
            this.#pen.text.italic=false;
            this.#pen.text.alignment.x = "center";
            this.#pen.text.alignment.y = "center";
            this.#pen.text.size = 16;
    }
}

/**
 * Represents the state of a drawing at a given moment.
 * Stores properties related to colour, shape, and text.
 */
export class DrawState {
    constructor(pen) {
        /**
         * Colour properties of the current state.
         * @type {{fill: string, stroke: string}}
         */
        this.colourFill=pen.colour.fill;
        this.colourStroke=pen.colour.stroke;

        /**
         * Shape properties of the current state.
         * @type {{strokeWidth: number, xAlignment: string, yAlignment: string, strokeDash: number}}
         */
        this.shapeStrokeWidth=pen.shape.strokeWidth;
        this.shapeAlignmentX=pen.shape.alignment.x,
        this.shapeAlignmentY=pen.shape.alignment.y,
        this.shapeStrokeDash=0;

        this.textAlignmentX=pen.text.alignment.x;
        this.textAlignmentY=pen.text.alignment.y;
        this.textBold=pen.text.bold;
        this.textItalic=pen.text.italic;
        this.textSize= 16;
        this.textFont= pen.text.font;
    }
}
