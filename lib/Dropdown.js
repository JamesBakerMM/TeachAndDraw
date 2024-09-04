import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

/**
 * A class that represents a natively drawn dropdown on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class Dropdown extends ShapedAssetEntity {
    #pen;
    #lastFrameDrawn;
    #name;
    #options;
    #index;
    #value;
    #openDirection;
    #open;
	#focussed;
    #isAnimating;
    #animProgress;
	#arrowHoldDelay;
	#borderWidth;
    /**
     * Creates an instance of Slider.
     * @param {number} x - The x-coordinate of the slider.
     * @param {number} y - The y-coordinate of the slider.
     * @param {number} w - The width of the slider.
     * @param {number} h - The height of the dropdown.
     * @param {string[]} options - The array of options in the dropdown, as strings.
	 * @param {number} pen - An instance of the Pen class.
     * @throws {Error} If the x, y, or w values are not numbers.
     * @property {string} style - The style of the slider.
     * @property {string} background - The background colour of the slider.
     * @property {string} border - The border colour of the slider.
     * @property {string} secondaryColour - The secondary colour of the slider.
     * @property {string} accentColour - The accent colour of the slider (marks colour).
	 * @property {string} textColour - The text colour of the slider popup.
     * @property {number} w - The width of the slider.
     * @property {number} h - The height of the slider.
     * @property {boolean} exists - True if the slider exists.
     * @property {number} x - The x-coordinate of the slider.
     * @property {number} y - The y-coordinate of the slider.
     * @property {boolean} isAnimating - The state for whether the popup is animating.
     * @property {number} animProgress - The value for popup animation progress. It is from 0 to 100.
	 * @property {number} arrowHoldDelay - The duration the arrow key needs to be held (in frames) before the slider moves.
	 * @property {string} name - The name given to the slider.
	 * @property {number} value - The current selected option of the dropdown.
     * @property {number} index - The index of the currently selected option.
     * @property {string} openDirection - The direction ("up" or "down") that the dropdown opens.
     * @property {boolean} open - The control for whether the dropdown is open or not.
	 * @property {boolean} focussed - The status of whether the slider is focussed on. True if dragging or hovering.
     * @constructor
     */
    constructor(x, y, w, h, options, pen) {
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
        Dropdown.checkOptionsConditions(options);
        super(pen, x, y, w, h);
        this.#pen = pen;
        this.#options = options.length === 0 ? ["empty"] : options;

		//defaults
        this.#index = 0;
        this.#value = this.#options[this.#index];
        this.#openDirection = "down";
        this.#open = false;
		this.#borderWidth = 2;

        //state managment properties
        this.#lastFrameDrawn = 0;
        this.#isAnimating = false;
        this.#animProgress = 0;
		this.#arrowHoldDelay = 30;
		this.#focussed = false;

        //appearance properties
        this.style = "default";
        this.background = this.#pen.gui.primaryColour;
		this.textColour = this.#pen.gui.textColour;
        this.secondaryColour = this.#pen.gui.secondaryColour;
        this.accentColour = this.#pen.gui.accentColour;
    }
    /**
     * Returns the options array of the dropdown.
     * @returns {string[]}
     */
    get options() {
        return this.#options;
    }
    /**
     * Sets the options of the dropdown.
     * @param {string[]} newOptions
     */
    set options(newOptions) {
        if (this.exists === false) {
            return null;
        }
        Dropdown.checkOptionsConditions(newOptions);
        this.#index = 0; // Reset index to first item
        this.#options = newOptions.length === 0 ? ["empty"] : newOptions;
    }
	/**
	 * Returns the index property of the dropdown.
	 * @returns {number}
	 */
    get index() {
		return this.#index;
	}
	/** Set the index property of the dropdown.
	 * @param {number} newIndex
	 */
	set index(newIndex) {
		if (this.exists === false) {
            return null;
        }
		// Throw error if value is NaN or Infinity
        if (Number.isFinite(newIndex) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(newIndex, "index has to be a number!")
            );
        }
		// Throw error if index isn't a whole number, or is not positive
        if (newIndex < 0 || newIndex % 1 !== 0) {
            throw Error(
                `The dropdown index must be a positive, whole number. You gave ${newIndex}`
            );
        }
        // Throw error if index is outside bounds
        if (newIndex > this.#options.length - 1) {
            throw Error(
                `The dropdown index is out of bounds, meaning that it goes past the end of the options array. ` +
                `The options array length is currently ${this.#options.length}, meaning the maximum index that ` +
                `can be given is ${this.#options.length - 1}. You gave ${newIndex}.`
            )
        }
		this.#index = newIndex;
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
            return null;
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
	 * Returns value property.
	 * @returns {string}
     * @readonly
	 */
	get value() {
		return this.#options[this.#index];
	}
	/** ! Cannot set the value property. It is read only.
	 * @param {string} newValue
	 */
	set value(newValue) {
		if (this.exists === false) {
            return null;
        }
        const valIndex = this.#options.indexOf(newValue.toString());
        const msg = valIndex === -1 
            ? `Your given option "${newValue}" does not match any options in the options array. `
            : `For example, your given value "${newValue}" is at index ${valIndex} of the options array.`
		throw Error(
            `The value for the dropdown is read only. It cannot be set. ` +
            `You must set the index property for the corresponding option instead.\n` +
            msg
        );
	}
    /**
	 * Returns openDirection property.
	 * @returns {string}
	 */
	get openDirection() {
		return this.#options[this.#index];
	}
	/** Set the value of the openDirection property. "up" or "down"
	 * @param {string} newOpenDirection
	 */
	set openDirection(newOpenDirection) {
		if (this.exists === false) {
            return null;
        }  
        // Throw error if it is not "up" or "down"
        if (typeof newOpenDirection !== "string" || (newOpenDirection !== "up" && newOpenDirection !== "down")) {
            throw Error(
                `The openDirection property must be a string of either "up" or "down". You gave ${newOpenDirection}.`
            );
        }
        this.#openDirection = newOpenDirection;
	}
	/**
	 * Returns the open property, which is true when dropdown is open, and false if not.
	 * @returns {boolean}
	 */
	get open() {
		return this.#open;
	}
	/** Set the value of the open property.
	 * @param {string} newOpen
	 */
	set open(newOpen) {
		if (this.exists === false) {
            return null;
        }
		if((typeof newOpen === "boolean") === false){
            const stringBooleanMessage = (newOpen === "true" || newOpen === "false") 
			? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings.` 
			: ""
			throw Error(
				`You need to give a boolean (true or false) for the dropdown open property. ` + 
				`You gave ${newOpen}, which is a ${typeof newOpen}. ` + stringBooleanMessage
			);
		}
		this.#open = newOpen;
	}
    /**
     * Draws the dropdown's decorative elements (if any) according to theme.
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
     * Draws the dropdown's button according to theme.
     */
	#drawButton() {
        switch (this.#pen.gui.theme) {
            case "retro":
				this.#pen.colour.stroke = "transparent";
				const border = this.#borderWidth;

				// Bottom-Right black bevel
				this.#pen.colour.fill = "black";
				const buttonWidth = this.h - border * 2;
				const x = this.x + this.w / 2 - buttonWidth / 2 - border;
				this.#pen.shape.rectangle(
					x, 
					this.y, 
					buttonWidth, 
					buttonWidth
				);

                // Draw a white triangle bevel on the top left
                this.#pen.colour.fill = "white";
                this.#pen.shape.polygon(
                    // Top Left
                    x - buttonWidth / 2,
                    this.y - this.h / 2 + border,
                    // Top Right
                    x + buttonWidth / 2,
                    this.y - this.h / 2 + border,
                    // Bottom Left
                    x - buttonWidth / 2,
                    this.y + this.h / 2 - border,
                );

				this.#pen.colour.fill = this.background;
				this.#pen.shape.rectangle(
					x, 
					this.y, 
					buttonWidth - border * 1.5, 
					buttonWidth - border * 1.5
				);

				
				this.#pen.colour.fill = this.accentColour;

				if (this.#openDirection === "down") {
					// Draw down triangle
					this.#pen.shape.polygon(
						// Top Left
						x - buttonWidth / 4,
						this.y - buttonWidth / 6,
						// Top Right
						x + buttonWidth / 4,
						this.y - buttonWidth / 6,
						// Bottom
						x,
						this.y + buttonWidth / 6
					);
				} else {
					// Draw up triangle
					this.#pen.shape.polygon(
						// Top Left
						x - buttonWidth / 4,
						this.y + buttonWidth / 6,
						// Top Right
						x + buttonWidth / 4,
						this.y + buttonWidth / 6,
						// Bottom
						x,
						this.y - buttonWidth / 6
					);
				}
                break;
            default:
            // Do nothing
        }
    }
	/**
     * Draws the dropdown's options according to theme.
     */
	#drawOptions() {
		const directionModifier = this.#openDirection === "up" ? -1 : 1;
		const optionHeight = this.h - this.#borderWidth * 2;
		const optionsTotalHeight = this.#options.length * optionHeight;
		const optionsCentreY = this.y + directionModifier * (this.h / 2 + optionsTotalHeight / 2);
		switch (this.#pen.gui.theme) {
            case "retro":
				// Border rectangle
				this.#pen.colour.fill = "black";
				this.#pen.shape.rectangle(
					this.x,
					optionsCentreY,
					this.w,
					optionsTotalHeight
				);
				// Options background
				this.#pen.colour.fill = this.background;
				this.#pen.shape.rectangle(
					this.x,
					optionsCentreY,
					this.w - this.#borderWidth * 1.5,
					optionsTotalHeight - this.#borderWidth * 1.5
				);
				// Options
				this.#pen.colour.fill = this.textColour;
				this.#pen.text.alignment.x = "left";
				const adjustment = this.#openDirection === "up" ? 8 : 18; // To account for text not being centered
				for (let i = 0; i < this.#options.length; i++) {
					this.#pen.text.print(
						this.x - this.w / 2 + this.#borderWidth + 2, 
						this.y + directionModifier * (this.h / 2 + optionHeight * i + adjustment), 
						this.#options[i]
					);
				}
				this.#pen.text.alignment.x = "center";
				break;
            default:
            // Do nothing
        }
	}
	// /**
    //  * Returns true or false based on whether the mouse is hovering over the slider bar.
	//  * @returns {boolean} True if mouse is hovering over slider, false if not.
    //  */
	// isHovering() {
	// 	return Slider.#isInRect(
	// 		this.#pen.mouse.x,
	// 		this.#pen.mouse.y,
	// 		this.x, 
	// 		this.y, 
	// 		this.w + 4, // Account for borders
	// 		this.h + 4
	// 	);
	// }
    // /**
    //  * Handles moving the handle when track is clicked
    //  */
    // #handleClick() {
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where slider is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}

	// 	if (!this.isHoverOnHandle() && this.isHovering()) {
	// 		if (this.#pen.mouse.leftReleased) {
	// 			this.#setClosestStepValue();
	// 		}
	// 	}
	// }
    /**
     * Draws the slider to the canvas based on its current state.
     */
    draw() {
		if (this.exists === false) {
            return null;
        }
        this.#pen.state.save();
        this.#pen.state.reset();
        this.#lastFrameDrawn = this.#pen.frameCount;

		this.#drawDecorations();
		// Background
		this.#pen.colour.fill = this.background;
		this.#pen.shape.rectangle(
			this.x, 
			this.y, 
			this.w - this.#borderWidth * 2, 
			this.h - this.#borderWidth * 2
		); //give room for bevels
		this.#drawButton();

		// im thinking i loop here, and call the drawOptions and pass in the string.
		// then the drawOptions function styles just the one box?
		// but then i also need to draw around the whole thing.
		// So maybe a drawOptions function, and then drawSingularOption
		// background rectangle that's the size of the dropdown
		// then for each option, if hover or if match index. pass in index?
		// I might just write the code then separate it

		// use height of box - borders, for height of dropdowns
		this.#drawOptions();

		// this.#handleDrag();
		// this.#handleClick();
		// this.#handleKeyboardInput();

		// if (this.#dragStart || this.isHoverOnHandle() || this.isHovering()) {
		// 	this.#isAnimating = true;
		// 	this.#handleIsAnimating = true;
		// 	this.#focussed = true;
		// } else {
		// 	this.#focussed = false;
		// 	this.#animProgress = 0;
		// 	this.#handleAnimProgress = 0;
		// }

        this.#pen.state.load();
	}
	// /**
	//  * Handle inputs for left, right, up and down keyboard inputs, which move the slider handle when hovering
	//  */
	// #handleKeyboardInput() {
	// 	// Check if the draw command is issued after logic
	// 	// Prevents issues where slider is non-responsive
	// 	if (
	// 		this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
	// 		this.#lastFrameDrawn !== this.#pen.frameCount
	// 	) {
	// 		return;
	// 	}
	// 	if (this.isHovering() || this.isHoverOnHandle()) {
	// 		// Holding arrow keys
	// 		if (
	// 			this.#pen.keys.durationDown("uparrow") > this.#arrowHoldDelay || 
	// 			this.#pen.keys.durationDown("rightarrow") > this.#arrowHoldDelay
	// 		) {
	// 			if (this.#pen.frameCount % 2 === 0){
	// 				this.#value += this.#step;
	// 				this.#keepInBounds();
	// 			}
	// 			return;
	// 		} else if (
	// 			this.#pen.keys.durationDown("downarrow") > this.#arrowHoldDelay || 
	// 			this.#pen.keys.durationDown("leftarrow") > this.#arrowHoldDelay
	// 		) {
	// 			if (this.#pen.frameCount % 2 === 0){
	// 				this.#value -= this.#step;
	// 				this.#keepInBounds();
	// 			}
	// 			return;
	// 		}
	// 		// Pressing arrow keys
	// 		if (this.#pen.keys.released("uparrow") || this.#pen.keys.released("rightarrow")){
	// 			this.#value += this.#step;
	// 		} else if (this.#pen.keys.released("downarrow") || this.#pen.keys.released("leftarrow")){
	// 			this.#value -= this.#step;
	// 		} 
	// 		this.#keepInBounds();
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
    static checkOptionsConditions(options) {
        if (Array.isArray(options) === false) {
            throw Error(
                `You need to give an array for the options.\n` + 
                    `You gave: ${options}: ${typeof options} \n\n` +
                    `For example, it is acceptable to give:\n` + 
                    `   ["Option 1", "Option 2", "Option 3"]`
            )
        }
        let arrayTypeIssues = ``;
        let errorFound = false;
        for (let i = 0; i < options.length; i++) {
            if (typeof options[i] !== "string") {
                arrayTypeIssues += `  ❌ At index ${i}, you gave: ${options[i]} which is a ${typeof options[i]}.\n`
                errorFound = true;
            } else {
                arrayTypeIssues += `  ✅ There is a string at index ${i}! This is allowed.\n`
            }
        }
        if (errorFound) {
            throw Error(
                `All items in the options array must be strings.\n` +
                arrayTypeIssues
            );
        }
    }
}
