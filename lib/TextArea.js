import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Pen } from "./Pen.js";

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
				this.#selStartIndex = undefined;
				this.#selEndIndex = undefined;
			}
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

		if (this.#focused) {
			this.#handleOutsideClick();
			this.#handleKeyboardInput();
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
				if (this.#selStartIndex !== this.#selEndIndex) {
					let lower = this.#selStartIndex;
					let higher = this.#selEndIndex;
					if (this.#selEndIndex < this.#selStartIndex) {
						lower = this.#selEndIndex;
						higher = this.#selStartIndex;
					}
					const totalRemoved = higher - lower;
					this.#chars.splice(lower, totalRemoved, event.key);
					this.#selStartIndex = undefined;
					this.#selEndIndex = undefined;
					this.#cursorIndex = lower + 1
					this.#cursorIndexBound();
				} else {
					this.#chars.splice(this.#cursorIndex, 0, event.key);
					this.#cursorIndex++;
					this.#cursorIndexBound();

					// Move index window when typing at end of line
					const scrolling = this.#pen.context.measureText(this.#chars.join("")).width > maxWidth;
					if (scrolling &&
						(this.#cursorIndex === this.#chars.length
						|| this.#cursorIndex === this.#endIndex + 2)
					) {
						this.#moveWindowRight();
					}
				}
				
			} else if (event.key === "Backspace" && event.type === "keydown") {
				if (this.#selStartIndex !== this.#selEndIndex) {
					let lower = this.#selStartIndex;
					let higher = this.#selEndIndex;
					if (this.#selEndIndex < this.#selStartIndex) {
						lower = this.#selEndIndex;
						higher = this.#selStartIndex;
					}
					const totalRemoved = higher - lower;
					this.#chars.splice(lower, totalRemoved);
					this.#selStartIndex = undefined;
					this.#selEndIndex = undefined;
					this.#cursorIndex = lower;
					this.#cursorIndexBound();
				} else if (this.#cursorIndex - 1 >= 0) {
					this.#chars.splice(this.#cursorIndex - 1, 1);
					this.#cursorIndex--;
					this.#cursorIndexBound();

					const scrolling = this.#pen.context.measureText(this.#chars.join("")).width > maxWidth;
					// Move index window when deleting at end of line
					if (this.#cursorIndex === this.#chars.length && scrolling) {
						this.#moveWindowThroughDeletion();
					}
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
		this.#selStartIndex = undefined;
		this.#selEndIndex = undefined;
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
		this.#selStartIndex = undefined;
		this.#selEndIndex = undefined;
	}
	/**
	 * Restrict the cursor index inside the maximum and minimum values it could be
	 */
	#cursorIndexBound() {
		if (this.#cursorIndex > this.#chars.length) {
			this.#cursorIndex = this.#chars.length; // Allow 1 more cursor space for end of line
		} else if (this.#cursorIndex < 0) {
			this.#cursorIndex = 0;
		}
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
