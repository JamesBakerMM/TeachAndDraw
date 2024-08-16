import { ShapedAssetEntity } from "./Entity.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

/**
 * A class that represents a natively drawn slider on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class Slider extends ShapedAssetEntity {
    #pen;
    #up;
    #lastFrameDrawn;
    #name;
    #value;
	#max;
	#min;
	#step;
    #isAnimating;
    #animProgress;
    /**
     * Creates an instance of Checkbox.
     * @param {number} x - The x-coordinate of the checkbox.
     * @param {number} y - The y-coordinate of the checkbox.
     * @param {number} w - The width of the checkbox.
     * @throws {Error} If the x, y, w, or h values are not numbers.
     * @property {string} style - The style of the checkbox.
     * @property {string} background - The background colour of the checkbox.
     * @property {string} border - The border colour of the button.
     * @property {string} secondaryColour - The secondary colour of the checkbox.
     * @property {string} accentColour - The accent colour of the checkbox (tick colour).
     * @property {boolean} up - True if the checkbox has just been released after being pressed.
     * @property {number} w - The width of the checkbox.
     * @property {number} h - The height of the checkbox.
     * @property {boolean} exists - True if the checkbox exists.
     * @property {number} x - The x-coordinate of the checkbox.
     * @property {number} y - The y-coordinate of the checkbox.
     * @property {boolean} isAnimating - The state for whether the tick is animating.
     * @property {number} animProgress - The value for animation progress. It is from 0 to 100.
     * @constructor
     */
    constructor(x, y, w, pen) {
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
        super(pen, x, y, w, 10);
        this.#pen = pen;
		this.#max = 100;
		this.#min = 0;
		this.#value = 50;

        //state managment properties
        this.#up = false;
        this.#lastFrameDrawn = 0;
        this.#isAnimating = false;
        this.#animProgress = 0;

        //appearance properties
        this.style = "default";
        this.border = "black";
        this.background = this.#pen.gui.primaryColour;
		this.textColour = this.#pen.gui.textColour;
        this.secondaryColour = this.#pen.gui.secondaryColour;
        this.accentColour = this.#pen.gui.accentColour;
    }

	/**
	 * Returns the value property of the slider.
	 * @returns {number}
	 */
    get value() {
		return this.#value;
	}
	/** Set the value property of the slider.
	 * @param {number} value
	 */
	set value(value) {
		if (this.exists === false) {
            return false;
        }
		// Throw error if value is NaN or Infinity
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(value, "value has to be a number!")
            );
        }
		this.#value = value;
	}
	/**
	 * Returns the max property of the slider.
	 * @returns {number}
	 */
    get max() {
		return this.#max;
	}
	/** Set the max property of the slider.
	 * @param {number} value
	 */
	set max(value) {
		if (this.exists === false) {
            return false;
        }
		// Throw error if value is NaN or Infinity
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(value, "max has to be a number!")
            );
        }
		this.#max = value;
	}
	/**
	 * Returns the min property of the slider.
	 * @returns {number}
	 */
	get min() {
		return this.#min;
	}
	/** Set the max property of the slider.
	 * @param {number} value
	 */
	set min(value) {
		if (this.exists === false) {
			return false;
		}
		// Throw error if value is NaN or Infinity
		if (Number.isFinite(value) === false) {
			throw new Error(
				ErrorMsgManager.numberCheckFailed(value, "min has to be a number!")
			);
		}
		this.#min = value;
	}
	/**
	 * Returns the step property of the slider.
	 * @returns {number}
	 */
	get step() {
		return this.#step;
	}
	/** Set the step property of the slider.
	 * @param {number} value
	 */
	set step(value) {
		if (this.exists === false) {
			return false;
		}
		// Throw error if value is NaN or Infinity
		if (Number.isFinite(value) === false) {
			throw new Error(
				ErrorMsgManager.numberCheckFailed(value, "step has to be a number!")
			);
		}
		this.#step = value;
	}
	/**
	 * Returns string for name property.
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}
	/** Set the value of the name property.
	 * @param {string} value
	 */
	set name(value) {
		if (this.exists === false) {
            return false;
        }
		if((typeof value === "string") === false){
			throw Error(
				`You need to give a string for the name. ` + 
				`You gave ${value}, which is a ${typeof value}. `
			);
		}
		this.#name = value;
	}

    // /**
    //  * Returns true if the slider has just been released after being pressed.
    //  * @returns {boolean}
    //  */
    // #isReleased() {
    //     if (this.exists === false) {
    //         return false;
    //     }
    //     // Check if the draw command is issued after logic
    //     // Prevents issues where button is non-responsive
    //     if (
    //         this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
    //         this.#lastFrameDrawn !== this.#pen.frameCount
    //     ) {
    //         return false;
    //     }
    //     if (this.isHovering()) {
    //         this.#up = this.#pen.mouse.leftReleased;
    //     } else {
    //         this.#up = false;
    //     }
    //     return this.#up;
    // }

    /**
     * Draws the slider's decorative elements (if any).
     */
    #drawDecorations() {
        switch (this.#pen.gui.theme) {
            case "retro":
				this.#pen.colour.stroke = "transparent";

				// White border
				this.#pen.colour.fill = "white";
				this.#pen.shape.rectangle(this.x, this.y, this.w + 1.5, this.h / 2 + 6.5);

                // Draw a black triangle bevel on the top left
                this.#pen.colour.fill = "black";
                this.#pen.shape.polygon(
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
                this.#pen.colour.fill = this.secondaryColour;
                this.#pen.shape.polygon(
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
    // /**
    //  * Returns true if the mouse is currently hovering over the checkbox
    //  * @returns {boolean} - True if the mouse is hovering over the checkbox
    //  */
    // isHovering() {
    //     return Checkbox.#isInRect(
    //         this.#pen.mouse.x,
    //         this.#pen.mouse.y,
    //         this.x,
    //         this.y,
    //         this.w,
    //         this.h
    //     );
    // }
    /**
     * Draws the slider track to the canvas based on theme.
     */
    #drawTrack() {
		switch (this.#pen.gui.theme) {
            case "retro":
				this.#drawDecorations();
				this.#pen.colour.fill = this.background;
				this.#pen.shape.rectangle(this.x, this.y, this.w - 5, this.h / 2);
				break;
			default:
			// Do nothing
		}
	}
	/**
     * Draws the slider background to the canvas based on theme.
     */
	#drawHandle() {
		switch (this.#pen.gui.theme) {
			case "retro":
				const size = this.#max - this.#min;
				const position = this.x - this.w / 2 + this.w * (this.#value / size);

				// Handle accent on sides
				this.#pen.colour.fill = this.accentColour;
				this.#pen.shape.rectangle(position, this.y, 10 + 2, this.h * 2);

				// Handle background
				this.#pen.colour.fill = this.background;
				this.#pen.shape.rectangle(position, this.y, 8, this.h * 2);
				break;
			default:
			// Do nothing
		}
	}
	/**
     * Draws the slider text popup to the canvas based on theme.
     */
	#drawPopup() {
		switch (this.#pen.gui.theme) {
			case "retro":
				const size = this.#max - this.#min;
				const position = this.x - this.w / 2 + this.w * (this.#value / size);

				// Popup background
				this.#pen.colour.fill = this.background;
				this.#pen.shape.rectangle(position, this.y - this.h * 2 - 5, 30, this.h * 2);

				// Popup triangle
				this.#pen.colour.fill = this.background;
				this.#pen.shape.polygon(
					position, 
					this.y - this.h * 2 + 15,
					position + 4,
					this.y - this.h * 2,
					position - 4,
					this.y - this.h * 2,

				);
				this.#pen.colour.fill = this.textColour;
				this.#pen.text.print(position, this.y - this.h * 2 - 5 + this.h / 2, this.#value.toString());
				break;
			default:
			// Do nothing
		}
	}
    /**
     * Draws the checkbox to the canvas based on its current state.
     */
    draw() {
		if (this.exists === false) {
            return false;
        }
        this.#pen.state.save();
        this.#pen.state.reset();
        this.#lastFrameDrawn = this.#pen.frameCount;

		// if(this.#isReleased()){
		// 	this.#checked = !this.#checked;
        //     if(this.#checked){
        //         this.#isAnimating = true;
        //         this.#animProgress = 0;
        //     }
		// }
		this.#drawTrack();
		this.#drawHandle();
		this.#drawPopup();
		// this.#drawUnchecked();
		// if (this.#checked){
		// 	this.#drawTick();
		// }
        this.#pen.state.load();
	}
    // /**
    //  * Returns true if the given x and y coordinates are within the bounds of the checkbox.
	//  * Includes a 2px border clickable area outside the actual checkbox
    //  * @param {number} x
    //  * @param {number} y
    //  * @param {number} centerX
    //  * @param {number} centerY
    //  * @param {number} width
    //  * @param {number} height
    //  * @returns {boolean}
    //  * @static
    //  */
    // static #isInRect(x, y, centerX, centerY, width, height) {
    //     const leftX = centerX - width / 2 - 2;
    //     const topY = centerY - height / 2 - 2;
    //     return (
    //         x >= leftX && x <= leftX + width + 4 && y >= topY && y <= topY + height + 4
    //     );
    // }
}
