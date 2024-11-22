import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { keys, Pen } from "./Pen.js";


/**
 * Not sure where to put these functions so I put them here for now.
 */
class TextAreaUtil {
	/**
	 * Find the first occurrence in chars that is NOT char.
	 * @param {String} char The character which is not being looked for.
	 * @param {number} idx The starting index.
	 * @param {number} direction Search direction. Either -1 or +1
	 * @param {Array<String>} chars The array of characters to search through.
	 * @returns {number} Index of first character that is not char.
	 */
	static findNotCharacter( char, idx, direction, chars ) {
		while (0 <= idx && idx <= chars.length-1) {
			if (chars[idx] != char) {
				if (direction == -1)
					return idx-1;
				else
					return idx;
			}
			idx += direction;
		}
		return Math.max(0, Math.min(idx, chars.length-1));
	}

	/**
	 * Find the first occurrence of char in chars.
	 * @param {String} char The character which is being looked for.
	 * @param {number} idx The starting index.
	 * @param {number} direction Search direction. Either -1 or +1
	 * @param {Array<String>} chars The array of characters to search through.
	 * @returns {number} Index of first character that is char.
	 */
	static findCharacter( char, idx, direction, chars ) {
		while (0 <= idx && idx <= chars.length-1) {
			if (chars[idx] == char) {
				if (direction == -1)
					return idx + 1;
				else
					return idx;
			}
			idx += direction;
		}
		return Math.max(0, Math.min(idx, chars.length));
	}
}


/**
 * Stores the staate of a TextArea. Used for undo/redo functionality.
 */
class TextAreaState {
	chars 		  = [];
	cursorIndex   = 0
	selStartIndex = 0;
	selEndIndex   = 0;

	constructor( chars, cursor, left, right )
	{
		this.chars 		   = chars.slice();
		this.cursorIndex   = cursor;
		this.selStartIndex = left;
		this.selEndIndex   = right;
	}

	/**
	 * 
	 * @param {TextAreaState} state 
	 * @returns {boolean}
	 */
	is_same( state )
	{
		const c0 = this.chars.length != state.chars.length;
		const c1 = this.cursorIndex != state.cursorIndex;
		const c2 = this.selStartIndex != state.selStartIndex;
		const c3 = this.selEndIndex != state.selEndIndex;
	
		if (c0 || c1 || c2 || c3) {
			return false;
		}

		for (let i=0; i<this.chars.length; i++) {
			if (this.chars[i] != state.chars[i]) {
				return false;
			}
		}
	
		return true;
	}
}


/**
 * A class that represents a natively drawn text area on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class TextArea extends ShapedAssetEntity {
    #pen;
    #lastFrameDrawn;
    #name;
	#chars;
	#cursorIndex;
	#cursorVisible;
	#arrowHoldDelay;
	#borderWidth;
	#padding;
	#focused;
	#startIndex;
	#endIndex;
	#characterLimit;
	#selStartIndex;
	#selEndIndex;
	#keyTimers;
	#keyHoldDelay;
	#keySelectionIndex;
	#undo_history;
	#redo_history;

    /**
     * Creates an instance of TextArea.
     * @param {number} x - The x-coordinate of the text area.
     * @param {number} y - The y-coordinate of the text area.
     * @param {number} w - The width of the text area.
     * @param {string[]} options - The array of options in the text area, as strings.
	 * @param {Pen} pen - An instance of the Pen class.
     * @throws {Error} If the x, y, or w values are not numbers.
     * @property {string} style - The style of the text area.
     * @property {string} background - The background colour of the text area.
     * @property {string} border - The border colour of the text area.
     * @property {string} secondaryColour - The secondary colour of the text area.
     * @property {string} accentColour - The accent colour of the text area (arrow colour).
	 * @property {string} textColour - The text colour of the text area text.
     * @property {number} w - The width of the text area.
     * @property {number} h - The height of the text area.
     * @property {boolean} exists - True if the text area exists.
     * @property {number} x - The x-coordinate of the text area.
     * @property {number} y - The y-coordinate of the text area.
	 * @property {number} arrowHoldDelay - The duration the arrow key needs to be held (in frames) before the scrolling starts.
	 * @property {string} name - The name given to the text area.
	 * @property {number} value - The current text of the text area.
     * @property {number} index - The index of the currently selected option.
	 * @property {string[]} chars - The array containing the text of the text area, split into characters.
	 * @property {number} cursorIndex - The index in the chars array where the cursor is. 0 is before the first char
	 * @property {boolean} focused - The status of whether the text area is focused on.
	 * @property {number} padding - The padding area around the text in the text area
	 * @property {number} startIndex - The starting index, corresponding to chars array, determining where to start display of text
	 * @property {number} endIndex - The ending index, corresponding to chars array, determining where to end display of text
	 * @property {number} characterLimit - The optionally set limited number of chars allowed in chars array
	 * @property {number} selStartIndex - The selection start index, corresponging to chars array, for what is currently selected by the mouse. (Not necessarily lower than end)
	 * @property {number} selEndIndex - The selection end index, corresponging to chars array, for what is currently selected by the mouse. (Not necessarily higher than start)
	 * @property {Object} keyTimers - An object which maps keys (String) to timers. Used for keeping track of how long keys such as ctl+V have been held down.
	 * @property {number} keyHoldDelay - The duration a modified (ctl, shift, etc) key needs to be held (in milliseconds) before the action is repeated.
	 * @property {number} keySelectionIndex - Marks the starting index for text selected using the keyboard.
	 * @property {Array<TextAreaState>} undo_history - Array of states representing the undo history.
	 * @property {Array<TextAreaState>} redo_history - Array of states representing the redo history.
     * @constructor
     */
    constructor(pen, x, y, w) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false
        ) {
            throw Error(
                `You need to give numbers for x, y, and w.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n`
            );
        }
		const borderWidth = 3;
		const padding = 3;
        super(pen, x, y, w, pen.text.size + borderWidth * 2 + padding * 2);
        this.#pen = pen;

		//defaults
		this.#borderWidth = borderWidth;
		this.#focused = false;
		this.#chars = [];
		this.#cursorIndex = 0;
		this.#cursorVisible = false;
		this.#padding = padding;
		this.#characterLimit = undefined;

        //state managment properties
        this.#lastFrameDrawn = 0;
		this.#arrowHoldDelay = 30;

		this.#keyHoldDelay      = 150;
		this.#keySelectionIndex = -1;
		this.#keyTimers 	    = {};
		this.#undo_history      = [];
		this.#redo_history      = [];

		// for (let c="a".charCodeAt(0); c<="z".charCodeAt(0); c++)
		for (let i=0; i<256; i++)
		{
			this.#keyTimers[String.fromCharCode(i)] = true;
		}

        //appearance properties
        this.style = "default";
        this.background = this.#pen.gui.primaryColour;
		this.textColour = this.#pen.gui.textColour;
        this.secondaryColour = this.#pen.gui.secondaryColour;
        this.accentColour = this.#pen.gui.accentColour;
    }
	/**
	 * Returns string for name property.
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}
	/** Set the value of the name property.
	 * @param {string} newName
	 */
	set name(newName) {
		if (this.exists === false) {
            return;
        }
		if((typeof newName === "string") === false){
			throw Error(
				`You need to give a string for the name. ` + 
				`You gave ${newName}, which is a ${typeof newName}. `
			);
		}
		this.#name = newName;
	}
	/**
	 * Returns the focused property, which is true when text area is focused (active), and false if not.
	 * @returns {boolean}
	 */
	get focused() {
		return this.#focused;
	}
	/** Set the value of the focused property.
	 * @param {boolean} newFocused
	 */
	set focused(newFocused) {
		if (this.exists === false) {
            return;
        }
		if((typeof newFocused === "boolean") === false){
            const stringBooleanMessage = (newFocused === "true" || newFocused === "false") 
			? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings.` 
			: ""
			throw Error(
				`You need to give a boolean (true or false) for the text area focused property. ` + 
				`You gave ${newFocused}, which is a ${typeof newFocused}. ` + stringBooleanMessage
			);
		}
		this.#focused = newFocused;
	}
    /**
	 * Returns value property, which is the content of the text area.
	 * @returns {string}
	 */
	get value() {
		return this.#chars.join("");
	}
	/** Can set the content. Useful for placeholders.
	 * @param {string} newValue
	 */
	set value(newValue) {
		if (this.exists === false) {
            return;
        }
		if((typeof newValue === "string") === false){
			throw Error(
				`You need to give a string for the name. ` + 
				`You gave ${newValue}, which is a ${typeof newValue}. `
			);
		}
		let tempChars = newValue.split("");

		// Remove \t and \n
		for (let i = tempChars.length; i >= 0; i--) {
			if (tempChars[i] === "\t" || tempChars[i] === "\n") {
				tempChars.splice(i, 1);
			}
		}
		if (tempChars.length > this.#characterLimit) {
			throw Error (
				`You are attempting to set the value property to a string with more characters than ` +
				`what the character limit property allows. \n` +
				`Either make the character limit larger, or make the text content smaller.`
			)
		}
		this.#chars = [...tempChars];
	} 
	/**
	 * Returns value character limit property, which is the maximum amount of characters allowed.
	 * Default is no character limit. 
	 * @returns {string | undefined}
	 */
	get characterLimit() {
		return this.#characterLimit;
	}
	/** 
	 * Can set the character limit. 
	 * To remove the character limit after already setting it, set it to undefined.
	 * @param {string | undefined} value
	 */
	set characterLimit(value) {
		if (this.exists === false) {
            return;
        }
		// Throw error if characterLimit is NaN or Infinity
        if (Number.isFinite(value) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(value, "character limit has to be a number!")
            );
        }
		// Throw error if characterLimit isn't a whole number, or is not positive
        if (value < 0 || value % 1 !== 0) {
            throw Error(
                `The character limit must be a positive, whole number. You gave ${value}.`
            );
        }
		// Throw error if character limit is 0
		if (value === 0) {
			throw Error(
				`The character limit cannot be set to 0. If you are trying ` +
				`to remove the character limit, set it to undefined.`
			);
		}
		if (this.#chars.length > value) {
			throw Error(
				`You have attempted to set the characters limit to a number lower than ` +
				`the current text content length. The current text content is ${this.#chars.length} ` +
				`characters, and you have tried to set the character limit to ${value}.\n` +
				`Either make the character limit larger, or make the text content ('value' property) smaller.` 
			)
		}
		
		this.#characterLimit = value;
	}
    /**
     * Draws the text area's decorative elements (if any) according to theme.
     */
    #drawDecorations() {
        switch (this.#pen.gui.theme) {
            case "retro":
				this.#pen.colour.stroke = "transparent";

				// White border
				this.#pen.colour.fill = "white";
				this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
				const border = this.#borderWidth;

				// Draw a white bevel on the bottom right
				this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);

                // Draw a grey triangle bevel on the top left
                this.#pen.colour.fill = this.secondaryColour;
                this.#pen.shape.polygon(
                    // Top Left
                    this.x - this.w / 2,
                    this.y - this.h / 2,
                    // Top Right
                    this.x + this.w / 2,
                    this.y - this.h / 2,
					// Inner Top Right
					this.x + this.w / 2 - border,
					this.y - this.h / 2 + border,
					// Inner Bottom Left
					this.x - this.w / 2 + border,
					this.y + this.h / 2 - border,
                    // Bottom Left
                    this.x - this.w / 2,
                    this.y + this.h / 2,
                );
				// Draw a grey second inner bevel on the bottom right
				this.#pen.colour.fill = this.secondaryColour;
				this.#pen.shape.rectangle(this.x, this.y, this.w - border / 2, this.h - border / 2);

				// Draw a black second inner triangle bevel on the top left
				this.#pen.colour.fill = "black";
				this.#pen.shape.polygon(
					// Top Left
					this.x - this.w / 2 + border / 2,
					this.y - this.h / 2 + border / 2,
					// Top Right
					this.x + this.w / 2 - border / 2,
					this.y - this.h / 2 + border / 2,
					// Inner Top Right
					this.x + this.w / 2 - border,
					this.y - this.h / 2 + border,
					// Inner Bottom Left
					this.x - this.w / 2 + border,
					this.y + this.h / 2 - border,
					// Bottom Left
					this.x - this.w / 2 + border / 2,
					this.y + this.h / 2 - border / 2,
				);
                break;
            default:
            // Do nothing
        }
    }
	/**
     * Handles text area being clicked for focussing and mouse movement
     */
	#handleClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where text area is non-responsive
		if (
			this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#pen.frameCount
		) {
			return;
		}

		if (this.isHovering()) {
			if (this.#pen.mouse.leftDown) {
				this.#focused = true;
				this.#moveCursorWithMouse();
			}
		}
		if (this.#focused) {
			if (this.#pen.mouse.leftDown) {
				const mouseEvent = this.#pen.mouse.activeBuffer[0];
				if (mouseEvent && mouseEvent.type === "mousedown") {
					this.#selStartIndex = this.#getIndexFromCoords(mouseEvent.adjustedX);
				}

				const currEndIndex = this.#getIndexFromCoords(this.#pen.mouse.x);
				this.#selEndIndex = currEndIndex;
				if (currEndIndex !== undefined) {
					this.#cursorIndex = currEndIndex;
				}
			}
		}
	}
	/**
	 * Called when mouse is clicked, moves the cursor to the closest cursor position
	 */
	#moveCursorWithMouse() {
		const mouseX = this.#pen.mouse.x;
		const newCursorIndex = this.#getIndexFromCoords(mouseX) || 0;
		this.#cursorIndex = newCursorIndex;
	}
	/**
	 * Translates an x coordinate point into an index
	 * @param {number} givenDist The x coordinate that needs to be translated into an index
	 * @returns 
	 */
	#getIndexFromCoords(givenDist) {
		let prevDist;
		let index;
		for (let i = this.#startIndex; i <= this.#endIndex; i++) {
			const loc = this.#getCoordFromIndex(i);
			let x = loc.x;

			if (x >= givenDist) {
				const prevDiff = Math.abs(prevDist - givenDist);
				const currDiff = Math.abs(x - givenDist);
				if (currDiff < prevDiff || prevDist === undefined) {
					index = i;
				} else {
					index = i - 1;
				}
				break;
			} else if (i === this.#endIndex) {
				// If reach end of loop with no selection, end of line
				index = i + 1;
			} else {
				prevDist = x;
			}
		}
		return index;
	}
	/**
	 * Calculates the closest coordinates from a given index
	 * @param {number} index Given index where coord is needed
	 * @returns 
	 */
	#getCoordFromIndex(index) {
		const tempChars = [...this.#chars, ""];
		const leftText = tempChars.slice(this.#startIndex, index + 1);
		const charWidth = this.#pen.context.measureText(leftText[leftText.length - 1]).width;
		const textWidth = this.#pen.context.measureText(leftText.join("")).width - charWidth;
		let x = this.x - this.w / 2 + textWidth + this.#borderWidth + this.#padding;
		let y = this.y - this.h / 2 + this.#pen.text.size / 2 + this.#borderWidth + this.#padding;
		return {x, y};
	}
	/**
     * Handles outside the text area being clicked, which takes focus away
     */
	#handleOutsideClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where text area is non-responsive
		if (
			this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#pen.frameCount
		) {
			return;
		}

		if (!this.isHovering()) {
			const mouseEvent = this.#pen.mouse.activeBuffer[0];
			if (mouseEvent && mouseEvent.type === "mousedown") {
				this.#focused = false;
				this.#selStartIndex = this.#cursorIndex;
				this.#selEndIndex = this.#cursorIndex;
			}
		}
	}


	#keyReady( key ) {
		return this.#pen.keys.down(key) && this.#keyTimers[key] == 0;
	}

	/**
	 * @param {Array<TextAreaState>} history 
	 * @returns {null}
	 */
	#pushState( history ) {
		const state = new TextAreaState(
			this.#chars, this.#cursorIndex, this.#selStartIndex, this.#selEndIndex
		);
		// Don't push state if identical to the previous state.
		if (history.length > 0 && state.is_same(history[history.length-1])) {
			return;
		}
		history.push(state);
	}

	/**
	 * @param {Array<TextAreaState>} history 
	 * @returns {null}
	 */
	#popState( history ) {
		if (history.length == 0) {
			return;
		}

		const state = history[history.length-1];
		this.#chars = state.chars.slice();
		this.#cursorIndex = state.cursorIndex;
		this.#selStartIndex = state.selStartIndex;
		this.#selEndIndex = state.selEndIndex;

		history.pop();
	}

	/**
	 * Undo the last action.
	 */
	#undo() {
		if (this.#undo_history.length > 0) {
			this.#pushState(this.#redo_history);
			this.#popState(this.#undo_history);
		}
	}

	/**
	 * Redo the last undone action.
	 */
	#redo() {
		if (this.#redo_history.length > 0) {
			this.#pushState(this.#undo_history);
			this.#popState(this.#redo_history);
		}
	}

	/**
	 * Skip to the end of a space-separated sequence of characters.
	 * @param {"left" | "right"} direction Direction to skip.
	 */
	#skipWord( direction ) {

		if (direction != "left" && direction != "right")
		{
			throw new Error(
				`Direction must be either "left" or "right"`
			);
		}

		if (direction == "left") {
			this.#cursorIndex = TextAreaUtil.findNotCharacter(" ", this.#cursorIndex-1, -1, this.#chars);
			this.#cursorIndex = TextAreaUtil.findCharacter(" ", this.#cursorIndex, -1, this.#chars);
		} else {
			this.#cursorIndex = TextAreaUtil.findNotCharacter(" ", this.#cursorIndex, +1, this.#chars);
			this.#cursorIndex = TextAreaUtil.findCharacter(" ", this.#cursorIndex, +1, this.#chars);
		}

		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex   = this.#cursorIndex;
	}


	/**
	 * Handles navigation actions such as skipping words with ctl+arrow or home/end.
	 */
	#handleKeyboardNavigation() {
		if (this.#pen.keys.down("home")) {
			this.#cursorIndex   = 0;
			this.#selStartIndex = 0;
			this.#selEndIndex   = 0;
		} else if (this.#pen.keys.down("end")) {
			this.#cursorIndex   = this.#chars.length;
			this.#selStartIndex = this.#chars.length;
			this.#selEndIndex   = this.#chars.length;
		}

		if (this.#cursorIndex > this.#endIndex + 1) {
			this.#moveWindowRight();
		}
		if (this.#cursorIndex < this.#startIndex) {
			this.#moveWindowLeft();
		}

		if (this.#pen.keys.down("control") == false) {
			return;
		}

		// jump to left side of word.
		if (this.#pen.keys.released("leftArrow")) {
			this.#skipWord("left");
		}

		// jump to right side of word.
		if (this.#pen.keys.released("rightArrow")) {
			this.#skipWord("right");
		}

		// backspace entire word.
		if (this.#pen.keys.released("backSpace")) {
			this.#pushState(this.#undo_history);

			let left, right;

			right = this.#cursorIndex;
			this.#skipWord("left");
			left = this.#cursorIndex;
			
			this.#selStartIndex = left;
			this.#selEndIndex   = right;
			this.#backSpace();
		}
	}

	/**
	 * Handles shift-modified keys such as selection with the arrow keys.
	 */
	#handleKeyboardShiftModifier() {
		if (this.#pen.keys.down("shift")) {
			if (this.#keySelectionIndex == -1) {
				this.#keySelectionIndex = this.#selStartIndex;
			}
			this.#selStartIndex = this.keySelectionIndex;
			this.#selEndIndex   = this.#cursorIndex;
		} else {
			this.keySelectionIndex = -1;
		}
	}

	/**
	 * Handles ctl-modified keys such as copy, cut and paste.
	 */
	#handleKeyboardCtrlModifier() {
		// Don't allow undo/redo history to grow too large.
		if (this.#undo_history.length > 32) {
			this.#undo_history.splice(0, 1);
		}

		if (this.#redo_history.length > 32) {
			this.#redo_history.splice(0, 1);
		}

		// ctl+A
		if (this.#keyReady("a")) {
			this.#selStartIndex = 0;
			this.#selEndIndex = this.#chars.length;
			this.#cursorIndex = this.#selEndIndex;
		}

		// ctl+C
		if (this.#keyReady("c")) {
			this.#keyTimers["c"] = this.#keyHoldDelay;
			this.#pen.text.clipboard = this.#copySelection();
		}

		// ctl+X
		if (this.#keyReady("x")) {
			this.#keyTimers["x"] = this.#keyHoldDelay;
			this.#pen.text.clipboard = this.#cutSelection();
		}

		// ctl+V
		if (this.#keyReady("v")) {
			this.#keyTimers["v"] = this.#keyHoldDelay;
			this.#pasteSelection(this.#pen.text.clipboard);
		}

		// redo
		if (this.#keyReady("z") && this.#pen.keys.down("shift")) {
			this.#keyTimers["z"] = this.#keyHoldDelay;
			this.#redo();
		}

		// undo
		else if (this.#keyReady("z")) {
			this.#keyTimers["z"] = this.#keyHoldDelay;
			this.#undo();
		}
	}

    /**
     * Draws the text area to the canvas based on its current state.
     */
    draw() {
		if (this.exists === false) {
            return;
        }
        this.#pen.state.save();
        this.#pen.state.reset();
        this.#lastFrameDrawn = this.#pen.frameCount;

		this.#drawDecorations();

		if (this.#focused) {
			this.#pen.colour.fill = "white";
		} else {
			this.#pen.colour.fill = this.secondaryColour;
		}

		// Background
		this.#pen.shape.rectangle(
			this.x, 
			this.y, 
			this.w - this.#borderWidth * 2, 
			this.h - this.#borderWidth * 2
		);


		// Check if keys have been released or if a sufficient amount of time has passed.
		// If so, then they can be pressed again.
		for (let key in this.#keyTimers) {
		
			if (this.#keyTimers[key] <= 0) {
				this.#keyTimers[key] = 0;
				continue;
			} else if (this.#pen.keys.released(key)) {
				this.#keyTimers[key] = 0;
			} else {
				this.#keyTimers[key] -= this.#pen.time.msElapsed;
			}
		}

	
		if (this.#focused) {
			this.#handleOutsideClick();

			this.#handleKeyboardNavigation();
			this.#handleKeyboardShiftModifier();

			if (this.#pen.keys.down("control")) {
				this.#handleKeyboardCtrlModifier();
			} else {
				this.#handleKeyboardInput();
			}
		}

		this.#drawText(this.#startIndex, this.#endIndex); // Needs to be after keyboard input and before cursor

		if (this.#focused) {
			this.#drawCursor();
			this.#drawSelection(this.#selStartIndex, this.#selEndIndex);
		}

		this.#handleClick();

        this.#pen.state.load();
	}


	/**
	 * Copy (ctl-C) operation.
	 * @returns {string} The currently selected text
	 */
	#copySelection() {
		const left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		const right = Math.max(this.#selStartIndex, this.#selEndIndex);
		let str = "";
		for (let i=left; i<right; i++) {
			str += this.#chars[i];
		}
		return str;
	}

	/**
	 * Cut (ctl-X) operation.
	 * Removes and returns the currently selected text.
	 * @returns {string} The currently selected text
	 */
	#cutSelection() {
		this.#pushState(this.#undo_history);

		const str  = this.#copySelection();
		const left = Math.min(this.#selStartIndex, this.#selEndIndex);

		this.#chars.splice(left, str.length);
		this.#cursorIndex = left;
		this.#selStartIndex = left;
		this.#selEndIndex = left;

		return str;
	}

	/**
	 * Paste (ctl-V) operation.
	 * Pastes str into the char array.
	 * @param {string} str The string to be pasted.
	 * @returns {null}
	 */
	#pasteSelection( str ) {
		this.#pushState(this.#undo_history);

		const left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		const right = Math.max(this.#selStartIndex, this.#selEndIndex);
		this.#chars.splice(left, right-left);

		this.#cursorIndex = left;

		for (let c of str)
		{
			this.#chars.splice(this.#cursorIndex, 0, c);
			this.#cursorIndex += 1;
		}

		this.#cursorIndex   = left + str.length;
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex   = this.#cursorIndex;
	}


	/**
	 * Draws selection (transparent box) over characters based on given start and end indices.
	 * @param {number} start The start index of where selection should be drawn
	 * @param {number} end The end index of where selection should be drawn
	 */
	#drawSelection(start, end) {
		const startCoords = this.#getCoordFromIndex(start);
		const endCoords = this.#getCoordFromIndex(end);

		const x = (startCoords.x + endCoords.x) / 2;
		const y = startCoords.y;
		const w = Math.abs(startCoords.x - endCoords.x);

		this.#pen.colour.fill = "rgba(0, 115, 130, 0.3)";
		this.#pen.colour.stroke = "transparent";
		this.#pen.shape.rectangle(x, y, w, this.h - this.#borderWidth * 2);
	}
	/**
	 * Draw the cursor at the place related to the cursorIndex property
	 */
	#drawCursor() {
		this.#pen.stroke = "transparent";
		if (this.#pen.time.frameCount % 30 === 0) {
			this.#cursorVisible = !this.#cursorVisible;
		}
		if (this.#cursorVisible) {
			const loc = this.#getCoordFromIndex(this.#cursorIndex);

			this.#pen.colour.fill = "black";
			this.#pen.colour.stroke = "transparent";
			this.#pen.shape.rectangle(loc.x, loc.y, 1, this.#pen.text.size);
		}
	}
	/**
	 * Draws the chars array from the given startIndex to the given endIndex.
	 * @param {number} startIndex The first (lower) value index to draw from
	 * @param {number} endIndex The second (higher) value index to draw to
	 */
	#drawText(startIndex, endIndex) {
		this.#pen.colour.fill = "black";
		this.#pen.context.textAlign = "left";
		this.#pen.context.textBaseline = "top";
		this.#pen.context.fillText(
			this.#chars.slice(startIndex, endIndex + 1).join(""), 
			this.x - (this.w - this.#borderWidth * 2) / 2 + this.#padding, 
			this.y - (this.h - this.#borderWidth * 2) / 2 + this.#padding);
		this.#calcStartEndIndices();
	}
	/**
	 * Initialises the start and end index properties based on text length
	 */
	#calcStartEndIndices() {
		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
		if (this.#startIndex === undefined && this.#endIndex === undefined && this.#chars.length > 0) {
			this.#startIndex = 0;
		
			// If text is longer than box
			if (this.#pen.context.measureText(this.#chars.join("")).width > maxWidth) {
				for (let i = 0; i < this.#chars.length; i++) {
					const testingString = this.#chars.slice(0, i + 1).join("");
					if (this.#pen.context.measureText(testingString).width > maxWidth) {
						this.#endIndex = this.#chars.slice(0, i).length - 1;
						break;
					}
				}
			} else {
				this.#endIndex = this.#chars.length - 1;
			}
		} else if (this.#pen.context.measureText(this.#chars.join("")).width <= maxWidth) {
			// If below the max width, always make the indices fit all chars
			this.#startIndex = 0;
			this.#endIndex = this.#chars.length - 1;
		}
	}

	#insertCharacter( char )
	{
		let left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		let right = Math.max(this.#selStartIndex, this.#selEndIndex);
		let delta = right-left;

		this.#chars.splice(left, delta, char);

		this.#keySelectionIndex = left+1;
		this.#selStartIndex     = left+1;
		this.#selEndIndex       = left+1;
		this.#cursorIndex       = left+1;

		this.#cursorIndexBound();
	}

	#backSpace()
	{
		let left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		let right = Math.max(this.#selStartIndex, this.#selEndIndex);
		let delta = right-left;

		if (delta == 0) {
			left -= 1;
			this.#chars.splice(left, 1);
		} else {
			this.#chars.splice(left, delta);
		}

		this.#keySelectionIndex = left;
		this.#selStartIndex     = left;
		this.#selEndIndex       = left;
		this.#cursorIndex       = left;

		this.#cursorIndexBound();
	}

	/**
	 * Handle inputs for up, down enter and esc keyboard inputs, which handle navigating options
	 */
	#handleKeyboardInput() {
		// Check if the draw command is issued after logic
		// Prevents issues where text area is non-responsive
		if (
			this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#pen.frameCount
		) {
			return;
		}

		// Escape key
		if (this.#pen.keys.released("escape")) {
			this.#focused = false;
		}

		// Keyboard typing inputs
		const allowTyping = this.#characterLimit === undefined || 
							(this.#characterLimit !== undefined && 
							this.#chars.length !== this.#characterLimit);
		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;

		this.#pen.keys.activeBuffer._forEach((event) => {
			if (event.key.length === 1 && event.type === "keydown" && allowTyping) {
				this.#pushState(this.#undo_history);
				this.#insertCharacter(event.key);

				// Move index window when typing at end of line
				const scrolling = this.#pen.context.measureText(this.#chars.join("")).width > maxWidth;
				if (scrolling &&
					(this.#cursorIndex === this.#chars.length
					|| this.#cursorIndex === this.#endIndex + 2)
				) {
					this.#moveWindowRight();
				}
				
			} else if (event.key === "Backspace" && event.type === "keydown") {
				this.#pushState(this.#undo_history);
				this.#backSpace();

				const scrolling = this.#pen.context.measureText(this.#chars.join("")).width > maxWidth;
				// Move index window when deleting at end of line
				if (this.#cursorIndex === this.#chars.length && scrolling) {
					this.#moveWindowThroughDeletion();
				}
			}
		});
		// Holding arrow keys
		const inverseScrollSpeed = 4;
		if (this.#pen.keys.durationDown("rightarrow") > this.#arrowHoldDelay) {
			if (this.#pen.frameCount % inverseScrollSpeed === 0){
				this.#moveCursorRight();
			}
			return;
		} else if (this.#pen.keys.durationDown("leftarrow") > this.#arrowHoldDelay) {
			if (this.#pen.frameCount % inverseScrollSpeed === 0){
				this.#moveCursorLeft();
			}
			return;
		}
		// Pressing arrow keys
		if (this.#pen.keys.released("rightarrow")){
			this.#moveCursorRight();
		} else if (this.#pen.keys.released("leftarrow")){
			this.#moveCursorLeft();
		}
	}
	/**
	 * Moves the display window (based on start and end indices) to the right, taking into
	 * account the potential widths of the new chars.
	 */
	#moveWindowRight(){
		this.#endIndex++;

		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
		const testingString = this.#chars.slice(this.#startIndex, this.#endIndex + 1).join("");
		const textWidth = this.#pen.context.measureText(testingString).width;
		if (textWidth > maxWidth) { // Move start index if char doesn't fit
			// Move start index up until it fits
			for (let i = this.#startIndex; i < this.#endIndex; i++) {
				const testingString = this.#chars.slice(i, this.#endIndex + 1).join("");
				const textWidth = this.#pen.context.measureText(testingString).width;
				if (textWidth < maxWidth) {
					this.#startIndex = i;
					this.#startEndIndexBound();
					break;
				}
			}
		}
	}
	/**
	 * Moves the display window (based on start and end indices) to the left, taking into
	 * account the potential widths of the new chars.
	 */
	#moveWindowLeft(){
		this.#startIndex--;

		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
		const testingString = this.#chars.slice(this.#startIndex, this.#endIndex + 1).join("");
		const textWidth = this.#pen.context.measureText(testingString).width;
		if (textWidth > maxWidth) { // Move end index if char doesn't fit
			// Move end index down until it fits
			for (let i = this.#endIndex; i > this.#startIndex; i--) {
				const testingString = this.#chars.slice(this.#startIndex, i + 1).join("");
				const textWidth = this.#pen.context.measureText(testingString).width;
				if (textWidth < maxWidth) {
					this.#endIndex = i;
					this.#startEndIndexBound();
					break;
				}
			}
		}
	}
	/**
	 * Moves the window to the left for use when the window is being moved through deleting a character.
	 * 
	 */
	#moveWindowThroughDeletion(){
		this.#endIndex--;

		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
		const testingString = this.#chars.slice(this.#startIndex - 1, this.#endIndex + 1).join("");
		const textWidth = this.#pen.context.measureText(testingString).width;
		if (textWidth <= maxWidth) { // Move start index if char doesn't fit
			this.#startIndex--;
			for (let i = this.#startIndex; i > 0; i--) {
				const testingString = this.#chars.slice(i, this.#endIndex + 1).join("");
				const textWidth = this.#pen.context.measureText(testingString).width;
				if (textWidth >= maxWidth) {
					this.#startIndex = i + 1;
					this.#startEndIndexBound();
					break;
				}
			}
		}
	}
	/**
	 * Moves the cursor (and window if needed) to the right, and resets selection window
	 */
	#moveCursorRight(){
		this.#cursorIndex++;
		this.#cursorIndexBound();
		if (this.#cursorIndex > this.#endIndex + 1) {
			this.#moveWindowRight();
		}
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex = this.#cursorIndex;
	}
	/**
	 * Moves the cursor (and window if needed) to the left, and resets selection window
	 */
	#moveCursorLeft(){
		this.#cursorIndex--;
		this.#cursorIndexBound();
		if (this.#cursorIndex < this.#startIndex) {
			this.#moveWindowLeft();
		}
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex = this.#cursorIndex;
	}
	/**
	 * Restrict the cursor index inside the maximum and minimum values it could be
	 */
	#cursorIndexBound() {
		this.#cursorIndex = Math.max(0, Math.min(this.#cursorIndex, this.#chars.length));
	}
	/**
	 * Restrict the start and end indices inside the maximum and minimum values they could be
	 */
	#startEndIndexBound() {
		if (this.#startIndex < 0) {
			this.#startIndex = 0;
		} else if (this.#startIndex > this.#chars.length - 1) {
			this.#startIndex = this.#chars.length - 1;
		}

		if (this.#endIndex < 0) {
			this.#endIndex = 0;
		} else if (this.#endIndex > this.#chars.length - 1) {
			this.#endIndex = this.#chars.length - 1;
		}
	}
	/**
     * Returns true or false based on whether the mouse is hovering over the text area.
	 * @returns {boolean} True if mouse is hovering over text area, false if not.
     */
	isHovering() {
		return TextArea.#isInRect(
			this.#pen.mouse.x,
			this.#pen.mouse.y,
			this.x, 
			this.y, 
			this.w,
			this.h
		);
	}
    /**
     * Returns true if the given x and y coordinates are within the bounds of the given rectangle.
     * @param {number} x
     * @param {number} y
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     * @static
     */
    static #isInRect(x, y, centerX, centerY, width, height) {
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;
        return (
            x >= leftX && x <= leftX + width && y >= topY && y <= topY + height
        );
    }
}
