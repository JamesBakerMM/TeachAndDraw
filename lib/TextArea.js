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
	#cursorVisible;
	#lines;
    #openDirection;
    #open;
	#arrowHoldDelay;
	#borderWidth;
	#padding;
	#focused;
	#prevHoverIndex;
    /**
     * Creates an instance of TextArea.
     * @param {number} x - The x-coordinate of the text area.
     * @param {number} y - The y-coordinate of the text area.
     * @param {number} w - The width of the text area.
	 * @param {number} h - The height of the text area.
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
    constructor(pen, x, y, w, h) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false ||
			Number.isFinite(h) === false
        ) {
            throw Error(
                `You need to give numbers for x, y, w and h.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n` +
                    `h: ${h}:${typeof h}\n`
            );
        }
        super(pen, x, y, w, h);
        this.#pen = pen;
        // this.#options = options.length === 0 ? ["empty"] : options;

		//defaults
        this.#index = 0;
        this.#openDirection = "down";
        this.#open = false;
		this.#borderWidth = 3;
		this.#focused = false;
		this.#prevHoverIndex = undefined;
		this.#chars = [];
		this.#cursorIndex = 0;
		this.#cursorVisible = false;
		this.#lines = [];
		this.#padding = 3;

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
		this.#chars = newValue.split("");
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

		//Temp testing shape
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

		this.#drawText();
	

		if (this.#focused) {
			this.#handleOutsideClick();
			this.#handleKeyboardInput();
			this.#drawCursor();
		}

		this.#handleClick();

        this.#pen.state.load();
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
			let beforeText = this.#chars.slice(0, this.#cursorIndex);

			let y;
			let x;
			let count = this.#cursorIndex;
			for (let i = 0; i < this.#lines.length; i++) {
				count = count - this.#lines[i].length;
				if (count <= 0) { //This current line
					console.log("Line: ", i + 1);
					console.log(this.#chars[this.#cursorIndex]);
					y = this.#pen.text.size * i + this.#pen.text.size / 2 + this.#borderWidth + this.#padding;
					break;
				}
			}

			// heres my current thinking:
			// - Use math to calculate which line the cursor should be on (chars array minus lengths of lines array?)
			// honestly im tempted to just not use the cursor inf=dex, but lets try it
			// then that means i can get the y position
			// - use measureText of all chars to the left of where the index is in that particular line, and adjust
			// based on the border etc.

			// this.#pen.context.measureText()
			// instead of index, i could have line and index?

			//Ok i can measure things on one line, sure. But how do I know what's on what line?
			// I could make chars instead be an array of arrays, where each inside array is a line?
			// the current print function also removes any spaces, and since this isn't just for display and
			// would need to be exactly as inputted....
			this.#pen.shape.rectangle(this.x, this.y - this.h / 2 + y, 1, this.#pen.text.size);
			//I could just start from the beginning, and like... lets say if it goes past the max width, i'll know to do next line?
			//There MIGHT be some disconnect then though. Worth a try
			// Im basically rewriting code then though. bc id need to calculate what goes into the first line.
			// Should i just copy the print code...? ill need to now that i have to include enter

		}
	}
	#drawText() {
		let tempChars = [...this.#chars];
		// Remove \t and add spaces around \n
		for (let i = 0; i < tempChars.length; i++) {
			if (tempChars[i] === "\t") {
				tempChars.splice(i, 1);
			}
			if (tempChars[i] === "\n" && 
				i !== 0 && 
				tempChars[i - 1] !== " "
			) {
				tempChars.splice(i, 0, " ");
			} else if (
				tempChars[i] === "\n" && 
				i !== tempChars.length - 1 && 
				tempChars[i + 1] !== " "
			) {
				tempChars.splice(i + 1, 0, " ");
			}
		}
		const words = tempChars.join("").split(" ");
        const lineHeight = this.#pen.text.size;
		const maxWidth = this.w - this.#borderWidth * 2 - this.#padding * 2;

        let line = "";
        let lines = [];
        for (let word of words) {
            let proposedLine = line + word; //construct the new line
			if (word === "\n") {
				lines.push(line.trim());
				line = "";
				continue;
			}
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
		this.#lines = lines._map(line => line.split(""));

		this.#pen.colour.fill = "black";
		this.#pen.text.alignment.x = "left";
		this.#pen.text.alignment.y = "top";
		this.#pen.context.textAlign = "left";
		this.#pen.context.textBaseline = "top";
		for (let i = 0; i < lines.length; i++) {
            let direction = lineHeight * i;
            if (this.#pen.text.alignment.y === "bottom") {
                direction = -(lineHeight * (lines.length - 1 - i));
            }
            if (this.#pen.text.alignment.y === "center") {
                const totalHeight = lineHeight * lines.length;
                const adjustedY = i * lineHeight + lineHeight / 2;
                direction = - (totalHeight / 2) + adjustedY;
            }
            this.#pen.context.fillText(lines[i], this.x - (this.w - this.#borderWidth * 2) / 2 + this.#padding, this.y - (this.h - this.#borderWidth * 2) / 2 + this.#padding + direction);
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
