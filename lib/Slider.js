import {Tad}from"./TeachAndDraw.js";
import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

/**
 * A class that represents a natively drawn slider on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class Slider extends ShapedAssetEntity {
    #tad;
    #name;
    #value;
	#max;
	#min;
	#step;
	#dragStart;
	#showMarks;
	#showPopup;
	#focussed;
	#hovered;
    #released;
    #down;
    #isAnimating;
    #animProgress;
	#arrowHoldDelay;
	#handleIsAnimating;
	#handleAnimProgress;
    /**
     * Creates an instance of Slider.
     * @param {number} x - The x-coordinate of the slider.
     * @param {number} y - The y-coordinate of the slider.
     * @param {number} w - The width of the slider.
	 * @param {Tad} tad - An instance of the Tad class.
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
	 * @property {boolean} handleIsAnimating - The state for whether the handle is animating.
     * @property {number} handleAnimProgress - The value for handle animation progress. It is from 0 to 100.
	 * @property {number} arrowHoldDelay - The duration the arrow key needs to be held (in frames) before the slider moves.
	 * @property {string} name - The name given to the slider.
	 * @property {number} value - The current value of the slider, corresponding to where the slider handle is.
	 * @property {number} max - The max of the slider.
	 * @property {number} min - The min of the slider.
	 * @property {number} step - The step of the slider, meaning how much between each mark.
	 * @property {boolean} showMarks - Determines whether to show the marks on the slider.
	 * @property {boolean} showPopup - Determines whether to show the popup on the slider.
	 * @property {boolean} focussed - The status of whether the slider is focussed on. True if dragging or hovering.
	 * @property {boolean} dragStart - The state for whether the dragging has been started, and not ended.
     * @constructor
     */
    constructor(x, y, w, tad) {
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
        super(tad, x, y, w, 10);
        this.#tad = tad;
		this.#name = "";

		//defaults
		this.#max = 100;
		this.#min = 0;
		this.#value = 50;
		this.#step = 1;

        //state managment properties
		this.#hovered = false;
		this.#released = false;
		this.#down = false;
        this.#isAnimating = false;
        this.#animProgress = 0;
		this.#dragStart = false;
		this.#arrowHoldDelay = 30;
		this.#showMarks = true;
		this.#showPopup = true;
		this.#focussed = false;
		this.#handleAnimProgress = 0;
		this.#handleIsAnimating = false;

        //appearance properties
        this.style = "default";
        this.background = this.#tad.gui.primaryColour;
		this.textColour = this.#tad.gui.textColour;
        this.secondaryColour = this.#tad.gui.secondaryColour;
        this.accentColour = this.#tad.gui.accentColour;
    }

	/**
	 * Returns the value property of the slider.
	 * @returns {number}
	 */
    get value() {
		return this.#value;
	}
	/** Set the value property of the slider.
	 * @param {number} newValue
	 */
	set value(newValue) {
		if (this.exists === false) {
            return;
        }
		// Throw error if value is NaN or Infinity
        if (Number.isFinite(newValue) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(newValue, "value has to be a number!")
            );
        }
		// Throw error if value is set higher than max or lower than min
		if (newValue > this.#max || newValue < this.#min) {
			throw new Error(
				`Slider value must be within the min and max. Max is currently ${this.#max} ` +
				`and min is currently ${this.#min}, and you gave ${newValue} for value. ` +
				`If attempting to initially set the value, try setting the min or max first.`
			)
		}
		this.#value = newValue;
	}
	/**
	 * Returns the max property of the slider.
	 * @returns {number}
	 */
    get max() {
		return this.#max;
	}
	/** Set the max property of the slider.
	 * @param {number} newMax
	 */
	set max(newMax) {
		if (this.exists === false) {
            return;
        }
		// Throw error if value is NaN or Infinity
        if (Number.isFinite(newMax) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(newMax, "max has to be a number!")
            );
        }
		// Throw error if max is less than min
		if (newMax <= this.#min) {
			throw new Error(
				`Slider max must be greater than slider min. Min is currently ${this.#min}, and you gave ${newMax} for max.`
			)
		}
		// Throw error if max is set lower than value
		if (newMax < this.#value) {
			throw new Error(
				`Slider value must be within the min and max. Value is currently ${this.#value}, ` +
				`and you gave ${newMax} for max. Try setting the new value first.`
			)
		}
		// Throw error if max is above a million
		if (newMax > 1000000) {
			throw new Error(
				`Max must be below 1,000,000 (1 million). ` +
				`You gave ${newMax} for max.`
			)
		}
		this.#max = newMax;
	}
	/**
	 * Returns the min property of the slider.
	 * @returns {number}
	 */
	get min() {
		return this.#min;
	}
	/** Set the min property of the slider.
	 * @param {number} newMin
	 */
	set min(newMin) {
		if (this.exists === false) {
			return;
		}
		// Throw error if value is NaN or Infinity
		if (Number.isFinite(newMin) === false) {
			throw new Error(
				ErrorMsgManager.numberCheckFailed(newMin, "min has to be a number!")
			);
		}
		// Throw error if min is greater than max
		if (newMin >= this.#max) {
			throw new Error(
				`Slider min must be less than slider max. Max is currently ${this.#max}, and you gave ${newMin} for min.`
			)
		}
		// Throw error if min is set higher than value
		if (newMin > this.#value) {
			throw new Error(
				`Slider value must be within the min and max. Value is currently ${this.#value}, ` +
				`and you gave ${newMin} for min. Try setting the new value first.`
			)
		}
		// Throw error if min is below negative million
		if (newMin < -1000000) {
			throw new Error(
				`Min must be above -1,000,000 (negative 1 million). ` +
				`You gave ${newMin} for min.`
			)
		}
		this.#min = newMin;
	}
	/**
	 * Returns the step property of the slider.
	 * @returns {number}
	 */
	get step() {
		return this.#step;
	}
	/** Set the step property of the slider.
	 * @param {number} newStep
	 */
	set step(newStep) {
		if (this.exists === false) {
			return;
		}
		// Throw error if value negative, not an integer, NaN or Infinity
		if (Number.isFinite(newStep) === false) {
			throw new Error(
				ErrorMsgManager.numberCheckFailed(newStep, "step has to be number!")
			);
		} else if (newStep <= 0) {
			throw new Error(
				`The step has to be a positive number, meaning greater than 0. You gave ${newStep}.`
			)
		} else if (newStep % 1 !== 0) {
			throw new Error(
				`The step has to be a whole number, meaning no decimal places. You gave ${newStep}.`
			)
		}

		// Throw error if the step doesn't fit into the range, and give alternate step.
		const stepFits = (this.#max - this.#min) % newStep === 0;
		if (!stepFits) {
			const range = this.#max - this.#min;
			const currDivisible = range / newStep;
			const nearestFactor = this.#getNearestFactor(newStep, range);
			throw new Error(
				"The step does not fit perfectly in the range. " +
				`Between ${this.#min} and ${this.#max}, a step of ${newStep} can fit ${currDivisible} times into the range. ` + 
				`The number needs to be perfectly divisible. The closest divisible number to ${newStep} is ${nearestFactor}.`
			);
		}
		this.#step = newStep;
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
	 * Returns boolean for the show marks property.
	 * @returns {boolean}
	 */
	get showMarks() {
		return this.#showMarks;
	}
	/** Set the value of the show marks property.
	 * @param {boolean} value
	 */
	set showMarks(value) {
		if (this.exists === false) {
            return;
        }
		if((typeof value === "boolean") === false){
			const stringBooleanMessage = (value === "true" || value === "false") 
			? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings.` 
			: ""
			throw Error(
				`You need to give a boolean (true or false) for showMarks. ` + 
				`You gave ${value}, which is a ${typeof value}. ` + stringBooleanMessage
			);
		}
		this.#showMarks = value;
	}
	/**
	 * Returns boolean for the show popup property.
	 * @returns {boolean}
	 */
	get showPopup() {
		return this.#showPopup;
	}
	/** Set the value of the show popup property.
	 * @param {boolean} value
	 */
	set showPopup(value) {
		if (this.exists === false) {
			return;
		}
		if((typeof value === "boolean") === false){
			const stringBooleanMessage = (value === "true" || value === "false") 
			? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings.` 
			: ""
			throw Error(
				`You need to give a boolean (true or false) for showPopup. ` + 
				`You gave ${value}, which is a ${typeof value}. ` + stringBooleanMessage
			);
		}
		this.#showPopup = value;
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


    /**
     * Draws the slider's decorative elements (if any) according to theme.
     */
    #drawDecorations() {
        switch (this.#tad.gui.theme) {
            case "retro":
				this.#tad.colour.stroke = "transparent";

				// White border
				this.#tad.colour.fill = "white";
				this.#tad.shape.rectangle(this.x, this.y, this.w + 1.5, this.h / 2 + 6.5);

                // Draw a black triangle bevel on the top left
                this.#tad.colour.fill = "black";
                this.#tad.shape.polygon(
                    // Top Left
                    this.x - this.w / 2,
                    this.y - this.h / 2,
                    // Top Right
                    this.x + this.w / 2,
                    this.y - this.h / 2,
					// Inner Top Right
					this.x + this.w / 2 - 2.5,
					this.y - this.h / 2 + this.h / 4,
					// Inner Bottom Left
					this.x - this.w / 2 + 2.5,
					this.y + this.h / 2 - this.h / 4,
                    // Bottom Left
                    this.x - this.w / 2,
                    this.y + this.h / 2,
                );
                
                // Draw a grey triangle bevel on the bottom right
                this.#tad.colour.fill = this.secondaryColour;
                this.#tad.shape.polygon(
					// Inner Top Right
					this.x + this.w / 2 - 2.5,
					this.y - this.h / 2 + this.h / 4,
                    // Top Right
                    this.x + this.w / 2,
                    this.y - this.h / 2,
                    // Bottom Right
                    this.x + this.w / 2,
                    this.y + this.h / 2,
                    // Bottom Left
                    this.x - this.w / 2,
                    this.y + this.h / 2,
					// Inner Bottom Left
					this.x - this.w / 2 + 2.5,
					this.y + this.h / 2 - this.h / 4,
                );
                break;
            default:
            // Do nothing
        }
    }
	/**
     * Draws the slider handle to the canvas based on theme.
     */
	#drawHandle() {
		switch (this.#tad.gui.theme) {
			case "retro":
				const range = this.#max - this.#min;
				const position = this.x - this.w / 2 + this.w * ((this.#value - this.#min) / range);
				const animDiff = 3;
				let handleWidth = 9.5 - animDiff;
				let handleHeight = this.h * 2 - animDiff;
				const border = 2;
				const animSpeed = 30;

				if (this.#handleIsAnimating && this.#handleAnimProgress < 100) {
					this.#handleAnimProgress += animSpeed;
				} else if (this.#handleAnimProgress > 100) {
					this.#handleAnimProgress = 100;
					this.#handleIsAnimating = false;
				}
				handleWidth += animDiff * (this.#handleAnimProgress / 100);
				handleHeight += animDiff * (this.#handleAnimProgress / 100);

				// Bevels
				// Draw a white triangle bevel on the top left
				this.#tad.colour.fill = "white";
				this.#tad.shape.polygon(
					// Top Left
					position - handleWidth / 2 - border,
					this.y - handleHeight / 2 - border,
					// Top Right
					position + handleWidth / 2 + border,
					this.y - handleHeight / 2 - border,
					// Bottom Left
					position - handleWidth / 2 - border,
					this.y + handleHeight / 2 + border,
				);
				// Draw a dark grey triangle bevel on the bottom right
				this.#tad.colour.fill = "grey";
				this.#tad.shape.polygon(
					// Top Right
					position + handleWidth / 2 + border,
					this.y - handleHeight / 2 - border,
					// Bottom Right
					position + handleWidth / 2 + border,
					this.y + handleHeight / 2 + border,
					// Bottom Left
					position - handleWidth / 2 - border,
					this.y + handleHeight / 2 + border,
				);
				
				// Handle background
				this.#tad.colour.fill = this.background;
				this.#tad.shape.rectangle(position, this.y, handleWidth, handleHeight);
				break;
			default:
			// Do nothing
		}
	}
	/**
     * Returns true or false based on whether the mouse is hovering over the slider handle.
	 * @returns {boolean} True if mouse is hovering over handle, false if not.
     */
	isHoverOnHandle() {
		const range = this.#max - this.#min;
		const position = this.x - this.w / 2 + this.w * ((this.#value - this.#min) / range);
		return Slider.#isInRect(
            this.#tad.mouse.x,
            this.#tad.mouse.y,
			position, 
			this.y, 
			8 + 4, // Account for borders
			this.h * 2 + 4
		);
	}

	/**
     * Draws the slider text popup to the canvas based on theme.
     */
	#drawPopup() {
		switch (this.#tad.gui.theme) {
			case "retro":
				const range = this.#max - this.#min;
				const xPos = this.x - this.w / 2 + this.w * ((this.#value - this.#min) / range);
				let yPos = this.y - this.h * 2 - 7;

				const numChars = this.#value.toString().length;
				let popupWidth = numChars * 10 + 3; // Add approx 10 pixels per char for this font
				let popupHeight = this.h * 2;
				
				const bevelBorder = 2;
				const boxBorder = bevelBorder * 2 + 1;

                const animationSpeed = 10;
				const gradient = 0.1;
				let animY = 0;
				const animSizeDivide = 7;  

                if (this.#isAnimating && this.#animProgress < 100) {
                    this.#animProgress += animationSpeed;
					animY = -((gradient * this.#animProgress - 5) ** 2) + 25; // parabola
                } else if (this.#animProgress >= 100) {
                    this.#isAnimating = false;
                    this.#animProgress = 100;
                }
				popupWidth += animY / animSizeDivide;
				popupHeight += animY / animSizeDivide;
				yPos -= animY / animSizeDivide / 2;

				// Grey border
				this.#tad.colour.fill = "grey";
				this.#tad.shape.rectangle(xPos, yPos, popupWidth + boxBorder, popupHeight + boxBorder);
				
				// Draw a white triangle bevel on the top left
				this.#tad.colour.fill = "white";
				this.#tad.shape.polygon(
					// Top Left
					xPos - popupWidth / 2 - bevelBorder,
					yPos - popupHeight / 2 - bevelBorder,
					// Top Right
					xPos + popupWidth / 2 + bevelBorder,
					yPos - popupHeight / 2 - bevelBorder,
					// Inner Top Right
					xPos + popupWidth / 2,
					yPos - popupHeight / 2,
					// Inner Bottom Left
					xPos - popupWidth / 2,
					yPos + popupHeight / 2,
					// Bottom Left
					xPos - popupWidth / 2 - bevelBorder,
					yPos + popupHeight / 2 + bevelBorder,
				);

				// Popup background
				this.#tad.colour.fill = this.background;
				this.#tad.shape.rectangle(xPos, yPos, popupWidth, popupHeight);

				// Popup triangle
				this.#tad.colour.fill = "grey";
				this.#tad.shape.polygon(
					xPos, 
					yPos + popupHeight / 2 + 10,
					xPos + 5,
					yPos + popupHeight / 2,
					xPos - 5,
					yPos + popupHeight / 2,

				);
				this.#tad.colour.fill = this.textColour;
				this.#tad.text._print(xPos, yPos, this.#value.toString());
				break;
			default:
			// Do nothing
		}
	}
	/**
     * Draws the slider marks to the canvas based on theme.
     */
	#drawMarks() {
		switch (this.#tad.gui.theme) {
			case "retro":
				const stepGap = this.w * (this.#step / (this.#max - this.#min)); // in pixels
				const steps = Math.floor((this.#max - this.#min) / this.#step);

				if (stepGap >= 3.5) { // Don't draw marks when gap is too small
					for (let i = 1; i <= steps - 1; i++) {
						const left = this.x - this.w / 2 + 1;
						if (this.#focussed) {
							this.#tad.colour.fill = this.accentColour;
						} else {
							this.#tad.colour.fill = this.secondaryColour;
						}
						this.#tad.shape.rectangle(left + stepGap * i - 1, this.y, 1, this.h / 4 + 0.5);
					}
				}
				break;
			default:
			// Do nothing
		}
	}

    /**
     * Handles movement when the handle is dragged
     */
    #handleDrag() {
		// Start grabbing action
		if (this.isHoverOnHandle() && this.#dragStart === false) {
			this.#dragStart = this.#tad.mouse.leftDown;
		}

		// Stop dragging
		if (this.#dragStart && this.#tad.mouse.leftReleased){
			this.#dragStart = false;
		}

		// While dragging
		if (this.#dragStart && this.#tad.mouse.leftDown) {
			this.#setClosestStepValue();
		}
	}
	/**
	 * Calculates and sets the value to the closest step.
	 */
	#setClosestStepValue() {
		const stepGap = this.w * (this.#step / (this.#max - this.#min)); // in pixels
		const steps = Math.floor((this.#max - this.#min) / this.#step);
		const mouseX = this.#tad.mouse.x;
		for (let i = 0; i <= steps; i++) {
			const mark = this.x - this.w / 2 + stepGap * i;
			if (i === 0 && mouseX < mark) {
				this.#value = this.#min + i * this.#step;
				break;
			}
			if (i === steps && mouseX >= mark) {
				this.#value = this.#min + i * this.#step;
				break;
			}
			if (mark > mouseX) {
				const prevMark = this.x - this.w / 2 + 1 + stepGap * (i - 1) - 1;
				const prevDist = Math.abs(prevMark - mouseX);
				const currDist = Math.abs(mark - mouseX);
				if (prevDist < currDist) {
					this.#value = this.#min + (i - 1) * this.#step;
				} else {
					this.#value = this.#min + i * this.#step;
				}
				break;
			}
		}
	}
    /**
     * Handles moving the handle when track is clicked
     */
    #handleClick() {
		if (this.#hovered && !this.isHoverOnHandle()) {
			if (this.#tad.mouse.leftReleased) {
				this.#setClosestStepValue();
			}
		}
	}

    update() {
        super.update();

		this.#hovered = Slider.#isInRect(
			this.#tad.mouse.x, this.#tad.mouse.y,
			this.x, this.y, this.w + 4, this.h + 4
		);
		this.#released = this.#hovered && this.#tad.mouse.leftReleased;
		this.#down = this.#hovered && this.#tad.mouse.leftDown;

		this.#handleDrag();
		this.#handleClick();
		this.#handleKeyboardInput();

		if (this.#dragStart || this.isHoverOnHandle() || this.#hovered) {
			this.#isAnimating = true;
			this.#handleIsAnimating = true;
			this.#focussed = true;
		} else {
			this.#focussed = false;
			this.#animProgress = 0;
			this.#handleAnimProgress = 0;
		}
	}

    /**
     * Draws the slider to the canvas based on its current state.
     */
	/**
	 * @returns {undefined}
	 */
    draw() {
		if (this.exists === false) {
            return;
        }

        this.#tad.state.save();
        this.#tad.state.reset();

		this.#drawDecorations();

		// Track
		this.#tad.colour.fill = this.background;
		this.#tad.shape.rectangle(this.x, this.y, this.w - 5, this.h / 2);

		if (this.#showMarks) {
			this.#drawMarks();
		}
		this.#drawHandle();
		if (this.#showPopup && this.#focussed) {
			this.#drawPopup();
		}

        this.#tad.state.load();
	}
	/**
	 * Handle inputs for left, right, up and down keyboard inputs, which move the slider handle when hovering
	 */
	#handleKeyboardInput() {
		if (this.#hovered || this.isHoverOnHandle()) {
			// Holding arrow keys
			if (
				this.#tad.keys.durationDown("uparrow") > this.#arrowHoldDelay || 
				this.#tad.keys.durationDown("rightarrow") > this.#arrowHoldDelay
			) {
				if (this.#tad.frameCount % 2 === 0){
					this.#value += this.#step;
					this.#keepInBounds();
				}
				return;
			} else if (
				this.#tad.keys.durationDown("downarrow") > this.#arrowHoldDelay || 
				this.#tad.keys.durationDown("leftarrow") > this.#arrowHoldDelay
			) {
				if (this.#tad.frameCount % 2 === 0){
					this.#value -= this.#step;
					this.#keepInBounds();
				}
				return;
			}
			// Pressing arrow keys
			if (this.#tad.keys.released("uparrow") || this.#tad.keys.released("rightarrow")){
				this.#value += this.#step;
			} else if (this.#tad.keys.released("downarrow") || this.#tad.keys.released("leftarrow")){
				this.#value -= this.#step;
			} 
			this.#keepInBounds();
		}
	}
	/**
	 * Sets the value to the max if it goes above the max, and to the min if it goes below the min
	 */
	#keepInBounds(){
		if (this.#value > this.#max) {
			this.#value = this.#max;
		} else if (this.#value < this.#min) {
			this.#value = this.#min;
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
	 * When given a number (x), finds the closest number to x that is a factor of the multiple given.
	 * @param {number} x - The number that a factor near needs to be found.
	 * @param {number} multiple - The multiple that the number (x) needs to be a factor of.
	 * @returns {number} - The closest factor to x, that is a factor of the multiple.
	 */
	#getNearestFactor(x, multiple){
		let lowerTest = x;
		let higherTest = x;
		for (let i = 0; i < multiple; i++) {
			if (multiple % lowerTest === 0) {
				return lowerTest;
			} 
			if (multiple % higherTest === 0) {
				return higherTest;
			}
			lowerTest = x - i;
			higherTest = x + i;
		}
	}
}
