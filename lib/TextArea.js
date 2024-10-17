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
    #options;
	#chars;
    #index;
	#cursorIndex;
	#cursorLoc;
	#cursorVisible;
	#lines;
    #openDirection;
    #open;
	#arrowHoldDelay;
	#borderWidth;
	#padding;
	#focused;
	#prevHoverIndex;
	#startIndex;
	#endIndex;
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
	 * @property {number} value - The current selected option of the text area.
     * @property {number} index - The index of the currently selected option.
     * @property {string} openDirection - The direction ("up" or "down") that the text area opens.
     * @property {boolean} open - The control for whether the text area is open or not.
	 * @property {string[]} chars - The array containing the text of the text area, split into characters.
	 * @property {number} cursorIndex - The index in the chars array where the cursor is. 0 is before the first char
	 * @property {boolean} focused - The status of whether the text area is focused on.
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
        // this.#options = options.length === 0 ? ["empty"] : options;

		//defaults
        this.#index = 0;
        this.#openDirection = "down";
        this.#open = false;
		this.#borderWidth = borderWidth;
		this.#focused = false;
		this.#prevHoverIndex = undefined;
		this.#chars = [];
		this.#cursorIndex = 0;
		this.#cursorLoc = {
			line: 0,
			index: 0
		};
		this.#cursorVisible = false;
		this.#lines = [];
		this.#padding = padding;

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
    // /**
    //  * Returns the options array of the dropdown.
    //  * @returns {string[]}
    //  */
    // get options() {
    //     return this.#options;
    // }
    // /**
    //  * Sets the options of the dropdown.
    //  * @param {string[]} newOptions
    //  */
    // set options(newOptions) {
    //     if (this.exists === false) {
    //         return null;
    //     }
    //     Dropdown.checkOptionsConditions(newOptions);
    //     this.#index = 0; // Reset index to first item
    //     this.#options = newOptions.length === 0 ? ["empty"] : newOptions;
    // }
	// /**
	//  * Returns the index property of the dropdown.
	//  * @returns {number}
	//  */
    // get index() {
	// 	return this.#index;
	// }
	// /** Set the index property of the dropdown.
	//  * @param {number} newIndex
	//  */
	// set index(newIndex) {
	// 	if (this.exists === false) {
    //         return;
    //     }
	// 	// Throw error if value is NaN or Infinity
    //     if (Number.isFinite(newIndex) === false) {
    //         throw Error(
    //             ErrorMsgManager.numberCheckFailed(newIndex, "index has to be a number!")
    //         );
    //     }
	// 	// Throw error if index isn't a whole number, or is not positive
    //     if (newIndex < 0 || newIndex % 1 !== 0) {
    //         throw Error(
    //             `The dropdown index must be a positive, whole number. You gave ${newIndex}.`
    //         );
    //     }
    //     // Throw error if index is outside bounds
    //     if (newIndex > this.#options.length - 1) {
    //         throw Error(
    //             `The dropdown index is out of bounds, meaning that it goes past the end of the options array. ` +
    //             `The options array length is currently ${this.#options.length}, meaning the maximum index that ` +
    //             `can be given is ${this.#options.length - 1}. You gave ${newIndex}.`
    //         )
    //     }
	// 	this.#index = newIndex;
	// }
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
	/** Set the value of the open property.
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
     * @readonly
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
		this.#chars = [...tempChars];
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
     * Handles text area being clicked for focussing
     */
	#handleClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where dropdown is non-responsive
		if (
			this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#pen.frameCount
		) {
			return;
		}

		if (this.isHovering()) {
			if (this.#pen.mouse.leftReleased) {
				this.#focused = true;
			}
		}
	}
	/**
     * Handles outside the text area being clicked, which takes focus away
     */
	#handleOutsideClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where dropdown is non-responsive
		if (
			this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#pen.frameCount
		) {
			return;
		}

		if (!this.isHovering()) {
			if (this.#pen.mouse.leftReleased) {
				this.#focused = false;
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
		}

		this.#handleClick();

        this.#pen.state.load();
	}
	/**
	 * Draw the cursor at the place related to the cursorIndex property
	 */
	#drawCursor() {
		// this.#pen.stroke = "transparent";
		// if (this.#pen.time.frameCount % 30 === 0) {
		// 	this.#cursorVisible = !this.#cursorVisible;
		// }
		// if (this.#cursorVisible) {
		// 	let y;
		// 	let x;
		// 	let loc = {
		// 		line: 0,
		// 		index: 0
		// 	}
		// 	let indexCount = this.#cursorIndex;
		// 	// let trimmed = this.#lines._map((line) => {
		// 	// 	if (line.length > 1 && line[line.length - 1] === "") {
		// 	// 		return line.slice(0, line.length - 1);
		// 	// 	} else {
		// 	// 		return line;
		// 	// 	}
		// 	// });
		// 	// console.log(trimmed);
		// 	for (let i = 0; i < this.#lines.length; i++) {
		// 		indexCount -= this.#lines[i].length;
		// 		if (indexCount <= 0) { // This line
		// 			loc.line = i;
		// 			// if (this.#lines[i].length !== this.#lines[i].join("").length) {
		// 			// 	indexCount++;
		// 			// 	console.log("increasing")
		// 			// }
		// 			loc.index = this.#lines[i].length + indexCount;
		// 			// console.log(this.#lines[i].length);
		// 			// console.log(indexCount);
		// 			// console.log(this.#lines[i])
		// 			// if (loc.index > this.#lines[i].join("").length) {
		// 			// 	loc.index = this.#lines[i].join("").length;
		// 			// }
		// 			break;
		// 		}
		// 	}
		// 	console.log(loc);
		// 	//ok so its easier to understand, but

		// 	let count = this.#cursorIndex;
		// 	for (let i = 0; i < this.#lines.length; i++) {
		// 		count = count - this.#lines[i].length;
		// 		// console.log(count);

		// 		/**
		// 		 * OK SO i can:
		// 		 * 1. refactor everything to use Line and Index as an object literal (hard. waste of time?)
		// 		 * 2. Keep messing with this, remove the extra spaces I added to the lines array
		// 		 * 3. Keep messing with this, remove extra spaces just here
		// 		 * 4. Calc my own Line and Index HERE, specifically for this? Now they're even i can do it maybe?
		// 		 * That way I can just completely ignore the extra space made by the newline.
		// 		 */

		// 		// OK the current issue is that I need to be able to TELL whether its a \n new like or a wrap new line
		// 		// and i cant really contain that info in the array, and it would be stupid to make another property for it
		// 		// I just need to know for each LINE. math? I just need to see if the next char after the end of the line is \n or not
		// 		// Soooo I could use the line length? do

		// 		// console.log(this.#chars[this.#lines[i].length + this.#lines[0].length]);

		// 		// console.log(this.#chars[this.#cursorIndex]);
		// 		//ok i just need the index of the last char of the current line!
		// 		// so its just prev lines length + curr line length. ok this doesnt work bc some \n have a char in lines and some dont
		// 		// I could ADD "" to the array? it wouldnt make drawing different, but I could check for blanks in the array
		// 		// Check whether it's a \n new line or a wrap new line

		// 		//ok so ive added empty strings to where new lines are, now....all this might need fixing. chars should match better though?
		// 		// console.log(this.#lines._reduce((total, curr) => total + curr.length, 0));
		// 		// console.log(this.#chars.length)

		// 		// if (i > 0 && !(this.#lines[i].length === 1 && this.#lines[i][0] === "")) {
		// 		// 	count--;
		// 		// }
		// 		console.log(count);
		// 		if (count <= 0) { //This current line
		// 			// console.log(this.#lines);
		// 			console.log(this.#chars[this.#cursorIndex]);
		// 			console.log(this.#cursorIndex);
		// 			const leftText = this.#lines[i].slice(0, Math.abs(this.#lines[i].length + count) + 1);
		// 			// ok instead of just LEFT, im going to do the letter we're up to and move it
		// 			// to the left
		// 			const charWidth = this.#pen.context.measureText(leftText[leftText.length - 1]).width;
		// 			console.log(this.#lines[i].length + count);
		// 			console.log(this.#lines[i].length);
		// 			// console.log(leftText);
		// 			// ok issue, its slicing more than is possible. actually, slice is non-inclusive?
		// 			// so it is actually going 0 - 19. thats not the issue
		// 			// so adding + 1 makes the new way work, but then it goes too far off the end.
		// 			// when it SHOULD be moving to the next line
		// 			console.log(leftText);
		// 			const textWidth = this.#pen.context.measureText(leftText.join("")).width - charWidth;
		// 			x = textWidth + this.#borderWidth + this.#padding;
		// 			y = this.#pen.text.size * i + this.#pen.text.size / 2 + this.#borderWidth + this.#padding;
		// 			break;
		// 		}
		// 	}
		// 	this.#pen.shape.rectangle(this.x - this.w / 2 + x, this.y - this.h / 2 + y, 1, this.#pen.text.size);

		// }
	}
	#drawText(startIndex, endIndex) {
		this.#pen.colour.fill = "black";
		this.#pen.context.textAlign = "left";
		this.#pen.context.textBaseline = "top";
		this.#pen.context.fillText(this.#chars.slice(startIndex, endIndex + 1).join(""), this.x - (this.w - this.#borderWidth * 2) / 2 + this.#padding, this.y - (this.h - this.#borderWidth * 2) / 2 + this.#padding);
		this.#calcStartEndIndices();
	}
	#calcStartEndIndices() {
		// If undefined, start at 0 and go to as far as fits inside
		// Otherwise, i believe everything else should update the indices manually?
		// keep in mind updating one end should also update the other. Although... if i remove a small one, 
		if (this.#startIndex === undefined && this.#endIndex === undefined && this.#chars.length > 0) {
			this.#startIndex = 0;
			
			const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;
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
		}
	}
	/**
	 * Handle inputs for up, down enter and esc keyboard inputs, which handle navigating options
	 */
	#handleKeyboardInput() {
		// Check if the draw command is issued after logic
		// Prevents issues where dropdown is non-responsive
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
		this.#pen.keys.activeBuffer._forEach((event) => {
			console.log(event.key);
			if (event.key.length === 1 && event.type === "keydown") {
				this.#chars.splice(this.#cursorIndex, 0, event.key);
				this.#cursorIndex++;
				this.#cursorIndexBound();
			} else if (event.key === "Backspace" && event.type === "keydown") {
				if (this.#cursorIndex - 1 >= 0) {
					this.#chars.splice(this.#cursorIndex - 1, 1);
					this.#cursorIndex--;
					this.#cursorIndexBound();
				}
			}
		});

		// Holding arrow keys
		const inverseScrollSpeed = 4;
		if (this.#pen.keys.durationDown("rightarrow") > this.#arrowHoldDelay) {
			if (this.#pen.frameCount % inverseScrollSpeed === 0){
				this.#cursorIndex++;
				this.#cursorIndexBound();
			}
			return;
		} else if (this.#pen.keys.durationDown("leftarrow") > this.#arrowHoldDelay) {
			if (this.#pen.frameCount % inverseScrollSpeed === 0){
				this.#cursorIndex--;
				this.#cursorIndexBound();
			}
			return;
		}
		// Pressing arrow keys
		if (this.#pen.keys.released("rightarrow")){
			this.#cursorIndex++;
			this.#cursorIndexBound();
		} else if (this.#pen.keys.released("leftarrow")){
			this.#cursorIndex--;
			this.#cursorIndexBound();
		}
	}
	/**
	 * Restrict the cursor index inside the maximum and minimum values it could be
	 */
	#cursorIndexBound() {
		if (this.#cursorIndex > this.#chars.length) {
			this.#cursorIndex = this.#chars.length;
		} else if (this.#cursorIndex < 0) {
			this.#cursorIndex = 0;
		}
	}

	#IncrementCursorLocBy(amt) {
		// try to increment, if not go to next line and use num
		// WAIT WAIT but i need to change the original one
		// I cant add changes into  the lines array, not how it works.
		// But if i do location, I cant add typing in the correct place in chars
		// I could just convert to and from each type, but thats the issue isnt it?
	}
	// /**
	//  * Selects the focused option and closes the dropdown when enter is pressed
	//  */
	// #handleEnterInput(){
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where dropdown is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}

	// 	if (this.#pen.keys.released("enter")) {
	// 		this.#index = this.#focusedIndex;
	// 		this.#open = false;
	// 	}
	// }
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
