import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Pen } from "./Pen.js";

/**
 * A class that represents a natively drawn button on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends Entity
 */
export class Button extends Entity {
    #pen;
    #up;
    #down;
    #lastFrameDrawn;
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
     * @throws {Error} If the x, y, w, or h values are not numbers.
     * @property {string} label - The text label of the button.
     * @property {string} style - The style of the button.
     * @property {string} border - The border colour of the button.
     * @property {string} textColour - The text colour of the button.
     * @property {string} background - The background colour of the button.
     * @property {string} secondaryColour - The secondary colour of the button.
     * @property {string} accentColour - The accent colour of the button.
     * @property {boolean} down - True if the button is currently being pressed.
     * @property {boolean} up - True if the button has just been released after being pressed.
     * @property {number} w - The width of the button.
     * @property {number} h - The height of the button.
     * @property {boolean} exists - True if the button exists.
     * @property {number} x - The x-coordinate of the button.
     * @property {number} y - The y-coordinate of the button.
     * @constructor
     */
    constructor(x, y, w, h, label = null, pen) {
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
        super(pen, x, y);
        this.#pen = pen;
        this.w = w;
        this.h = h;
        //state managment properties
        this.#up = false;
        this.#down = false;
        this.#lastFrameDrawn = 0;

        //appearance properties
        this.label = label || `E:${this.id}`;
        this.style = "default";
        this.border = "black";
        this.textColour = this.#pen.gui.textColour;
        this.background = this.#pen.gui.primaryColour;
        this.secondaryColour = this.#pen.gui.secondaryColour;
        this.accentColour = this.#pen.gui.accentColour;
    }

    /**
     * Returns true if the button is currently being pressed.
     * @returns {boolean}
     * @readonly
     */
    get down() {
        if (this.exists === false) {
            return false;
        }
        const buttonWasVisible =
            this.#lastFrameDrawn === this.#pen.frameCount - 1;
        // console.log("buttonWasVisible",buttonWasVisible);
        if (buttonWasVisible) {
            return false;
        }
        if (this.isHovered()) {
            this.#down = this.#pen.mouse.leftDown;
        } else {
            this.#down = false;
        }

        return this.#down;
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

    /**
     * Returns true if the button has just been released after being pressed.
     * @returns {boolean}
     * @readonly
     */
    get up() {
        if (this.exists === false) {
            return false;
        }
        // Check if the draw command is issued after logic
        // Prevents issues where button is non-responsive
        if (
            this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
            this.#lastFrameDrawn !== this.#pen.frameCount
        ) {
            return false;
        }
        if (this.isHovered()) {
            this.#up = this.#pen.mouse.leftReleased;
        } else {
            this.#up = false;
        }

        return this.#up;
    }

    /**
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set up(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }

    /**
     * Draws the button's decorative elements (if any).
     */
    drawDecorations() {
        switch (this.#pen.gui.theme) {
            case "retro":
                // Draw a white triangle bevel on the top left
                this.#pen.colour.fill = "white";
                this.#pen.stroke = "transparent";
                this.#pen.shape.polygon(
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
                this.#pen.colour.fill = this.secondaryColour;
                this.#pen.shape.polygon(
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
    drawIdle() {
        this.#pen.colour.fill = this.background;
        this.#pen.shape.rectangle(this.x, this.y, this.w - 5, this.h - 5);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
    }

    /**
     * Draws the button in a hovered state.
     */
    drawHover() {
        // this.#pen.text.bold = true;
        this.#pen.colour.fill = this.background;
        this.#pen.colour.stroke = "rgba(0,0,0,0.7)";
        this.#pen.shape.strokeDash=2;
        this.#pen.shape.rectangle(this.x, this.y, this.w - 6, this.h - 6);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
        this.#pen.shape.strokeDash=0;
    }

    /**
     * Draws the button in a pressed state.
     */
    drawDown() {
        // this.#pen.text.bold = true;
        this.#pen.colour.fill = this.secondaryColour;
        this.#pen.colour.stroke = this.border;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text._print(
            this.x,
            this.y,
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
    }

    /**
     * Returns true if the mouse is currently hovering over the button
     * @returns {boolean} - True if the mouse is hovering over the button
     */
    isHovered() {
        return Button.isInRect(
            this.#pen.mouse.x,
            this.#pen.mouse.y,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }

    /**
     * Draws the button to the canvas based on its current state.
     */
    draw() {
        this.#pen.state.save();
        this.#pen.state.reset();
        this.#lastFrameDrawn = this.#pen.frameCount;

        if (this.isHovered() && this.#pen.mouse.leftDown) {
            this.drawDown();
        } else if (this.isHovered()) {
            this.drawDecorations();
            this.drawHover();
        } else {
            this.drawDecorations();
            this.drawIdle();
        }
        this.#pen.state.load();
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
