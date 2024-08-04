import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Pen } from "./Pen.js";

export class Button extends Entity {
    #pen;
    #up;
    #down;
    #lastFrameDrawn;
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string | null} label
     * @param {Pen} pen
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
    set down(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }
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
    set up(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }
    adjustedLineY() {
        let textY = this.y;
        let textMaxW = this.w - this.w / (2 * this.#pen.text.size);
        if (this.#pen.context.measureText(this.label).width > textMaxW) {
            let subtract = Math.floor(
                this.#pen.context.measureText(this.label).width / textMaxW
            );
            textY = textY - subtract * 0.5 * this.#pen.text.size;
        }
        return textY;
    }
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
    drawIdle() {
        this.#pen.colour.fill = this.background;
        this.#pen.shape.rectangle(this.x, this.y, this.w - 5, this.h - 5);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text.print(
            this.x,
            this.adjustedLineY(),
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
    }
    drawHover() {
        // this.#pen.text.bold = true;
        this.#pen.colour.fill = this.background;
        this.#pen.colour.stroke = "black";
        this.#pen.shape.rectangle(this.x, this.y, this.w - 5, this.h - 5);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text.print(
            this.x,
            this.adjustedLineY(),
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
    }
    drawDown() {
        // this.#pen.text.bold = true;
        this.#pen.colour.fill = this.secondaryColour;
        this.#pen.colour.stroke = this.border;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text.print(
            this.x,
            this.adjustedLineY(),
            this.label,
            this.w - this.w / (2 * this.#pen.text.size)
        );
    }
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
     * @param {number} x
     * @param {number} y
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    static isInRect(x, y, centerX, centerY, width, height) {
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;
        return (
            x >= leftX && x <= leftX + width && y >= topY && y <= topY + height
        );
    }
}
