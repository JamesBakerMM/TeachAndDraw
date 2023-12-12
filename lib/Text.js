const DEFAULT_SIZE = 12;
const DEFAULT_ALIGNMENT = "center";
const DEFAULT_BASELINE = "middle";
export class Text {
    #pen;
    #context;
    #colour;
    #size;
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(pen) {
        this.#pen = pen;
        this.#context = this.#pen.context;
        this.#size = DEFAULT_SIZE;
        this.alignment = DEFAULT_ALIGNMENT;
        this.baseline = DEFAULT_BASELINE;
        this.#context.textBaseline = DEFAULT_BASELINE;
    }
    /**
     * Sets or gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    set alignment(value) {
        if (value === "start") {
            // cant work out why its start setimes
            value = "left";
            console.warn(
                "converting start to left, something causing it to set back to start"
            );
        }
        const isNotValid =
            value !== "center" && value !== "left" && value !== "right";
        if (isNotValid) {
            throw Error(
                `invalid value for alignment you gave ${value}:${typeof value} valid values are: "center","left","right"`
            );
        }
        this.#context.textAlign = value;
        return this.#context.textAlign;
    }
    /**
     * gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    get alignment() {
        return this.#context.textAlign;
    }
    /**
     * Sets or gets the text baseline.
     * @param {string} [value] - The baseline setting ("top", "middle", "bottom").
     * @returns {string} The current text baseline.
     */
    set baseline(value) {
        const isNotValid =
            value !== "top" &&
            value !== "middle" &&
            value !== "bottom" &&
            value !== "alphabetic";
        if (isNotValid) {
            throw Error(
                `invalid value for baseline you gave ${value}:${typeof value} valid values are: "top","middle","bottom"`
            );
        }
        this.#context.textBaseline = value;
        return this.#context.textBaseline;
    }
    get baseline() {
        return this.#context.textBaseline;
    }
    isValidState(newState) {
        //validates newState has the 4 parameters required and they they are valid
        // console.warn("isValidState not yet impelemtened")
        return true;
    }
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        if (this.isValidState(newState) === false) {
            throw Error("invalid properties on given state!", newState);
        }
        this.alignment = newState.alignment;
        this.baseline = newState.baseline;
        this.size = newState.size;
        this.font = newState.font;
    }
    /**
     * Draws text on the canvas with optional word wrapping.
     * @param {number} x - The x-coordinate of the start of the text.
     * @param {number} y - The y-coordinate of the start of the text.
     * @param {string} content - The text content to draw.
     * @param {number} [maxWidth=0] - The maximum width for the text, causing it to wrap if exceeded. 
     *                               If 0 or not specified, no wrapping is applied.
     */
    draw(x, y, content, maxWidth = 0) {
        this.#pen.state.save();
        if (maxWidth > 0) {
            const words = content.split(" ");
            const lineHeight = this.#size;
            let line = "";

            for (let word of words) {
                const proposedLine = line + word + " "; //construct the new line
                const proposedLineFits=this.#context.measureText(proposedLine).width > maxWidth;
                if (proposedLineFits) {
                    this.#pen.context.fillText(line, x, y);
                    line = word + " ";
                    y +=lineHeight;
                } else {
                    line = proposedLine;
                }
            }

            // Draw the last line after loop exits
            this.#context.fillText(line, x, y);

        } else {
            this.#context.fillText(content, x, y);
        }

        this.#pen.state.load();
    }
    constrainX() {}
    constrainY() {}
    /**
     * Sets or gets the font size.
     * @param {string} [newSize] - The new size of the font.
     * @returns {string} The current font size.
     */
    set size(newSize) {
        if (Number.isFinite(newSize) === false) {
            throw new Error(
                `Font size must be a number. Received: ${newSize}:${typeof newSize}`
            );
        }
        // Assuming newSize is a string like "16px", "2em", etc.
        this.#context.font = `${newSize} ${this.getFontFamily()}`;
        this.#size = newSize;
        return this.#size;
    }
    get size() {
        return this.#size;
    }
    /**
     * Helper function to extract the font family from the current font setting.
     * @returns {string} The current font family.
     */
    getFontFamily() {
        return this.#context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }

    /**
     * Sets or gets the font family.
     * @param {string} [newFont] - The new font family.
     * @returns {string} The current font family.
     */
    set font(newFont) {
        const size = this.size; // Get current size before changing the font
        this.#context.font = `${size} ${newFont}`;
    }

    get font() {
        return this.#context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }
}
