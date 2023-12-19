import { Debug } from "./Debug.js";
const DEFAULT_SIZE = 12;
const DEFAULT_ALIGNMENT = "center";
const DEFAULT_BASELINE = "middle";
export class Text {
    #pen;
    #context;
    #size;
    #validAlignments
    #validBaseline
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(pen) {
        this.#pen = pen;
        this.#validAlignments=["start","center", "left", "right"];
        this.#validBaseline=["top", "middle", "bottom", "alphabetic"];
        this.#size = DEFAULT_SIZE;
        this.alignment = DEFAULT_ALIGNMENT;
        this.baseline = DEFAULT_BASELINE;
        this.#pen.context.textBaseline = DEFAULT_BASELINE;
    }
    /**
     * Sets or gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    set alignment(value) {
        if (value === "start") {
            // Handle specific case for "start"
            // console.warn("Converting 'start' to 'left', as 'start' is not a recognized alignment value.");
            value = "left";
            this.#pen.context.textAlign = value;
            return this.#pen.context.textAlign;
        }
        if (this.#validAlignments.includes(value)) {
            // Check if the value is one of the valid values
            this.#pen.context.textAlign = value;
            return this.#pen.context.textAlign;
        }
        throw new Error(
            `Invalid value for alignment. You provided "${value}". Valid values are: ${validValues.join(
                '", "'
            )}`
        );
    }
    /**
     * gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    get alignment() {
        return this.#pen.context.textAlign;
    }
    /**
     * Sets or gets the text baseline.
     * @param {string} [value] - The baseline setting ("top", "middle", "bottom").
     * @returns {string} The current text baseline.
     */
    set baseline(value) {
        if (this.#validBaseline.includes(value)) {
            this.#pen.context.textBaseline = value;
            return this.#pen.context.textBaseline;
        }
        throw Error(
            `invalid value for baseline you gave ${value}:${typeof value} valid values are: "top","middle","bottom"`
        );
    }
    get baseline() {
        return this.#pen.context.textBaseline;
    }
    /**
     * Validates if the provided state object has the required properties and they are valid.
     * @param {object} newState - The state object to validate.
     * @returns {boolean} - True if the state is valid, false otherwise.
     */
    isValidState(newState) {
        return (
            this.#validAlignments.includes(newState.alignment) &&
            this.#validBaseline.includes(newState.baseline) &&
            Number.isFinite(newState.size) &&
            typeof newState.font === 'string'
        );
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
     * Draws text on the canvas. Supports optional word wrapping.
     * @param {number} x - The x-coordinate where the text will start.
     * @param {number} y - The y-coordinate where the text will start.
     * @param {string} content - The text content to be drawn.
     * @param {number} [maxWidth=0] - The maximum width allowed for the text before wrapping. 
     *                                If set to 0 or left unspecified, no wrapping is applied.
     * @returns {string} - Returns a string indicating whether wrapping was applied.
     */
    draw(x, y, content, maxWidth = 0) {
        if(this.#pen.debug){
            Debug.drawText(this.#pen,x,y,content);
        }
        if (maxWidth <= 0) {
            this.#pen.context.fillText(content, x, y);
            return "drawing text without wrap"
        }
        this.#pen.state.save();
        const words = content.split(" ");
        const lineHeight = this.#size;
        let line = "";

        for (let word of words) {
            const proposedLine = line + word + " "; //construct the new line
            const needsToWrap =
                this.#pen.context.measureText(proposedLine).width > maxWidth;
            if (needsToWrap) {
                this.#pen.context.fillText(line, x, y);
                line = word + " ";
                y += lineHeight;
            } else {
                line = proposedLine;
            }
        }
        // Draw the last line after loop exits
        this.#pen.context.fillText(line, x, y);

        this.#pen.state.load();
        return "drawing with wrap"
    }

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
        this.#pen.context.font = `${newSize}px ${this.getFontFamily()}`;
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
        return this.#pen.context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }

    /**
     * Sets or gets the font family.
     * @param {string} [newFont] - The new font family.
     * @returns {string} The current font family.
     */
    set font(newFont) {
        const size = this.size; // Get current size before changing the font
        this.#pen.context.font = `${size} ${newFont}`;
    }

    get font() {
        return this.#pen.context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }
}
