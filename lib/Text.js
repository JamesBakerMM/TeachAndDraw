import { Debug } from "./Debug.js";
import {Alignment} from "./Alignment.js";
import {Colour} from "./Colour.js";
import { Pen } from "./Pen.js";
//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js";

const DEFAULT_SIZE = 12;
const DEFAULT_BASELINE = "middle";
const DEFAULT_FONT = "sans-serif";
export class Text {
    #pen;
    #size;
    #font
    #bold
    #italic
    /**
     *
     * @param {Pen} pen
     */
    constructor(pen) {
        this.#pen = pen; 

        //add alignment
        this.alignment=new Alignment();
        Object.defineProperty(this, 'alignment', {
            value: new Alignment(),
            writable: false, 
            configurable: false, // Prevents the property from being redefined or deleted
        });
        this.#size = DEFAULT_SIZE;
        this.#font=DEFAULT_FONT
        this.#pen.context.textBaseline = DEFAULT_BASELINE;
        this.#bold=false;
        this.#italic=false;
        Object.seal(this); //protect against accidental assignment;
    }
    #constructFont() {
        let styles=``
        if(this.#bold){ styles+=` bold`; }
        if(this.#italic){ styles+=` italic`; }

        styles=styles.trim();

        let size=``;
        size+=`${this.#size}px`;
        
        const font = `${styles} ${this.#size}px ${this.#font}`;
        return font.trim();
    }

    /**
        * @param {Object} newState - The new state to set.
        * @param {boolean} newState.textBold - Indicates if the text should be bold.
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
        this.bold=newState.textBold;
        this.italic=newState.textItalic;
        this.alignment.x = newState.textAlignmentX
        this.alignment.y = newState.textAlignmentY;
        if(this.#size!==newState.textSize){
            this.#size = newState.textSize;
        }
        if(this.#font!==newState.textFont){
            this.font = newState.textFont;
        }
    }
    get state(){
        return {
            bold:this.bold,
            italic:this.italic,
            alignmentX:this.alignment.x,
            alignmentY:this.alignment.y,
            size:this.#size,
            font:this.#font
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
    print(x, y, content, maxWidth = 0) {
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
        return
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
        this.#font = newFont;
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
        if (typeof value !== 'boolean') {
            throw new Error(`Bold property must be a boolean. Received: ${value}:${typeof value}`);
        }
        this.#bold = value;
        // Update the canvas context font with the new style
        this.#pen.context.font = this.#constructFont();
        return
    }  

    get bold(){
        return this.#bold
    }

    /**
     * Sets the italic style for the text. The value must be a boolean.
     * @param {boolean} value - Indicates whether the text should be italic.
     * @returns {boolean} current italic setting
     * @throws {Error} Throws an error if the value is not a boolean.
     */
    set italic(value) {
        if (typeof value !== 'boolean') {
            throw new Error(`Italic property must be a boolean. Received: ${value}:${typeof value}`);
        }
        this.#italic = value;
        // Update the canvas context font with the new style
        this.#pen.context.font = this.#constructFont();
        return
    }

    get italic(){
        return this.#italic
    }
}

//Locks
Object.defineProperty(Text.prototype, 'print', {
    value: Text.prototype.print,
    writable: false,
    configurable: false
});

