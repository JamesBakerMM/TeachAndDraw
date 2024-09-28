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
    #index;
    #openDirection;
    #open;
	#arrowHoldDelay;
	#borderWidth;
	#focusedIndex;
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
	 * @property {number} focusedIndex - The index of what option is currently focused on (by hover or keyboard controls).
     * @constructor
     */
    constructor(pen, x, y, w, h, options) {
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
        this.#options = options.length === 0 ? ["empty"] : options;

		//defaults
        this.#index = 0;
        this.#openDirection = "down";
        this.#open = false;
		this.#borderWidth = 2;
		this.#focusedIndex = 0;
		this.#prevHoverIndex = undefined;

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
    // /**
	//  * Returns value property.
	//  * @returns {string}
    //  * @readonly
	//  */
	// get value() {
	// 	return this.#options[this.#index];
	// }
	// /** ! Cannot set the value property. It is read only. !
	//  * @param {string} newValue
	//  */
	// set value(newValue) {
	// 	if (this.exists === false) {
    //         return;
    //     }
    //     const valIndex = this.#options.indexOf(newValue.toString());
    //     const msg = valIndex === -1 
    //         ? `Your given option "${newValue}" does not match any options in the options array. `
    //         : `For example, your given value "${newValue}" is at index ${valIndex} of the options array.`
	// 	throw Error(
    //         `The value for the dropdown is read only. It cannot be set. ` +
    //         `You must set the index property for the corresponding option instead.\n` +
    //         msg
    //     );
	// }
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
	// /**
    //  * Returns true or false based on whether the mouse is hovering over the dropdown box.
	//  * @returns {boolean} True if mouse is hovering over dropdown main box, false if not.
    //  */
	// isHoverOnBox() {
	// 	return Dropdown.#isInRect(
	// 		this.#pen.mouse.x,
	// 		this.#pen.mouse.y,
	// 		this.x, 
	// 		this.y, 
	// 		this.w,
	// 		this.h
	// 	);
	// }
	// /**
    //  * Handles main dropdown being clicked to open the options
    //  */
	// #handleBoxClick() {
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where dropdown is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}

	// 	if (this.isHoverOnBox()) {
	// 		if (this.#pen.mouse.leftReleased) {
	// 			this.#open = !this.#open;
	// 		}
	// 	}
	// }
	// /**
    //  * Handles outside the dropdown being clicked, which closes the dropdown
    //  */
	// #handleOutsideClick() {
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where dropdown is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}

	// 	if (!this.isHoverOnBox() && !this.isHoverOnOptions()) {
	// 		if (this.#pen.mouse.leftReleased) {
	// 			this.#open = false;
	// 		}
	// 	}
	// }
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

		// this.#drawDecorations();

		// // Background
		// this.#pen.colour.fill = this.background;
		// if (this.isHoverOnBox()) {
		// 	this.#pen.colour.fill = this.secondaryColour;
		// } 
		// this.#pen.shape.rectangle(
		// 	this.x, 
		// 	this.y, 
		// 	this.w - this.#borderWidth * 2, 
		// 	this.h - this.#borderWidth * 2
		// );

		// this.#drawButton();

		// // Draw text in main dropdown box
		// const buttonWidth = this.h - this.#borderWidth * 2;
		// const maxWidth = this.w - buttonWidth - this.#borderWidth * 2 - 4;
		// this.#pen.colour.fill = this.textColour;
		// this.#pen.text.alignment.x = "left";
		// this.#pen.text._print(
		// 	this.x - this.w / 2 + this.#borderWidth + 2, 
		// 	this.y, 
		// 	this.#truncate(this.#options[this.#index], maxWidth)
		// );
		// this.#pen.text.alignment.x = "center";

		// if (this.#open) {
		// 	this.#drawOptions();
		// 	this.#drawSelected();
		// 	this.#handleOptionClick();
		// 	this.#handleOutsideClick();
		// 	this.#handleHoveredOption();
		// 	this.#handleKeyboardInput();
		// 	this.#handleEnterInput();
		// }
		// this.#handleBoxClick();

        this.#pen.state.load();
	}
	// /**
	//  * Handle inputs for up, down enter and esc keyboard inputs, which handle navigating options
	//  */
	// #handleKeyboardInput() {
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where dropdown is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}

	// 	// Escape key
	// 	if (this.#pen.keys.released("escape")) {
	// 		this.#open = false;
	// 	}

	// 	// Holding arrow keys
	// 	const inverseScrollSpeed = 4;
	// 	if (this.#pen.keys.durationDown("downarrow") > this.#arrowHoldDelay) {
	// 		if (this.#pen.frameCount % inverseScrollSpeed === 0){
	// 			this.#moveIndexUpWhen("down")
	// 		}
	// 		return;
	// 	} else if (this.#pen.keys.durationDown("uparrow") > this.#arrowHoldDelay) {
	// 		if (this.#pen.frameCount % inverseScrollSpeed === 0){
	// 			this.#moveIndexUpWhen("up")
	// 		}
	// 		return;
	// 	}
	// 	// Pressing arrow keys
	// 	if (this.#pen.keys.released("downarrow")){
	// 		this.#moveIndexUpWhen("down");
	// 	} else if (this.#pen.keys.released("uparrow")){
	// 		this.#moveIndexUpWhen("up")
	// 	} 
	// }
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
