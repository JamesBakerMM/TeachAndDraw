import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Tad } from "./TeachAndDraw.js";

/**
 * A class that represents a natively drawn button on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends Entity
 */
export class Button extends Entity {
    /**
     * @type {Tad}
     */
    #tad;
    /** @type {number} */
    #lastFrameDrawn;
    #hovered;
    #released;
    #down;
    /**
     * Creates an instance of Buttono on the canvas.
     * @example
     * const button = new Button(100, 100, 100, 50, "Click Me");
     * button.draw(); // Inside your update function.
     * @param {number} x - The x-coordinate of the button.
     * @param {number} y - The y-coordinate of the button.
     * @param {number} w - The width of the button.
     * @param {number} h - The height of the button.
     * @param {string | null} label - The text label of the button.
     * @param {Tad} tad - the pen instance bound to
     * @throws {Error} If the x, y, w, or h values are not numbers.
     * @property {string} label - The text label of the button.
     * @property {string} style - The style of the button.
     * @property {string} border - The border colour of the button.
     * @property {string} textColour - The text colour of the button.
     * @property {string} background - The background colour of the button.
     * @property {string} secondaryColour - The secondary colour of the button.
     * @property {string} accentColour - The accent colour of the button.
     * @property {boolean} down - True if the button is currently being pressed.
     * @property {boolean} released - True if the button has just been released after being pressed.
     * @property {number} w - The width of the button.
     * @property {number} h - The height of the button.
     * @property {boolean} exists - True if the button exists.
     * @property {number} x - The x-coordinate of the button.
     * @property {number} y - The y-coordinate of the button.
     * @constructor
     */
    constructor(x, y, w, h, label = null, tad) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false ||
            Number.isFinite(h) === false
        ) {
            throw Error(
                `You need to give numbers for x, y, w, and h.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n` +
                    `h: ${h}:${typeof h}\n`
            );
        }
        super(tad, x, y);
        this.#tad = tad;
        this.w = w;
        this.h = h;

        //state managment properties
        this.#hovered = false;
        this.#released = false;
        this.#down = false;

        //appearance properties
        this.label = label || `E:${this.id}`;
        this.style = "default";
        this.border = "black";
        this.textColour = this.#tad.gui.textColour;
        this.background = this.#tad.gui.primaryColour;
        this.secondaryColour = this.#tad.gui.secondaryColour;
        this.accentColour = this.#tad.gui.accentColour;
    }

    /**
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set hovered(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }

    /**
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set released(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }
    /**
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set down(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }

    get hovered() {
        return this.#hovered;
    }

    get released() {
        return this.#released;
    }

    get down() {
        return this.#down;
    }

    /**
     * Draws the button's decorative elements (if any).
     */
    #drawDecorations() {
        switch (this.#tad.gui.theme) {
            case "retro":
                // Draw a white triangle bevel on the top left
                this.#tad.colour.fill = "white";
                this.#tad.colour.stroke = "transparent";
                this.#tad.shape.polygon(
                    // Top Left
                    this.x - this.w / 2 + 1,
                    this.y - this.h / 2 + 1,
                    // Top Right
                    this.x + this.w / 2 - 1,
                    this.y - this.h / 2 + 1,
                    // Bottom Left
                    this.x - this.w / 2 + 1,
                    this.y + this.h / 2 - 1
                );
                // Draw a grey triangle bevel on the bottom right
                this.#tad.colour.fill = this.secondaryColour;
                this.#tad.shape.polygon(
                    // Top Right
                    this.x + this.w / 2 - 1,
                    this.y - this.h / 2 + 1,
                    // Bottom Right
                    this.x + this.w / 2 - 1,
                    this.y + this.h / 2 - 1,
                    // Bottom Left
                    this.x - this.w / 2 + 1,
                    this.y + this.h / 2 - 1
                );

                break;
            default:
            // Do nothing
        }
    }

    /**
     * Draws the button in an idle state.
     */
    #drawIdle() {
        this.#tad.colour.fill = this.background;
        this.#tad.shape.rectangle(this.x, this.y, this.w - 5, this.h - 5);
        this.#tad.colour.fill = this.textColour;
        this.#tad.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#tad.text.size)
        );
    }

    /**
     * Draws the button in a hovered state.
     */
    #drawHover() {
        // this.#pen.text.bold = true;
        this.#tad.colour.fill = this.background;
        this.#tad.colour.stroke = "rgba(0,0,0,0.7)";
        this.#tad.shape.strokeDash = 2;
        this.#tad.shape.rectangle(this.x, this.y, this.w - 6, this.h - 6);
        this.#tad.colour.fill = this.textColour;
        this.#tad.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#tad.text.size)
        );
        this.#tad.shape.strokeDash = 0;
    }

    /**
     * Draws the button in a pressed state.
     */
    #drawDown() {
        // this.#pen.text.bold = true;
        this.#tad.colour.fill = this.secondaryColour;
        this.#tad.colour.stroke = this.border;
        this.#tad.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#tad.colour.fill = this.textColour;
        this.#tad.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#tad.text.size)
        );
    }

    update() {
        super.update();
        this.#hovered = Button.isInRect(
            this.#tad.mouse.x,
            this.#tad.mouse.y,
            this.x,
            this.y,
            this.w,
            this.h
        );
        this.#released = this.#hovered && this.#tad.mouse.leftReleased;
        this.#down = this.#hovered && this.#tad.mouse.leftDown;
    }

    /**
     * Draws the button to the canvas based on its current state.
     */
    draw() {
        if (this.exists === false) {
            return;
        }

        this.#tad.state.save();
        this.#tad.state.reset();

        if (this.down) {
            this.#drawDown();
        } else if (this.hovered) {
            this.#drawDecorations();
            this.#drawHover();
        } else {
            this.#drawDecorations();
            this.#drawIdle();
        }

        this.#tad.state.load();
    }

    /**
     * Returns true if the given x and y coordinates are within the bounds of the button.
     * @param {number} x
     * @param {number} y
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     * @static
     */
    static isInRect(x, y, centerX, centerY, width, height) {
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;
        return (
            x >= leftX && x <= leftX + width && y >= topY && y <= topY + height
        );
    }
}
