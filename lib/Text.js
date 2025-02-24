import { Debug } from "./Debug.js";
import { Alignment } from "./Alignment.js";
import { Tad } from "./TeachAndDraw.js";
import {  DrawState } from "./DrawStateManager.js"
//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

const DEFAULT_SIZE = 12;
const DEFAULT_MAXWIDTH = null;
const DEFAULT_BASELINE = "middle";
const DEFAULT_FONT = "sans-serif";
export class Text {
    #tad;
    #rotation;
    #size;
    #maxWidth;
    #font;
    #bold;
    #italic;
    #hyphenation;
    /**
     * @type {string[]}
     */
    #customFonts=[];

    #position;
    #movedByCamera;

    /**
     *
     * @param {Tad} tad
     */
    constructor(tad) {
        this.#tad = tad;
        this.#rotation = 0;

        //add alignment
        this.alignment = new Alignment();
        Object.defineProperty(this, "alignment", {
            value: new Alignment(),
            writable: false,
            configurable: false, // Prevents the property from being redefined or deleted
        });
        this.#size = DEFAULT_SIZE;
        this.#maxWidth = DEFAULT_MAXWIDTH;
        this.#font = DEFAULT_FONT;
        this.#tad.context.textBaseline = DEFAULT_BASELINE;
        this.#bold = false;
        this.#italic = false;
        this.#hyphenation = true;
        this.#customFonts = [];

        this.#position = {x: 0, y: 0};
        this.#movedByCamera = true;

        Object.seal(this); //protect against accidental assignment;
    }
    get rotation() {
        const degreeReadjustedValue = this.#tad.math.unadjustDegreesFromZero(
            this.#rotation
        );
        return degreeReadjustedValue;
    }
    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Rotation must be a number!"
                )
            );
        }
        const degreeAdjustedValue =
            this.#tad.math.adjustDegressSoTopIsZero(value);
        this.#rotation = degreeAdjustedValue;
    }
    set movedByCamera(flag) {
        if (typeof flag !== "boolean") {
            throw Error("movedByCamera must be a boolean value!");
        }
        this.#movedByCamera = flag;
    }
    get movedByCamera() {
        return this.#movedByCamera;
    }
    /**
     * @param {number} x 
     */
    set x(x) {
        if (Number.isFinite(x) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(x, "x must be a finite number!")
            );
        }
        this.#position.x = x;
    }
    get x() {
        return this.#position.x;
    }
    /**
     * @param {number} y 
     */
    set y(y) {
        if (Number.isFinite(y) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(y, "y must be a finite number!")
            );
        }
        this.#position.y = y;
    }
    get y() {
        return this.#position.y;
    }

    #constructFont() {
        let styles = ``;
        if (this.#bold) {
            styles += ` bold`;
        }
        if (this.#italic) {
            styles += ` italic`;
        }

        styles = styles.trim();

        let size = `${this.#size}px`;

        const font = `${styles} ${size} ${this.#font}`;
        return font.trim();
    }

    /**
     * @param {DrawState} newState - The new state to set.
     */
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        this.bold = newState.textBold;
        this.hyphenation = newState.textHyphenation;
        this.italic = newState.textItalic;
        this.alignment.x = newState.textAlignmentX;
        this.alignment.y = newState.textAlignmentY;
        this.maxWidth = newState.textMaxWidth;
        if (this.#size !== newState.textSize) {
            this.#size = newState.textSize;
        }
        if (this.#font !== newState.textFont) {
            this.font = newState.textFont;
        }
        this.movedByCamera = newState.textMovedByCamera;
    }
    get state() {
        return {
            //@ts-expect-error
            bold: this.bold,
            hyphenation: this.hyphenation,
            italic: this.italic,
            alignmentX: this.alignment.x,
            alignmentY: this.alignment.y,
            maxWidth: this.maxWidth,
            size: this.#size,
            font: this.#font,
        };
    }

    /**
     * @param {number} x X-coordinate which to rotate about
     * @param {number} y Y-coordinate which to rotate about
     */
    #applyRotation(x, y) {
        this.#tad.context.translate(x, y);
        this.#tad.context.rotate((this.rotation * Math.PI) / 180);
        this.#tad.context.translate(-x, -y);
    }

    /**
     * Draws text on the canvas. Supports optional word wrapping. INTERNAL - excludes debug drawing
     * @param {number} x - The x-coordinate where the text will be drawn.
     * @param {number} y - The y-coordinate where the text will be drawn.
     * @param {string} content - The text content to be drawn.
     * @returns {string | number} - Returns a string indicating if wrapping was applied, or the num of lines after wrapping.
     */
    _print(x, y, content, maxWidth=this.#maxWidth) {
        //sync up the context with the alignment
        this.#tad.context.textAlign = this.alignment.x;
        this.#tad.context.textBaseline = this.alignment.y === "center" ? "middle" : this.alignment.y;

        if (maxWidth <= 0) {
            this.#tad.context.fillText(content, x, y);
            return "drawing text without wrap";
        }
        this.#tad.state.save();
        const words = content.split(" ");
        const lineHeight = this.#size;

        let line = "";
        let lines = [];
        for (let word of words) {
            const proposedLine = line + word; //construct the new line
            const needsToWrap =
                this.#tad.context.measureText(proposedLine).width > maxWidth;
            if (needsToWrap) {
                const singleLongWord = 
                    this.#tad.context.measureText(word).width > maxWidth;
                if (singleLongWord) { // Single word larger than max width
                    if (this.hyphenation) {
                        line = this._addHyphenatedLines(word, line, lines);
                    } else {
                        if (line === "") { // Prevent long word from creating blank line
                            lines.push(proposedLine.trim());
                            continue;
                        }
                        lines.push(line.trim());
                        line = word + " ";
                    }
                } else {
                    lines.push(line.trim());
                    line = word + " ";
                }
            } else {
                line = proposedLine + " ";
            }
        }
        lines.push(line.trim());

        for (let i = 0; i < lines.length; i++) {
            let direction = lineHeight * i;
            if (this.alignment.y === "bottom") {
                direction = -(lineHeight * (lines.length - 1 - i));
            }
            if (this.alignment.y === "center") {
                const totalHeight = lineHeight * lines.length;
                const adjustedY = i * lineHeight + lineHeight / 2;
                direction = - (totalHeight / 2) + adjustedY;
            }
            this.#tad.context.fillText(lines[i], x, y + direction);
        }

        this.#tad.state.load();
        return lines.length;
    }
    /**
     * Draws text on the canvas. Supports optional word wrapping.
     * @param {number} x - The x-coordinate where the text will be drawn.
     * @param {number} y - The y-coordinate where the text will be drawn.
     * @param {string} content - The text content to be drawn.
     *                                If set to 0 or left unspecified, no wrapping is applied.
     * @returns {string} - Returns a string indicating whether wrapping was applied.
     */
    print(x, y, content) {
        if (this.#movedByCamera) {
            x += this.#tad.camera.xOffset;
            y += this.#tad.camera.yOffset;
        }
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x must be a finite number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y must be a finite number!")
            );
        }
        if (typeof content !== "string") {
            throw new Error(
                `The content given to print must be a string! You gave ${content}, ` +
                `which is a ${typeof content}.\nSearch for the JavaScript toString method, ` +
                `which changes other data types to strings.\n`
            );       }
        if (Number.isFinite(this.#maxWidth) === false) {
            ErrorMsgManager.numberCheckFailed(this.#maxWidth, "maxWidth must be a finite number!")
        }

        this.#tad.context.save();
        this.#applyRotation(x, y);

        const numOfLines = this._print(x, y, content);
        if (this.#tad.debug) {
            if (this.#maxWidth <= 0) {
                Debug.drawText(this.#tad, x, y, content, this.#maxWidth);
                return "No wrapping applied";
            } else {
                Debug.drawText(this.#tad, x, y, content, this.#maxWidth, numOfLines);
                return `Wrapping applied. ${numOfLines} lines generated.`
            }
        }

        this.#tad.context.restore();
    }

    /**
     * Recursive function that will add hyphenated split words to the lines array until
     * it can fit inside the max width given.
     * @param {string} word - The too-large word that needs to be hyphenated
     * @param {string} line - The line previously being tested
     * @param {string[]} lines - The array of lines for the textbox. Is mutated by this function
     * @returns {string} - The newest line value. Will continue calling itself until reaching a line value.
     */
    _addHyphenatedLines(word, line, lines,) {
        let firstHalf = word;
        let secondHalf = "";
        let canFitOnLine = true;
        while (this.#tad.context.measureText(line + firstHalf + "-").width > this.#maxWidth) {
            secondHalf = firstHalf[firstHalf.length - 1] + secondHalf;
            firstHalf = firstHalf.slice(0, -1);
            if (firstHalf.length <= 0) { // None of the word can fit on the line
                canFitOnLine = false;
                break;
            }
        }
        if (canFitOnLine) {
            lines.push(line + firstHalf + "-");
        } else {
            lines.push(line + firstHalf);
        }

        line = secondHalf + " ";
        if (this.#tad.context.measureText(secondHalf).width > this.#maxWidth) {
            return this._addHyphenatedLines(secondHalf, "", lines);
        } else {
            return line;
        }
    }

    /**
     * Sets the font size for the text. The size must be a finite number.
     * @param {number} newSize - The new size of the font in pixels.
     * @returns {number} - Returns the given size
     * @throws {Error} Throws an error if the newSize is not a finite number.
     */
    set size(newSize) {
        if (Number.isFinite(newSize) === false) {
            throw new Error(
                `Font size must be a number. Received: ${newSize}:${typeof newSize}`
            );
        }
        this.#size = newSize;
        // Update the canvas context font with the new size
        this.#tad.context.font = this.#constructFont();
        return;
    }
    get size() {
        return this.#size;
    }

    /**
     * Sets the max width of text drawn to the canvas before wrapping is applied.
     * @param {number} width - The new max width in pixels.
     * @throws {Error} Throws an error if width is not a null or a finite number.
     */
    set maxWidth(width) {
        if (width !== null && Number.isFinite(width) === false) {
            throw new Error(
                `Max width size must be either null or a positive number. Received: ${width}:${typeof width}`
            );
        }
    
        if (width == null) {
            this.#maxWidth = 0;
        } else {
            this.#maxWidth = width;
        }
    }
    get maxWidth() {
        return this.#maxWidth;
    }

    /**
     * Sets or gets the font family.
     * @param {string} newFont - The new font family.
     * @returns {string} The current font family.
     */
    set font(newFont) {
        if (typeof newFont !== "string") {
            throw new Error(
                `Font property must be a string. Received: ${newFont}:${typeof newFont}`
            );
        }
        this.#font = newFont;

        // If a custom font, add Webdings as backup font
        if (this.#tad.text.customFonts.includes(newFont)) {
            this.#font = `${newFont}, Webdings`;
        }
        // Use #constructFont to get the complete font string
        const fontSetting = this.#constructFont();
        this.#tad.context.font = fontSetting;
    }
    get font() {
        return this.#font;
    }

    /**
     * Sets the bold style for the text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be bold.
     * @returns {boolean} current bold setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set bold(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                `Bold property must be a boolean. Received: ${value}:${typeof value}`
            );
        }
        this.#bold = value;
        // Update the canvas context font with the new style
        this.#tad.context.font = this.#constructFont();
        return;
    }
    get bold() {
        return this.#bold;
    }

    /**
     * Sets the italic style for the text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be italic.
     * @returns {boolean} current italic setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set italic(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                `Italic property must be a boolean. Received: ${value}:${typeof value}`
            );
        }
        this.#italic = value;
        // Update the canvas context font with the new style
        this.#tad.context.font = this.#constructFont();
        return;
    }
    get italic() {
        return this.#italic;
    }

    /**
     * Sets whether hyphenation occurs during too-long words in multiline text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be hyphenated. Default true.
     * @returns {boolean} current hyphenation setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set hyphenation(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                `Hyphenation property must be a boolean. Received: ${value}:${typeof value}`
            );
        }
        this.#hyphenation = value;
        return;
    }
    get hyphenation() {
        return this.#hyphenation;
    }

    /**
     * Array containing all the loaded custom fonts for the program. Readonly.
     * @returns {string[]} list of names of loaded custom fonts
     * @throws {Error} Throws error if attempting to set property.
     */
    set customFonts(value) {
        throw new Error(
            `The text customFonts property is readonly. It cannot be set. ` +
            `You may only add to the customFonts property using loadCustomFont.`
        );
    }
    get customFonts() {
        return [...this.#customFonts];
    }
    /**
     * Internal function for adding to the customFonts array
     * @param {string} font - The name of the font being added
     */
    _addCustomFont(font) {
        this.#customFonts.push(font);
    }
}

//Locks
Object.defineProperty(Text.prototype, "print", {
    value: Text.prototype.print,
    writable: false,
    configurable: false,
});
