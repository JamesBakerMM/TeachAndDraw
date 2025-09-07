import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Paint } from "./Paint.js";
import { Tad } from "./TeachAndDraw.js";
import { Vector } from "./Vector.js";

/**
 * A class that represents a natively drawn dropdown on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class Dropdown extends ShapedAssetEntity {
    #tad;
    #lastFrameDrawn;
    #name="";
    #options;
    #index;
    #openDirection;
    #open;
	#arrowHoldDelay;
	#borderWidth;
	#focusedIndex;

	#hovered;
    #released;
    #down;
	#mouse;

	/**
	 * @type {number}
	 */
	#prevHoverIndex;

	#isHoveredOnBox;
	#isHoveredOnOptions;

    /**
     * Creates an instance of Dropdown.
     * @param {number} x - The x-coordinate of the dropdown.
     * @param {number} y - The y-coordinate of the dropdown.
     * @param {number} w - The width of the dropdown.
     * @param {string[]} options - The array of options in the dropdown, as strings.
	 * @param {Tad} tad - An instance of the Tad class.
     * @throws {Error} If the x, y, or w values are not numbers.
     * @property {string} style - The style of the dropdown.
     * @property {string} background - The background colour of the dropdown.
     * @property {string} border - The border colour of the dropdown.
     * @property {string} secondaryColour - The secondary colour of the dropdown.
     * @property {string} accentColour - The accent colour of the dropdown (arrow colour).
	 * @property {string} textColour - The text colour of the dropdown text.
     * @property {number} w - The width of the dropdown.
     * @property {number} h - The height of the dropdown.
     * @property {boolean} exists - True if the dropdown exists.
     * @property {number} x - The x-coordinate of the dropdown.
     * @property {number} y - The y-coordinate of the dropdown.
	 * @property {number} arrowHoldDelay - The duration the arrow key needs to be held (in frames) before the scrolling starts.
	 * @property {string} name - The name given to the dropdown.
	 * @property {number} value - The current selected option of the dropdown.
     * @property {number} index - The index of the currently selected option.
     * @property {string} openDirection - The direction ("up" or "down") that the dropdown opens.
     * @property {boolean} open - The control for whether the dropdown is open or not.
	 * @property {number} focusedIndex - The index of what option is currently focused on (by hover or keyboard controls).
	 * @property {Vector} mouse - The position of the mouse relative to the dropdown.
     * @constructor
     */
    constructor(tad, x, y, w, options) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false
        ) {
            throw Error(
                `You need to give numbers for x, y and w.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n`
            );
        }
        Dropdown.checkOptionsConditions(options);
        super(tad, x, y, w, 30);
        this.#tad = tad;
        this.#options = options.length === 0 ? ["empty"] : options;

		//defaults
        this.#index = 0;
        this.#openDirection = "down";
        this.#open = false;
		this.#borderWidth = 2;
		this.#focusedIndex = 0;
		this.#prevHoverIndex = undefined;

        //state managment properties
		this.#hovered = false;
		this.#released = false;
		this.#down = false;
		this.#mouse = new Vector(0, 0);
        this.#lastFrameDrawn = 0;
		this.#arrowHoldDelay = 30;

        //appearance properties
        this.style = "default";
        this.background = this.#tad.gui.primaryColour;
		this.textColour = this.#tad.gui.textColour;
        this.secondaryColour = this.#tad.gui.secondaryColour;
        this.accentColour = this.#tad.gui.accentColour;
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
            return;
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
            return;
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
                `The dropdown index must be a positive, whole number. You gave ${newIndex}.`
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
	 * Returns value property.
	 * @returns {string}
     * @readonly
	 */
	get value() {
		return this.#options[this.#index];
	}
	/** ! Cannot set the value property. It is read only. !
	 * @param {string} newValue
	 */
	set value(newValue) {
		if (this.exists === false) {
            return;
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
	 * Returns openDirection property ("up" or "down").
	 * @returns {string}
	 */
	get openDirection() {
		return this.#openDirection;
	}
	/** Set the value of the openDirection property ("up" or "down").
	 * @param {string} newOpenDirection
	 */
	set openDirection(newOpenDirection) {
		if (this.exists === false) {
            return;
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
	 * @param {boolean} newOpen
	 */
	set open(newOpen) {
		if (this.exists === false) {
            return;
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
	set released(value) {
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



    /**
     * Draws the dropdown's decorative elements (if any) according to theme.
     */
    #drawDecorations() {
        switch (this.#tad.gui.theme) {
            case "retro":
				
				// White border
				this.#tad.shape.border = Paint.clear;
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
     * Draws the dropdown's button according to theme.
     */
	#drawButton() {
        switch (this.#tad.gui.theme) {
            case "retro":
				this.#tad.shape.border = Paint.clear;
				const border = this.#borderWidth;

				// Bottom-Right black bevel
				this.#tad.shape.colour = Paint.black;
				const buttonWidth = this.h - border * 2;
				const x = this.x + this.w / 2 - buttonWidth / 2 - border;
				this.#tad.shape.rectangle(
					x, 
					this.y, 
					buttonWidth, 
					buttonWidth
				);

                // Draw a white triangle bevel on the top left
                this.#tad.shape.colour = Paint.white;
                this.#tad.shape.polygon(
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

				this.#tad.shape.colour = this.background;
				this.#tad.shape.rectangle(
					x, 
					this.y, 
					buttonWidth - border * 1.5, 
					buttonWidth - border * 1.5
				);

				
				this.#tad.shape.colour = this.accentColour;

				if (this.#openDirection === "down") {
					// Draw down triangle
					this.#tad.shape.polygon(
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
					this.#tad.shape.polygon(
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
		const optionsTotalHeight = this.#options.length * optionHeight + this.#borderWidth * 1.5;
		const distFromCentre = this.h / 2 + optionsTotalHeight / 2;
		const optionsCentreY = this.y + directionModifier * (distFromCentre);
		switch (this.#tad.gui.theme) {
            case "retro":
				// Border rectangle
				this.#tad.shape.colour = Paint.black;
				this.#tad.shape.rectangle(
					this.x,
					optionsCentreY,
					this.w,
					optionsTotalHeight
				);
				// Options background
				this.#tad.shape.colour = this.background;
				this.#tad.shape.rectangle(
					this.x,
					optionsCentreY,
					this.w - this.#borderWidth * 1.5,
					optionsTotalHeight - this.#borderWidth * 1.5
				);
				this.#drawFocusedOption();
				// Options
				this.#tad.text.colour = this.textColour;
				this.#tad.text.alignment.x = "left";
				const adjustment = this.h / 2;
				// Account for text being too long, truncate if needed
				const maxWidth = this.w - this.#borderWidth * 2 - 4;
				for (let i = 0; i < this.#options.length; i++) {
					const text = this.#truncate(this.#options[i], maxWidth);
					this.#tad.text._print(
						this.x - this.w / 2 + this.#borderWidth + 2, 
						this.y + directionModifier * (this.h / 2 + optionHeight * i + adjustment), 
						text
					);
				}
				this.#tad.text.alignment.x = "center";
				break;
            default:
            // Do nothing
        }
	}
	/**
	 * Truncates (shortens) the given string and adds "..." to fit inside given max width.
	 * Does nothing if given string already fits.
	 * @param {string} text - The text wanting to be truncated
	 * @param {number} maxWidth - The space the text has to fit into
	 * @returns {string} - The optionally truncated text, with "..." added to the end
	 */
	#truncate(text, maxWidth) {
		if (this.#tad.context.measureText(text).width < maxWidth) {
			return text;
		}
		const ellipsesWidth = this.#tad.context.measureText("...").width;
		let truncatedText = text;
		for (let i = text.length; i > 0; i++) {
			const width = this.#tad.context.measureText(truncatedText).width;
			const totalWidth = width + ellipsesWidth;
			if (totalWidth >= maxWidth) {
				truncatedText = truncatedText.slice(0, -1);
			} else {
				return truncatedText + "...";
			}
		}
	}
	/**
     * Returns true or false based on whether the mouse is hovering over the dropdown box.
	 * @returns {boolean} True if mouse is hovering over dropdown main box, false if not.
     */
	isHoverOnBox() {
		return Dropdown.#isInRect(
			this.#mouse.x,
			this.#mouse.y,
			this.x, 
			this.y, 
			this.w,
			this.h
		);
	}
	/**
     * Returns true or false based on whether the mouse is hovering over the options box.
	 * @returns {boolean} True if mouse is hovering over options box, false if not.
     */
	isHoverOnOptions() {
		const directionModifier = this.#openDirection === "up" ? -1 : 1;
		const optionHeight = this.h - this.#borderWidth * 2;
		const optionsTotalHeight = this.#options.length * optionHeight;
		const distFromCentre = this.h / 2 + optionsTotalHeight / 2;
		const optionsCentreY = this.y + directionModifier * (distFromCentre);
		return Dropdown.#isInRect(
			this.#mouse.x,
			this.#mouse.y,
			this.x, 
			optionsCentreY, 
			this.w,
			optionsTotalHeight
		);
	}
	/**
     * Returns true or false based on whether the mouse is hovering over the specific option.
	 * @param {number} index - The index of the option
	 * @returns {boolean} True if mouse is hovering over specific option, false if not.
     */
	isHoverOnOption(index) {
		const directionModifier = this.#openDirection === "up" ? -1 : 1;
		const optionHeight = this.h - this.#borderWidth * 2;
		const adjustment = this.h / 2;
		return Dropdown.#isInRect(
			this.#mouse.x,
			this.#mouse.y,
			this.x, 
			this.y + directionModifier * (this.h / 2 + optionHeight * index + adjustment), 
			this.w,
			optionHeight
		);
	}
    /**
     * Handles individual options being clicked
     */
    #handleOptionClick() {
		// Check if the draw command is issued after logic
		// Prevents issues where dropdown is non-responsive
		if (
			this.#lastFrameDrawn !== this.#tad.frameCount - 1 &&
			this.#lastFrameDrawn !== this.#tad.frameCount
		) {
			return;
		}

		for (let i = 0; i < this.#options.length; i++) {
			if (this.isHoverOnOption(i)) {
				if (this.#tad.mouse.leftReleased) {
					this.#index = i;
					this.#open = false;
				}
			}
		}
	}

	/**
	 * Draws a dotted box around the currently selected option.
	 */
	#drawSelected() {
		this.#tad.shape.border = "rgba(0,0,0,0.7)";
		this.#tad.shape.colour = Paint.clear;
        this.#tad.shape.strokeDash = 2;

		const directionModifier = this.#openDirection === "up" ? -1 : 1;
		const optionHeight = this.h - this.#borderWidth * 2;
		const adjustment = this.h / 2;

		this.#tad.shape.rectangle(
			this.x,
			this.y + directionModifier * (this.h / 2 + optionHeight * this.#index + adjustment),
			this.w - 4,
			optionHeight
		);
	}
	/**
	 * Draws a dotted box around the option being hovered over.
	 */
	#handleHoveredOption() {
		for (let i = 0; i < this.#options.length; i++) {
			// If hovering over option i, and the focus hasn't already been set previously
			if (this.isHoverOnOption(i) && this.#prevHoverIndex !== i) {
				this.#focusedIndex = i;
				this.#prevHoverIndex = i;
			}
		}
	}
	/**
	* Draws a dotted box around the option being hovered over/selected by arrow keys.
	*/
   	#drawFocusedOption() {
		const directionModifier = this.#openDirection === "up" ? -1 : 1;
		const optionHeight = this.h - this.#borderWidth * 2;
		const adjustment = this.h / 2;
		this.#tad.shape.colour = this.secondaryColour;
		this.#tad.shape.rectangle(
			this.x,
			this.y + directionModifier * (this.h / 2 + optionHeight * this.#focusedIndex + adjustment),
			this.w - 4,
			optionHeight
		);
	}

    update() { 
        super.update();

		const mouse = this.#tad.camera.screenToWorld(this.#tad.mouse.x, this.#tad.mouse.y);
		const center  = Vector.temp(this.x, this.y);
		mouse.subtract(center);
		mouse.rotate(-this.rotation);
		mouse.add(center);
		this.#mouse.x = mouse.x;
		this.#mouse.y = mouse.y;

		this.#isHoveredOnBox = this.isHoverOnBox();
		this.#isHoveredOnOptions = this.isHoverOnOptions();
		this.#hovered = this.#isHoveredOnBox;
        this.#released = this.#hovered && this.#tad.mouse.leftReleased;
        this.#down = this.#hovered && this.#tad.mouse.leftDown;

		this.#handleBoxClick()

		if (this.open === false) {
			return;
		}		

		this.#handleOutsideClick();
		this.#handleOptionClick();
		// Don't need to check each option if mouse is entirely outside options box.
		if (this.#isHoveredOnOptions) {
			this.#handleHoveredOption();
		}
		this.#handleKeyboardInput();
		this.#handleEnterInput();
	}

	draw() {
		if (this.exists === false) {
            return;
        }
		const ctx = this.#tad.context;
		this.#tad.state.save();
        this.#tad.state.reset();
		if (this.movedByCamera) {
			this.#tad.camera.applyTransforms(ctx);
		}

		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI * (this.rotation/180));
		ctx.translate(-this.x, -this.y);

		this.#lastFrameDrawn = this.#tad.frameCount;

		this.#drawDecorations();

		// Background
		this.#tad.shape.colour = this.background;
		if (this.isHoverOnBox()) {
			this.#tad.shape.colour = this.secondaryColour;
		} 
		this.#tad.shape.rectangle(
			this.x, 
			this.y, 
			this.w - this.#borderWidth * 2, 
			this.h - this.#borderWidth * 2
		);

		this.#drawButton();

		// Draw text in main dropdown box
		const buttonWidth = this.h - this.#borderWidth * 2;
		const maxWidth = this.w - buttonWidth - this.#borderWidth * 2 - 4;
		this.#tad.text.colour = this.textColour;
		this.#tad.text.alignment.x = "left";
		this.#tad.text._print(
			this.x - this.w / 2 + this.#borderWidth + 2, 
			this.y, 
			this.#truncate(this.#options[this.#index], maxWidth)
		);
		this.#tad.text.alignment.x = "center";

		if (this.#open) {
			this.#drawOptions();
			this.#drawSelected();
		}

        this.#tad.state.load();
	}

	/**
     * Handles main dropdown being clicked to open the options
     */
	#handleBoxClick() {
		if (this.#isHoveredOnBox) {
			if (this.#tad.mouse.leftReleased) {
				this.#open = !this.#open;
			}
		}
	}
	/**
     * Handles outside the dropdown being clicked, which closes the dropdown
     */
	#handleOutsideClick() {
		if (!this.#isHoveredOnBox && !this.#isHoveredOnOptions) {
			if (this.#tad.mouse.leftReleased) {
				this.#open = false;
			}
		}
	}
	/**
	 * Handle inputs for up, down enter and esc keyboard inputs, which handle navigating options
	 */
	#handleKeyboardInput() {
		// Escape key
		if (this.#tad.keys.released("escape")) {
			this.#open = false;
		}

		// Holding arrow keys
		const inverseScrollSpeed = 4;
		if (this.#tad.keys.durationDown("downarrow") > this.#arrowHoldDelay) {
			if (this.#tad.frameCount % inverseScrollSpeed === 0){
				this.#moveIndexUpWhen("down")
			}
			return;
		} else if (this.#tad.keys.durationDown("uparrow") > this.#arrowHoldDelay) {
			if (this.#tad.frameCount % inverseScrollSpeed === 0){
				this.#moveIndexUpWhen("up")
			}
			return;
		}
		// Pressing arrow keys
		if (this.#tad.keys.released("downarrow")){
			this.#moveIndexUpWhen("down");
		} else if (this.#tad.keys.released("uparrow")){
			this.#moveIndexUpWhen("up")
		} 
	}
	/**
	 * Selects the focused option and closes the dropdown when enter is pressed
	 */
	#handleEnterInput() {
		if (this.#tad.keys.released("enter")) {
			this.#index = this.#focusedIndex;
			this.#open = false;
		}
	}

	/**
	 * Moves index up or down, depending on the direction given
	 * @param {string} direction "up" or "down"
	 */
	#moveIndexUpWhen(direction) {
		if(this.#openDirection === direction) {
			if (this.#focusedIndex + 1 <= this.#options.length - 1) {
				this.#focusedIndex++;
			}
		} else {
			if (this.#focusedIndex - 1 >= 0) {
				this.#focusedIndex--;
			}
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
	/**
	 * Handles type and condition checking for the options parameter. Must be an array of strings.
	 * @param {string[]} options 
	 * @throws {Error} Throws error if what is given is not an array, or if any items inside the array are not strings.
	 */
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
