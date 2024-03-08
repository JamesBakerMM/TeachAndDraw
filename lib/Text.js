import { Debug } from "./Debug.js";
import {Alignment} from "./Alignment.js";
//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js";

const DEFAULT_SIZE = 12;
const DEFAULT_ALIGNMENT = "center";
const DEFAULT_BASELINE = "middle";
const DEFAULT_FONT = "sans-serif";
export class Text {
    #pen;
    #size;
    #fontForChecking
    #style
    #font
    #bold
    #italic
    /**
     *
     * @param {Object} pen
     * @param {Colour} colour
     */
    constructor(pen) {
        this.#pen = pen;
        Object.defineProperty(this, 'alignment', {
            value: new Alignment(),
            writable: false, 
            configurable: false, // Prevents the property from being redefined or deleted
        });
        this.#size = DEFAULT_SIZE;
        this.#fontForChecking=DEFAULT_FONT
        this.#pen.context.textBaseline = DEFAULT_BASELINE;
        this.#bold=false;
        this.#italic=false;
        this.#font="san-serif";
        Object.seal(this.alignment);
        Object.seal(this); //protect against accidental assignment;
    }
    #constructFont() {
        let styles=``
        if(this.#bold){ styles+=` bold`; }
        if(this.#italic){ styles+=` italic`; }

        styles=styles.trim();

        let size=``;
        size+=`${this.#size}px`;
        
        const font = `${styles} ${this.#size}px ${this.#fontForChecking}`;
        return font.trim();
    }

    /**
     * Validates if the provided state object has the required properties and they are valid.
     * @param {object} newState - The state object to validate.
     * @returns {boolean} - True if the state is valid, false otherwise.
     */
    isValidState(newState) {
        return (
            //add back in checks later on state for alignment values being valid have to expose alignment for this
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
        this.alignment.x = newState.alignment.x;
        this.alignment.y = newState.alignment.y;
        if(this.#size!==newState.size){
            this.#size = newState.size;
        }
        if(this.#fontForChecking!==newState.font){
            this.font = newState.font;
        }
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
        if (Number.isFinite(x)===false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x,"x has to be a number!")
            );
        }
        if(Number.isFinite(y)===false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y,"y has to be a number")
            );
        }
        if(Number.isFinite(maxWidth)===false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(maxWidth,"maxWidth has to be a number")
            );
        }
        
        //sync up the context with the alignment 
        this.#pen.context.textAlign = this.alignment.x;
        this.#pen.context.textBaseline = this.alignment.y   ;

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
                if(this.#pen.debug){
                    Debug.drawText(this.#pen,x,y,line);
                }
                this.#pen.context.fillText(line, x, y);
                line = word + " ";
                y += lineHeight;
            } else {
                line = proposedLine;
            }
        }

        if(this.#pen.debug){
            Debug.drawText(this.#pen,x,y,line);
        }
        this.#pen.context.fillText(line, x, y);

        this.#pen.state.load();
        return "drawing with wrap"
    }

    /**
     * Sets the font size for the text. The size must be a finite number.
     * @param {number} newSize - The new size of the font in pixels.
     * @returns {number} - Returns the given size
     * @throws {Error} Throws an error if the newSize is not a finite number.
     */
    set size(newSize) {
        if (Number.isFinite(newSize) === false) {
            throw new Error(`Font size must be a number. Received: ${newSize}:${typeof newSize}`);
        }
        this.#size = newSize;
        // Update the canvas context font with the new size
        this.#pen.context.font = this.#constructFont();
        return this.#size
    }
    get size() {
        return this.#size;
    }
    /**
     * Helper function to extract the font family from the current font setting.
     * @returns {string} The current font family.
     */
    getFontFamily() {
        const fontParts = this.#pen.context.font.split(" ");
        return this.#pen.context.font.replace(/\d+(px|pt|em|%)\s/, "");
    }

    /**
     * Sets or gets the font family.
     * @param {string} [newFont] - The new font family.
     * @returns {string} The current font family.
     */
    set font(newFont) {
        this.#fontForChecking = newFont;
        // Use #constructFont to get the complete font string
        const fontSetting = this.#constructFont();
        this.#pen.context.font = fontSetting;
    }

    get font() {
        return this.#fontForChecking;
    }

    /**
     * Sets the bold style for the text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be bold.
     * @returns {number} current bold setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set bold(value) {
        if (typeof value !== 'boolean') {
            throw new Error(`Bold property must be a boolean. Received: ${value}:${typeof value}`);
        }
        this.#bold = value;
        // Update the canvas context font with the new style
        this.#pen.context.font = this.#constructFont();
        return this.#bold
    }

    /**
     * Sets the italic style for the text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be italic.
     * @returns {number} current italic setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set italic(value) {
        if (typeof value !== 'boolean') {
            throw new Error(`Italic property must be a boolean. Received: ${value}:${typeof value}`);
        }
        this.#italic = value;
        // Update the canvas context font with the new style
        this.#pen.context.font = this.#constructFont();
        return this.#italic
    }
}
