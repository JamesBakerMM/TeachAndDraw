const DEFAULT_SIZE = 12;
const DEFAULT_ALIGNMENT = "left";
const DEFAULT_BASELINE = "top";
export class Text {
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(context, colour) {
        this.context = context;
        this.colour = colour;
        this.size = DEFAULT_SIZE;
        this.alignment = DEFAULT_ALIGNMENT;
        this.baseline = DEFAULT_BASELINE;
    }
    /**
     * Sets or gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    set alignment(value) {
        const isNotValid =
            value !== "center" && value !== "left" && value !== "right";
        if (isNotValid) {
            throw Error(`invalid value for alignment you gave ${value}:${typeof value} valid values are: "center","left","right"`);
        }
        this.context.textAlign = value;
        return this.context.textAlign;
    }
    /**
     * Sets or gets the text alignment.
     * @param {string} [value] - The alignment setting ("center", "left", "right").
     * @returns {string} The current text alignment.
     */
    get alignment() {
        return this.context.textAlign;
    }
    /**
     * Sets or gets the text baseline.
     * @param {string} [value] - The baseline setting ("top", "middle", "bottom").
     * @returns {string} The current text baseline.
     */
    set baseline(value) {
        const isNotValid =
            value !== "top" && value !== "middle" && value !== "bottom";
        if (isNotValid) {
            throw Error(
                `invalid value for baseline you gave ${value}:${typeof value} valid values are: "top","middle","bottom"`
            );
        }
        this.context.textBaseline = value;
        return this.context.textBaseline;
    }
    get baseline() {
        return this.context.textBaseline;
    }
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        //if newState is valid
        this.size = newState.size;
        this.w = newState.w;
        this.h = newState.h;
        this.font = newState.font;
    }
    /**
     * Draws text on the canvas.
     * @param {number} x - The x-coordinate of the start of the text.
     * @param {number} y - The y-coordinate of the start of the text.
     * @param {string} content - The text content to draw.
     */
    draw(x, y, content) {
        this.context.fillText(content, x, y);
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
        this.context.font = `${newSize} ${this.getFontFamily()}`;
    }
    /**
     * Helper function to extract the font family from the current font setting.
     * @returns {string} The current font family.
     */
    getFontFamily() {
        return this.context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }

    /**
     * Sets or gets the font family.
     * @param {string} [newFont] - The new font family.
     * @returns {string} The current font family.
     */
    set font(newFont) {
        const size = this.size; // Get current size before changing the font
        this.context.font = `${size} ${newFont}`;
    }

    get font() {
        return this.context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }
}
