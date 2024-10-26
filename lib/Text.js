import { Debug } from "./Debug.js";
import { Alignment } from "./Alignment.js";
import { Pen } from "./Pen.js";
//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

const DEFAULT_SIZE = 12;
const DEFAULT_BASELINE = "middle";
const DEFAULT_FONT = "sans-serif";
export class Text {
    #pen;
    #size;
    #font;
    #bold;
    #italic;
    #hyphenation;
    #customFonts;
    /**
     *
     * @param {Pen} pen
     */
    constructor(pen) {
        this.#pen = pen;

        //add alignment
        this.alignment = new Alignment();
        Object.defineProperty(this, "alignment", {
            value: new Alignment(),
            writable: false,
            configurable: false, // Prevents the property from being redefined or deleted
        });
        this.#size = DEFAULT_SIZE;
        this.#font = DEFAULT_FONT;
        this.#pen.context.textBaseline = DEFAULT_BASELINE;
        this.#bold = false;
        this.#italic = false;
        this.#hyphenation = true;
        this.#customFonts = [];
        Object.seal(this); //protect against accidental assignment;
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
     * @param {Object} newState - The new state to set.
     * @param {boolean} newState.textBold - Indicates if the text should be bold.
     * @param {boolean} newState.textHyphenation - Indicates if the text should be hyphenated.
     * @param {boolean} newState.textItalic - Indicates if the text should be italic.
     * @param {string} newState.textAlignmentX - The horizontal alignment of the text.
     * @param {string} newState.textAlignmentY - The vertical alignment of the text.
     * @param {number} newState.textSize - The size of the text.
     * @param {string} newState.textFont - The font of the text.
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
        if (this.#size !== newState.textSize) {
            this.#size = newState.textSize;
        }
        if (this.#font !== newState.textFont) {
            this.font = newState.textFont;
        }
    }
    get state() {
        return {
            bold: this.bold,
            hyphenation: this.hyphenation,
            italic: this.italic,
            alignmentX: this.alignment.x,
            alignmentY: this.alignment.y,
            size: this.#size,
            font: this.#font,
        };
    }
    /**
     * Draws text on the canvas. Supports optional word wrapping. INTERNAL - excludes debug drawing
     * @param {number} x - The x-coordinate where the text will be drawn.
     * @param {number} y - The y-coordinate where the text will be drawn.
     * @param {string} content - The text content to be drawn.
     * @param {number} [maxWidth=0] - The maximum width allowed for the text before wrapping.
     *                                If set to 0 or left unspecified, no wrapping is applied.
     * @returns {string | number} - Returns a string indicating if wrapping was applied, or the num of lines after wrapping.
     */
    _print(x, y, content, maxWidth = 0) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(maxWidth) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    maxWidth,
                    "maxWidth has to be a number"
                )
            );
        }
        if ((typeof content === "string") === false) {
            throw new Error(
                `The content given to print must be a string! You gave ${content}, ` +
                `which is a ${typeof content}.\nSearch for the JavaScript toString method, ` +
                `which changes other data types to strings.\n`
            );
        }

        //sync up the context with the alignment
        this.#pen.context.textAlign = this.alignment.x;
        this.#pen.context.textBaseline = this.alignment.y === "center" ? "middle" : this.alignment.y;

        if (maxWidth <= 0) {
            this.#pen.context.fillText(content, x, y);
            return "drawing text without wrap";
        }
        this.#pen.state.save();
        const words = content.split(" ");
        const lineHeight = this.#size;

        let line = "";
        let lines = [];
        for (let word of words) {
            const proposedLine = line + word; //construct the new line
            const needsToWrap =
                this.#pen.context.measureText(proposedLine).width > maxWidth;
            if (needsToWrap) {
                const singleLongWord = 
                    this.#pen.context.measureText(word).width > maxWidth;
                if (singleLongWord) { // Single word larger than max width
                    if (this.hyphenation) {
                        line = this._addHyphenatedLines(word, line, lines, maxWidth);
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
            this.#pen.context.fillText(lines[i], x, y + direction);
        }
    
        this.#pen.state.load();
        return lines.length;
    }
    /**
     * Draws text on the canvas. Supports optional word wrapping.
     * @param {number} x - The x-coordinate where the text will be drawn.
     * @param {number} y - The y-coordinate where the text will be drawn.
     * @param {string} content - The text content to be drawn.
     * @param {number} [maxWidth=0] - The maximum width allowed for the text before wrapping.
     *                                If set to 0 or left unspecified, no wrapping is applied.
     * @returns {string} - Returns a string indicating whether wrapping was applied.
     */
    print(x, y, content, maxWidth = 0) {
        const numOfLines = this._print(x, y, content, maxWidth);
        if (this.#pen.debug) {
            if (maxWidth <= 0) {
                Debug.drawText(this.#pen, x, y, content, maxWidth);
                return "No wrapping applied";
            } else {
                Debug.drawText(this.#pen, x, y, content, maxWidth, numOfLines);
                return `Wrapping applied. ${numOfLines} lines generated.`
            }
        }
    }
    /**
     * Recursive function that will add hyphenated split words to the lines array until
     * it can fit inside the max width given.
     * @param {string} word - The too-large word that needs to be hyphenated
     * @param {string} line - The line previously being tested
     * @param {string[]} lines - The array of lines for the textbox. Is mutated by this function
     * @param {number} maxWidth - The max width given to the text, where it needs to fit inside
     * @returns {string} - The newest line value. Will continue calling itself until reaching a line value.
     */
    _addHyphenatedLines(word, line, lines, maxWidth) {
        let firstHalf = word;
        let secondHalf = "";
        let canFitOnLine = true;
        while (this.#pen.context.measureText(line + firstHalf + "-").width > maxWidth) {
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
        if (this.#pen.context.measureText(secondHalf).width > maxWidth) {
            return this._addHyphenatedLines(secondHalf, "", lines, maxWidth);
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
        this.#pen.context.font = this.#constructFont();
        return;
    }
    get size() {
        return this.#size;
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
        if (this.#pen.text.customFonts.includes(newFont)) {
            this.#font = `${newFont}, Webdings`;
        }
        // Use #constructFont to get the complete font string
        const fontSetting = this.#constructFont();
        this.#pen.context.font = fontSetting;
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
        this.#pen.context.font = this.#constructFont();
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
        this.#pen.context.font = this.#constructFont();
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
