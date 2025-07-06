import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Paint } from "./Paint.js";
import { Tad } from "./TeachAndDraw.js";
import { Vector } from "./Vector.js";

/**
 * @typedef {MouseEvent & {
*   adjustedX?: number,
*   adjustedY?: number,
*   adjusted?: boolean,
*   isCanvas?: boolean,
*   isBody?: boolean,
*   wheelDeltaX:number,
*   wheelDeltaY:number
* }} CustomMouseEvent
*/


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
	/**
	 * @param {string | any[]} chars
	 * @param {number} cursorIndex
	 * @param {number} keySelectIndex
	 * @param {number} selStartIndex
	 * @param {number} selEndIndex
	 * @param {any} startIndex
	 * @param {any} endIndex
	 */
	constructor( chars, cursorIndex, keySelectIndex, selStartIndex, selEndIndex, startIndex,
				 endIndex )
	{
		this.chars = chars.slice();
		this.cursorIndex = cursorIndex;
		this.keySelectIndex = keySelectIndex;
		this.selStartIndex = selStartIndex;
		this.selEndIndex = selEndIndex;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	/**
	 * 
	 * @param {TextAreaState} state 
	 * @returns {boolean}
	 */
	is_same( state )
	{
		const mismatchedCharLengths = this.chars.length != state.chars.length;
		const mismatchedCursorIndex = this.cursorIndex != state.cursorIndex;
		const mismatchedStartIndex = this.selStartIndex != state.selStartIndex;
		const mismatchedEndIndex = this.selEndIndex != state.selEndIndex;
	
		if (mismatchedCharLengths || mismatchedCursorIndex || mismatchedStartIndex || mismatchedEndIndex) {
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
    #tad;
	#hovered;
    #released;
    #down;
    #lastFrameDrawn;
	/** @type {string} */
    #name;
	/** @type {string[]} */
	#chars;
	#cursorIndex;
	#cursorBlinkPeriod;
	#cursorBlinkTimer;
	#cursorVisible;
	#borderWidth;
	#padding;
	#focused;
	
	/** @type {number} */
	#startIndex;
	
	/** @type {number} */
	#endIndex;

	/** @type {number} */
	#characterLimit;
	#selStartIndex;
	#selEndIndex;
	#keyctlCmd;
	#keyctlText;
	#keyHoldDelay
	#keyRepeatDelay;
	#keySelectIndex;
	#stateHistory;
	#stateHistoryIndex;
	#mouse;

    /**
     * Creates an instance of TextArea.
     * @param {number} x - The x-coordinate of the text area.
     * @param {number} y - The y-coordinate of the text area.
     * @param {number} w - The width of the text area.
	 * @param {Tad} tad - An instance of the Tad class.
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
	 * @property {string} name - The name given to the text area.
	 * @property {number} value - The current text of the text area.
     * @property {number} index - The index of the currently selected option.
	 * @property {string[]} chars - The array containing the text of the text area, split into characters.
	 * @property {number} cursorIndex - The index in the chars array where the cursor is. 0 is before the first char
	 * @property {number} cursorBlinkPeriod - The amount of time (in milliseconds) the cursor should take to complete a single blink cycle.
	 * @property {boolean} focused - The status of whether the text area is focused on.
	 * @property {number} padding - The padding area around the text in the text area
	 * @property {number} startIndex - The starting index, corresponding to chars array, determining where to start display of text
	 * @property {number} endIndex - The ending index, corresponding to chars array, determining where to end display of text
	 * @property {number} characterLimit - The optionally set limited number of chars allowed in chars array
	 * @property {number} selStartIndex - The selection start index, corresponging to chars array, for what is currently selected by the mouse. (Not necessarily lower than end)
	 * @property {number} selEndIndex - The selection end index, corresponging to chars array, for what is currently selected by the mouse. (Not necessarily higher than start)
	 * @property {TextKeyController} keyctlText - Handles keypress timing/callbacks for plaintext typing.
	 * @property {TextKeyController} keyctlCmd - Handles keypress timing/callbacks for keyboard commands/shortcuts.
	 * @property {number} keyHoldDelay - The duration (in milliseconds) a key needs to be held before being repeated.
	 * @property {number} keyRepeatDelay - The duration (in milliseconds) between each repitition of a key.
	 * @property {number} keySelectIndex - Marks the starting index for text selected using the keyboard.
	 * @property {Array<TextAreaState>} stateHistory - Array of states representing the undo/redo history.
	 * @property {number} stateHistoryIndex - The index of the current state within stateHistory.
	 * @property {Vector} mouse - The position of the mouse relative to the text area.
     * @constructor
     */
    constructor(tad, x, y, w) {
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
        super(tad, x, y, w, tad.text.size + borderWidth * 2 + padding * 2);
        this.#tad = tad;

		//defaults
		this.#borderWidth = borderWidth;
		this.#focused = false;
		this.#chars = [];
		this.#cursorIndex = 0;
		this.#cursorBlinkPeriod = 175;
		this.#cursorBlinkTimer = 0;
		this.#cursorVisible = false;
		this.#padding = padding;
		this.#characterLimit = undefined;

        //state managment properties
		this.#hovered = false;
		this.#released = false;
		this.#down = false;

        this.#lastFrameDrawn = 0;

		this.#keyHoldDelay = 500;
		this.#keyRepeatDelay = 50;

		this.#keyctlText = new KeyInputController(tad, this.#keyHoldDelay, this.#keyRepeatDelay);
		this.#keyctlCmd = new KeyInputController(tad, this.#keyHoldDelay, this.#keyRepeatDelay);
		this.#setupCallbacks();


		this.#endIndex = 0;
		this.#selStartIndex = 0;
		this.#selEndIndex = 0;
		this.#keySelectIndex = -1;
		this.#stateHistoryIndex = -1;
		this.#stateHistory = [];
        this.#mouse = new Vector(0, 0);

        //appearance properties
        this.style = "default";
        this.background = this.#tad.gui.primaryColour;
		this.textColour = this.#tad.gui.textColour;
        this.secondaryColour = this.#tad.gui.secondaryColour;
        this.accentColour = this.#tad.gui.accentColour;
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
		this.#pushState();
	} 
	/**
	 * Returns value character limit property, which is the maximum amount of characters allowed.
	 * Default is no character limit. 
	 * @returns {number | undefined}
	 */
	get characterLimit() {
		return this.#characterLimit;
	}
	/** 
	 * Can set the character limit. 
	 * To remove the character limit after already setting it, set it to undefined.
	 * @param {number | undefined} value
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
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set hovered(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
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
     * @param {boolean} value
     * @readonly
     * @throws {Error} If you try to set this property.
     */
    set down(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }

    get hovered() {
        return this.#hovered;
    }

    get released() {
        return this.#released;
    }

    get down() {
        return this.#down;
	}

	#setupCallbacks() {
		const tad = this.#tad;

		this.#keyctlText.defaultCallback = (/** @type {string} */ key) => {
			if (tad.keys.down("control") == false)
				this.#writeCharacter(key);
		};

		this.#keyctlCmd.keyCallback("leftarrow", () => {
			if (tad.keys.down("control"))
				this.#jumpCursorLeft();
			else
				this.#moveCursorLeft();
		});

		this.#keyctlCmd.keyCallback("rightarrow", () => {
			if (tad.keys.down("control"))
				this.#jumpCursorRight();
			else
				this.#moveCursorRight();
		});

		// ctl+A
		this.#keyctlCmd.keyCallbackModified("a", ["control"], () => {
			this.#selStartIndex = 0; // this.#startIndex;
			this.#selEndIndex   = this.#chars.length;
			this.#cursorIndex = this.#selEndIndex;
		});
	
		// ctl+C, ctl+X, ctl+V
	 	this.#keyctlCmd.keyCallbackModified("c", ["control"], async () => {
			const text = this.#copySelection();
			await this.#tad.clipboard.write(text);
		});
		this.#keyctlCmd.keyCallbackModified("x", ["control"], async () => {
			const text = this.#cutSelection();
			await this.#tad.clipboard.write(text);
		});
		this.#keyctlCmd.keyCallbackModified("v", ["control"], async () => {
			const text = await this.#tad.clipboard.read();
			this.#pasteSelection(text);
		});

		// ctl-Z, ctl-shift-Z
		this.#keyctlCmd.keyCallbackModified("z", ["control"], () => {
			if (this.#tad.keys.down("shift"))
				this.#redo();
			else
				this.#undo();
		});

		this.#keyctlCmd.keyCallback("Home", () => {
			this.#cursorIndex=0; 
			this.#selStartIndex=0; 
			this.#selEndIndex=0;
		});

		this.#keyctlCmd.keyCallback("End", () => {
			const L = this.#chars.length;
			this.#cursorIndex=L; 
			this.#selStartIndex=L; 
			this.#selEndIndex=L;
		});

		this.#keyctlCmd.keyCallback("Backspace", () => {
			if (this.#tad.keys.down("control") == false) {
				this.#writeBackspace();
				this.#pushState();
			} else {
				let left, right;

				right = this.#cursorIndex;
				this.#jumpCursorLeft();
				left = this.#cursorIndex;
				
				this.#selStartIndex = left;
				this.#selEndIndex   = right;
				this.#writeBackspace();
				this.#pushState();
			}
		});

	}

    /**
     * Draws the text area's decorative elements (if any) according to theme.
     */
    #drawDecorations() {
        switch (this.#tad.gui.theme) {
            case "retro":
				this.#tad.shape.border = Paint.clear;

				// White border
				this.#tad.shape.colour = Paint.white;
				this.#tad.shape.rectangle(this.x, this.y, this.w, this.h);
				const border = this.#borderWidth;

				// Draw a white bevel on the bottom right
				this.#tad.shape.rectangle(this.x, this.y, this.w, this.h);

                // Draw a grey triangle bevel on the top left
                this.#tad.shape.colour = this.secondaryColour;
                this.#tad.shape.polygon(
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
				this.#tad.shape.colour = this.secondaryColour;
				this.#tad.shape.rectangle(this.x, this.y, this.w - border / 2, this.h - border / 2);

				// Draw a black second inner triangle bevel on the top left
				this.#tad.shape.colour = Paint.black;
				this.#tad.shape.polygon(
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
			this.#lastFrameDrawn !== this.#tad.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#tad.frameCount
		) {
			return;
		}

		if (this.#hovered) {
			if (this.#tad.mouse.leftDown) {
				this.#focused = true;
				this.#moveCursorWithMouse();
			}
		}
		if (this.#focused) {
			if (this.#tad.mouse.leftDown) {
				const mouseEvent = /** @type {CustomMouseEvent} */ (this.#tad.mouse.activeBuffer[0]);
				if (mouseEvent && mouseEvent.type === "mousedown") {
					
					const mouse = Vector.temp(mouseEvent.adjustedX, mouseEvent.adjustedY);
					const center = Vector.temp(this.x, this.y);
					mouse.subtract(center);
					mouse.rotate(-this.rotation);
					mouse.add(center);
			
					mouseEvent.adjusted
					const newIndex = this.#getIndexFromCoords(mouse.x);
					if (newIndex !== undefined) {
						this.#selStartIndex = newIndex;
					}
				}

				const currEndIndex = this.#getIndexFromCoords(this.#mouse.x);
				if (currEndIndex !== undefined) {
					this.#selEndIndex = currEndIndex;
					this.#cursorIndex = currEndIndex;
				}
			}
		}
	}
	/**
	 * Called when mouse is clicked, moves the cursor to the closest cursor position
	 */
	#moveCursorWithMouse() {
		const mouseX = this.#mouse.x;
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
		const charWidth = this.#tad.context.measureText(leftText[leftText.length - 1]).width;
		const textWidth = this.#tad.context.measureText(leftText.join("")).width - charWidth;
		let x = this.x - this.w / 2 + textWidth + this.#borderWidth + this.#padding;
		let y = this.y - this.h / 2 + this.#tad.text.size / 2 + this.#borderWidth + this.#padding;
		return {x, y};
	}
	/**
     * Handles outside the text area being clicked, which takes focus away
     */
	#handleOutsideClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where text area is non-responsive
		if (
			this.#lastFrameDrawn !== this.#tad.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#tad.frameCount
		) {
			return;
		}

		if (!this.#hovered) {
			const mouseEvent = this.#tad.mouse.activeBuffer[0];
			if (mouseEvent && mouseEvent.type === "mousedown") {
				this.#focused = false;
				this.#selStartIndex = this.#cursorIndex;
				this.#selEndIndex = this.#cursorIndex;
			}
		}
	}

	/**
	 * Push the current state of the TextArea onto #stateHistory.
	 */
	#pushState() {
		const state = new TextAreaState(
			this.#chars, this.#cursorIndex, this.#keySelectIndex,
			this.#selStartIndex, this.#selEndIndex, this.#startIndex, this.#endIndex
		);

		const history = this.#stateHistory;
		let idx = this.#stateHistoryIndex;
		let len = idx + 1;

		// Return is state is identical to the previous state.
		if (idx >= 0 && state.is_same(history[idx])) {
			return;
		}

		if (len < history.length) {
			history.length = len;
		}

		history.push(state);
		this.#stateHistoryIndex += 1;
	}

	/**
	 * Load a TextAreaState.
	 * @param {TextAreaState} state 
	 */
	#loadState( state ) {
		//@ts-expect-error
		this.#chars = state.chars.slice();
		this.#cursorIndex = state.cursorIndex;
		this.#keySelectIndex = state.keySelectIndex;
		this.#selStartIndex = state.selStartIndex;
		this.#selEndIndex = state.selEndIndex;
		this.#startIndex = state.startIndex;
		this.#endIndex = state.endIndex;
	}

	/**
	 * Undo an action by reverting to the previous state from #stateHistory.
	 */
	#undo() {
		let idx = this.#stateHistoryIndex - 1;
		let len = idx + 1;

		if (len > 0) {
			this.#loadState(this.#stateHistory[idx]);
			this.#stateHistoryIndex = idx;
		}
	}

	/**
	 * Redo the previously undone action.
	 */
	#redo() {
		let idx = this.#stateHistoryIndex + 1;
		let len = idx + 1;

		if (len <= this.#stateHistory.length) {
			this.#loadState(this.#stateHistory[idx]);
			this.#stateHistoryIndex = idx;
		}
		console.log(`idx=${this.#stateHistoryIndex}`);
	}

	/**
	 * Handles shift-modified keys such as selection with the arrow keys.
	 */
	#handleKeyboardNavigation() {
		if (this.#tad.keys.down("shift")) {
			if (this.#keySelectIndex == -1) {
				this.#keySelectIndex = this.#selStartIndex;
			}
			this.#selStartIndex = this.#keySelectIndex;
			this.#selEndIndex   = this.#cursorIndex;
		} else {
			this.#keySelectIndex = -1;
		}

		if (this.#cursorIndex > this.#endIndex + 1) {
			this.#moveWindowRight();
		}
		if (this.#cursorIndex < this.#startIndex) {
			this.#moveWindowLeft();
		}
	}

	/**
	 * Handles ctl-modified keys such as copy, cut and paste.
	 */
	#updateStateHistory() {
		// Don't allow undo/redo history to grow too large.
		if (this.#stateHistory.length > 32) {
			this.#stateHistory.splice(1, -1);
		}
	}

    update() {
        super.update();
		this.#keyctlText.update();
		this.#keyctlCmd.update();
	

		const mouse = this.#tad.camera.screenToWorld(this.#tad.mouse.x, this.#tad.mouse.y);
		const center = Vector.temp(this.x, this.y);
		mouse.subtract(center);
		mouse.rotate(-this.rotation);
		mouse.add(center);
		this.#mouse.x = mouse.x;
		this.#mouse.y = mouse.y;

		this.#hovered = TextArea.#isInRect(
			this.#mouse.x, this.#mouse.y,
			this.x,  this.y, this.w, this.h
		);
		this.#released = this.#hovered && this.#tad.mouse.leftReleased;
		this.#down = this.#hovered && this.#tad.mouse.leftDown;

		if (this.#focused) {
			this.#handleOutsideClick();
			this.#handleKeyboardNavigation();
			this.#updateStateHistory();
			this.#handleKeyboardInput();
		}

		this.#handleClick();
	}

    /**
     * Draws the text area to the canvas based on its current state.
     */
    draw() {
		if (this.exists === false) {
            return;
		}
        this.#tad.state.save();
        this.#tad.state.reset();
        this.#lastFrameDrawn = this.#tad.frameCount;

		const ctx = this.#tad.context;
		if (this.movedByCamera) {
			this.#tad.camera.applyTransforms(ctx);
		}

		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI * (this.rotation/180));
		ctx.translate(-this.x, -this.y);

		this.#drawDecorations();

		if (this.#focused) {
			this.#tad.shape.colour = Paint.white;
		} else {
			this.#tad.shape.colour = this.secondaryColour;
		}

		// Background
		this.#tad.shape.rectangle(
			this.x, 
			this.y, 
			this.w - this.#borderWidth * 2, 
			this.h - this.#borderWidth * 2
		);

		this.#drawText(this.#startIndex, this.#endIndex); // Needs to be after keyboard input and before cursor

		if (this.#focused) {
			this.#drawCursor();
			this.#drawSelection(this.#selStartIndex, this.#selEndIndex);
		}

        this.#tad.state.load();
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
		const str  = this.#copySelection();
		const left = Math.min(this.#selStartIndex, this.#selEndIndex);

		this.#chars.splice(left, str.length);
		this.#cursorIndex = left;
		this.#selStartIndex = left;
		this.#selEndIndex = left;
		this.#pushState();

		return str;
	}

	/**
	 * Paste (ctl-V) operation.
	 * Pastes str into the char array.
	 * @param {string} str The string to be pasted.
	 */
	#pasteSelection( str ) {
		const left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		const right = Math.max(this.#selStartIndex, this.#selEndIndex);
		this.#chars.splice(left, right-left);

		this.#cursorIndex = left;

		for (let c of str) {
			this.#chars.splice(this.#cursorIndex, 0, c);
			this.#cursorIndex += 1;
		}

		this.#cursorIndex   = left + str.length;
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex   = this.#cursorIndex;
		this.#pushState();
	}

	/**
	 * Draws selection (transparent box) over characters based on given start and end indices.
	 * @param {number} start The start index of where selection should be drawn
	 * @param {number} end The end index of where selection should be drawn
	 */
	#drawSelection(start, end) {
		const left  = Math.min(start, end);
		const right = Math.max(start, end);
		let startCoords = this.#getCoordFromIndex(left);
		let endCoords = this.#getCoordFromIndex(right);

		startCoords.x = Math.max(this.x-this.w/2, Math.min(this.x+this.w/2, startCoords.x));
		endCoords.x = Math.max(this.x-this.w/2, Math.min(this.x+this.w/2, endCoords.x));

		const x = (startCoords.x + endCoords.x) / 2;
		const y = startCoords.y;
		const w = Math.abs(startCoords.x - endCoords.x);

		this.#tad.shape.colour = "rgba(0, 115, 130, 0.3)";
		this.#tad.shape.border = Paint.clear;
		this.#tad.shape.rectangle(x, y, w, this.h - this.#borderWidth * 2);
	}
	/**
	 * Draw the cursor at the place related to the cursorIndex property
	 */
	#drawCursor() {
		this.#tad.shape.colour = Paint.clear;
		this.#cursorBlinkTimer += this.#tad.time.msElapsed;
		if (this.#cursorBlinkTimer >= this.#cursorBlinkPeriod) {
			this.#cursorBlinkTimer = 0;
			this.#cursorVisible = !this.#cursorVisible;
		}
		if (this.#cursorVisible) {
			const loc = this.#getCoordFromIndex(this.#cursorIndex);

			this.#tad.shape.colour = Paint.black;
			this.#tad.shape.border = Paint.clear;
			this.#tad.shape.rectangle(loc.x, loc.y, 1, this.#tad.text.size);
		}
	}
	/**
	 * Draws the chars array from the given startIndex to the given endIndex.
	 * @param {number} startIndex The first (lower) value index to draw from
	 * @param {number} endIndex The second (higher) value index to draw to
	 */
	#drawText(startIndex, endIndex) {
		this.#tad.text.colour = Paint.black;
		this.#tad.context.textAlign = "left";
		this.#tad.context.textBaseline = "top";
		this.#tad.context.fillText(
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
			if (this.#tad.context.measureText(this.#chars.join("")).width > maxWidth) {
				for (let i = 0; i < this.#chars.length; i++) {
					const testingString = this.#chars.slice(0, i + 1).join("");
					if (this.#tad.context.measureText(testingString).width > maxWidth) {
						this.#endIndex = this.#chars.slice(0, i).length - 1;
						break;
					}
				}
			} else {
				this.#endIndex = this.#chars.length - 1;
			}
		} else if (this.#tad.context.measureText(this.#chars.join("")).width <= maxWidth) {
			// If below the max width, always make the indices fit all chars
			this.#startIndex = 0;
			this.#endIndex = this.#chars.length - 1;
		}
	}

	/**
	 * Write a single character into #chars
	 * @param {String} char A single char.
	 * @param {number} maxWidth 
	 */
	#writeCharacter( char, maxWidth = this.w - 2*(this.#borderWidth-this.#padding)) {

		let left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		let right = Math.max(this.#selStartIndex, this.#selEndIndex);
		let delta = right-left;

		this.#chars.splice(left, delta, char);

		this.#keySelectIndex = left+1;
		this.#selStartIndex  = left+1;
		this.#selEndIndex    = left+1;
		this.#cursorIndex    = left+1;

		this.#cursorIndexBound();

		// Move index window when typing at end of line
		const scrolling = this.#tad.context.measureText(this.#chars.join("")).width > maxWidth;
		if (scrolling &&
			(this.#cursorIndex === this.#chars.length
			|| this.#cursorIndex === this.#endIndex + 2)
		) {
			this.#moveWindowRight();
		}
		this.#pushState();
	}

	/**
	 * "Write" a backspace by deleting the appropriate characters in #chars
	 * @param {number} maxWidth 
	 */
	#writeBackspace( maxWidth = this.w - 2*(this.#borderWidth-this.#padding) )
	{
		let left  = Math.min(this.#selStartIndex, this.#selEndIndex);
		let right = Math.max(this.#selStartIndex, this.#selEndIndex);
		let delta = right-left;

		if (delta == 0) {
			left -= 1;
			// left = Math.max(0, Math.min(left-1, this.#chars.length-1));
			this.#chars.splice(left, 1);
		} else {
			this.#chars.splice(left, delta);
		}

		this.#keySelectIndex = left;
		this.#selStartIndex  = left;
		this.#selEndIndex    = left;
		this.#cursorIndex    = left;

		this.#cursorIndexBound();

		const scrolling = this.#tad.context.measureText(this.#chars.join("")).width > maxWidth;
		// Move index window when deleting at end of line
		if (this.#cursorIndex === this.#chars.length && scrolling) {
			this.#moveWindowThroughDeletion();
		}
	}


	/**
	 * Handle inputs for up, down enter and esc keyboard inputs, which handle navigating options
	 */
	#handleKeyboardInput() {
		// Check if the draw command is issued after logic
		// Prevents issues where text area is non-responsive
		if (
			this.#lastFrameDrawn !== this.#tad.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#tad.frameCount
		) {
			return;
		}

		// Escape key
		if (this.#tad.keys.released("escape")) {
			this.#focused = false;
		}

		// Keyboard typing inputs
		const allowTyping = this.#characterLimit === undefined || 
							(this.#characterLimit !== undefined && 
							this.#chars.length !== this.#characterLimit);
		// const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;

		//@ts-expect-error
		this.#tad.keys.activeBuffer.forEach((/** @type {{ key: string; type: string; }} */ event) => {
			if (event.key.length === 1 && event.type === "keydown" && allowTyping) {
				this.#keyctlText.resetKey(event.key);
				this.#keyctlCmd.resetKey(event.key.toLowerCase());
			}
			else if (event.key == "ArrowLeft") {
				this.#keyctlCmd.resetKey("leftarrow");
			}
			else if (event.key == "ArrowRight") {
				this.#keyctlCmd.resetKey("rightarrow");
			}
			else if (event.key.length > 1 && event.type === "keydown") {
				this.#keyctlCmd.resetKey(event.key);
			}
		});

	}
	/**
	 * Moves the display window (based on start and end indices) to the right, taking into
	 * account the potential widths of the new chars.
	 */
	#moveWindowRight(){
		this.#endIndex++;

		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
		const testingString = this.#chars.slice(this.#startIndex, this.#endIndex + 1).join("");
		const textWidth = this.#tad.context.measureText(testingString).width;
		if (textWidth > maxWidth) { // Move start index if char doesn't fit
			// Move start index up until it fits
			for (let i = this.#startIndex; i < this.#endIndex; i++) {
				const testingString = this.#chars.slice(i, this.#endIndex + 1).join("");
				const textWidth = this.#tad.context.measureText(testingString).width;
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
		const textWidth = this.#tad.context.measureText(testingString).width;
		if (textWidth > maxWidth) { // Move end index if char doesn't fit
			// Move end index down until it fits
			for (let i = this.#endIndex; i > this.#startIndex; i--) {
				const testingString = this.#chars.slice(this.#startIndex, i + 1).join("");
				const textWidth = this.#tad.context.measureText(testingString).width;
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
		const textWidth = this.#tad.context.measureText(testingString).width;
		if (textWidth <= maxWidth) { // Move start index if char doesn't fit
			this.#startIndex--;
			for (let i = this.#startIndex; i > 0; i--) {
				const testingString = this.#chars.slice(i, this.#endIndex + 1).join("");
				const textWidth = this.#tad.context.measureText(testingString).width;
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
	 * Jump to the left side of a space-separated sequence of characters.
	 */
	#jumpCursorLeft() {
		this.#cursorIndex = TextAreaUtil.findNotCharacter(" ", this.#cursorIndex-1, -1, this.#chars);
		this.#cursorIndex = TextAreaUtil.findCharacter(" ", this.#cursorIndex, -1, this.#chars);
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex   = this.#cursorIndex;
	};
	/**
	 * Jump to the right side of a space-separated sequence of characters.
	 */
	#jumpCursorRight() {
		this.#cursorIndex = TextAreaUtil.findNotCharacter(" ", this.#cursorIndex, +1, this.#chars);
		this.#cursorIndex = TextAreaUtil.findCharacter(" ", this.#cursorIndex, +1, this.#chars);
		this.#selStartIndex = this.#cursorIndex;
		this.#selEndIndex   = this.#cursorIndex;
	};
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











class KeyInputController {
	#defaultCallback;
	#keyCallbacks;

	#tad;
	#holdDelay;
	#repeatDelay;

	#timers;
	#canFire;
	#durationDown;

	/**
	 * @param {Tad} tad
	 * @param {number} holdDelay Number of milliseconds a key needs to be held before being repeated.
	 * @param {number} repeatDelay Number of milliseconds between each repitition of a key.
	 */
	constructor(tad, holdDelay = 350, repeatDelay = 50 ) {
		this.#tad = tad;
		this.#holdDelay = holdDelay;
		this.#repeatDelay = repeatDelay;

		this.#defaultCallback = () => { };
		this.#keyCallbacks = {};

		this.#timers  = {};
		this.#canFire = {};
		this.#durationDown = {};
	}

	update() {
		const timers = this.#timers;
		const canFire = this.#canFire;
		const durationDown = this.#durationDown;
		const dt = this.#tad.time.msElapsed;

		for (let key in timers) {
			if (this.#tad.keys.down(key)) {
				durationDown[key] += dt;
				timers[key] = Math.max(timers[key]-dt, 0);
				canFire[key] = timers[key] == 0;
			} else {
				timers[key] = this.#holdDelay;
				canFire[key] = false;
			}
			if (canFire[key]) {
				this.#fire(key);
				if (durationDown[key] >= this.#holdDelay) {
					timers[key] = this.#repeatDelay;
				} else {
					timers[key] = this.#holdDelay;
				}
			}

		}
	}
	/**
	 * @param {any} key
	 */
	#validateKey( key ) {
		if ((typeof key === "string") === false) {
			throw Error(`key must be a string. You supplied a ${typeof key} (${key}).`);
		}
	}
	/**
	 * @param {String} key
	 */
	#fire( key ) {
		if (this.#keyCallbacks[key] == undefined) {
			//@ts-expect-error
			this.#defaultCallback(key);
		}
		else if (typeof this.#keyCallbacks[key] === "function") {
			this.#keyCallbacks[key](key);
		}
	}
	/**
	 * Reset the state of a key.
	 * @param {String} key 
	 */
	resetKey( key ) {
		this.#validateKey(key);
		this.#timers[key] = 0;
		this.#canFire[key] = true;
		this.#durationDown[key] = 0;
	}
	/**
	 * Set a default callback used by all keys without an assigned callback.
	 * @param {Function} callback Default callback to execute when a key is pressed/repeating.
	 */
	set defaultCallback( callback ) {
		//@ts-expect-error
		this.#defaultCallback = callback;
	}
	/**
	 * Assign a callback to a specific key.
	 * @param {String} key Trigger/primary key. For example, the "V" in "control + V".
	 * @param {Function} callback Callback to execute when the key is pressed/repeating.4
	 */
	keyCallback( key, callback ) {
		this.#validateKey(key);
		this.#keyCallbacks[key] = callback;
	}
	/**
	 * Assign a callback to a specific key.
	 * @param {String} key Trigger/primary key. For example, the "V" in "control + V".
	 * @param {Array<String> | null} modifiers Array of modifier keys. For example, ["control", "shift"].
	 * @param {Function} callback Callback to execute when the key is pressed/repeating and all modifier keys are pressed.
	 */
	keyCallbackModified( key, modifiers, callback ) {
		this.#validateKey(key);
		this.#keyCallbacks[key] = () => {
			if (modifiers != null) {
				for (let k of modifiers) {
					if (this.#tad.keys.down(k) != true) {
						return;
					}
				}
			}
			callback();
		};
	}

}

