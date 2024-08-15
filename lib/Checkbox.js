import { ShapedAssetEntity } from "./Entity.js";

/**
 * A class that represents a natively drawn checkbox on the canvas (NOT an HTML element)
 * which can be interacted with by the user.
 * @extends ShapedAssetEntity
 */
export class Checkbox extends ShapedAssetEntity {
    #pen;
    #up;
    #lastFrameDrawn;
    #checked;
	#name;
	#value;
    /**
     * Creates an instance of Checkbox.
     * @param {number} x - The x-coordinate of the checkbox.
     * @param {number} y - The y-coordinate of the checkbox.
     * @param {number} w - The width of the checkbox.
     * @param {number} h - The height of the checkbox. Is set to w in makeCheckbox if no h given.
     * @throws {Error} If the x, y, w, or h values are not numbers.
     * @property {string} style - The style of the checkbox.
     * @property {string} background - The background colour of the checkbox.
     * @property {string} secondaryColour - The secondary colour of the checkbox.
     * @property {string} accentColour - The accent colour of the checkbox (tick colour).
     * @property {boolean} up - True if the checkbox has just been released after being pressed.
     * @property {number} w - The width of the checkbox.
     * @property {number} h - The height of the checkbox.
     * @property {boolean} exists - True if the checkbox exists.
     * @property {number} x - The x-coordinate of the checkbox.
     * @property {number} y - The y-coordinate of the checkbox.
     * @constructor
     */
    constructor(x, y, w, h, pen) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false ||
            Number.isFinite(h) === false
        ) {
            throw Error(
                `You need to give numbers for x, y, w, and (if given a value) h.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n` +
                    `h: ${h}:${typeof h}\n`
            );
        }
        super(pen, x, y, w, h);
        this.#pen = pen;
		this.#checked = false; //default unchecked

        //state managment properties
        this.#up = false;
        this.#lastFrameDrawn = 0;

        //appearance properties
        this.style = "default";
        this.background = this.#pen.gui.primaryColour;
        this.secondaryColour = this.#pen.gui.secondaryColour;
        this.accentColour = this.#pen.gui.accentColour;
    }

	/**
	 * Returns true if the checkbox is checked.
	 * @returns {boolean}
	 */
    get checked() {
		return this.#checked;
	}
	/** Set the value of the checked parameter.
	 * @param {boolean} value
	 */
	set checked(value) {
		if (this.exists === false) {
            return false;
        }
		if((typeof value === "boolean") === false){
			const stringBooleanMessage = (value === "true" || value === "false") 
				? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings.` 
				: ""
			throw Error(
				`You need to give a boolean (true or false) for checked. ` + 
				`You gave ${value}, which is a ${typeof value}. ` + stringBooleanMessage
			);
		}
		this.#checked = value;
	}

	/**
	 * Returns the value property of the checkbox.
	 * @returns {any}
	 */
    get value() {
		return this.#value;
	}
	/** Set the value property of the checkbox.
	 * @param {any} value
	 */
	set value(value) {
		if (this.exists === false) {
            return false;
        }
		// Throw error if value is NaN or Infinity
		if (
			(typeof value === "number" && isNaN(value)) 
			|| value === Number.POSITIVE_INFINITY 
			|| value === Number.NEGATIVE_INFINITY
		){
			throw Error(
				`The value property cannot be NaN or infinity. ` + 
				`You gave ${value}. `
			);
		}
		this.#value = value;
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

    /**
     * Returns true if the checkbox has just been released after being pressed.
     * @returns {boolean}
     */
    #isReleased() {
        if (this.exists === false) {
            return false;
        }
        // Check if the draw command is issued after logic
        // Prevents issues where button is non-responsive
        if (
            this.#lastFrameDrawn !== this.#pen.frameCount - 1 &&
            this.#lastFrameDrawn !== this.#pen.frameCount
        ) {
            return false;
        }
        if (this.isHovering()) {
            this.#up = this.#pen.mouse.leftReleased;
        } else {
            this.#up = false;
        }
        return this.#up;
    }

    /**
     * Draws the checkbox's decorative elements (if any).
     */
    #drawDecorations() {
        switch (this.#pen.gui.theme) {
            case "retro":
                // Draw a black triangle bevel on the top left
                this.#pen.colour.fill = "black";
                this.#pen.shape.polygon(
                    // Top Left
                    this.x - this.w / 2 + 1,
                    this.y - this.h / 2 + 1,
                    // Top Right
                    this.x + this.w / 2 - 1,
                    this.y - this.h / 2 + 1,
                    // Bottom Left
                    this.x - this.w / 2 + 1,
                    this.y + this.h / 2 - 1
                );
                
                // Draw a grey triangle bevel on the bottom right
                this.#pen.colour.fill = this.secondaryColour;
                this.#pen.shape.polygon(
                    // Top Right
                    this.x + this.w / 2 - 1,
                    this.y - this.h / 2 + 1,
                    // Bottom Right
                    this.x + this.w / 2 - 1,
                    this.y + this.h / 2 - 1,
                    // Bottom Left
                    this.x - this.w / 2 + 1,
                    this.y + this.h / 2 - 1
                );
                break;
            default:
            // Do nothing
        }
    }
    /**
     * Returns true if the mouse is currently hovering over the checkbox
     * @returns {boolean} - True if the mouse is hovering over the checkbox
     */
    isHovering() {
        return Checkbox.#isInRect(
            this.#pen.mouse.x,
            this.#pen.mouse.y,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
	/**
	 * Draws the background and borders with decorations.
	 */
	#drawUnchecked(){
		this.#drawDecorations();
		this.#pen.colour.fill = this.background;
		if (this.isHovering()) {
			this.#pen.colour.fill = this.secondaryColour;
		}
		this.#pen.shape.rectangle(this.x, this.y, this.w - 8, this.h - 8);
	}
	/**
	 * Draws the tick inside the checkbox, depending on the GUI theme.
	 */
	#drawTick(){
		switch (this.#pen.gui.theme) {
            case "retro":
				// Three triangles, plus the border shape
				// A rectangle that represents the tick. Needs to be first before the others
				// Then I need to animate it. Probably need to add some properties?
				// isAnimating? 
				// Draw a black tick
                this.#pen.colour.fill = this.accentColour;
                this.#pen.colour.stroke = "transparent";
				const border = this.w * 0.05; //5% border
				const innerWidth = this.w - 8;
				const innerHeight = this.h - 8;
				const thickness = innerHeight / 4;

                // Tick. Animated box underneath cover shapes
				this.#pen.shape.rectangle(this.x, this.y, this.w - 10, this.h - 10);

                this.#pen.colour.fill = this.background;
                if (this.isHovering()) {
                    this.#pen.colour.fill = this.secondaryColour;
                }
                
                // Top Shape
                this.#pen.shape.polygon(
                    // Top Left
                    this.x - innerWidth / 2 + border,
                    this.y - innerHeight / 7,
                    // Top Left
                    this.x - innerWidth / 2 + border,
                    this.y - innerHeight / 2 + 1,
                    // Top Left
                    this.x + innerWidth / 2 - border,
                    this.y - innerHeight / 2 + 1,
					// Top Right
					this.x + innerWidth / 2 - border,
					this.y - innerHeight / 5 - thickness + border,
					// Top Middle
					this.x - innerWidth / 7,
					this.y + innerHeight / 3 - thickness,
                );

                // Bottom Shape
                this.#pen.shape.polygon(
					// Bottom Left
					this.x - innerWidth / 2 + border,
                    this.y - innerHeight / 7 + thickness,
                    // Bottom Left
					this.x - innerWidth / 2 + border,
                    this.y + innerHeight / 2 - 1,
                    // Bottom Left
					this.x + innerWidth / 2 - border,
                    this.y + innerHeight / 2 - 1,
					// Bottom Right
					this.x + innerWidth / 2 - border,
					this.y - innerHeight / 5 + border,
                    // Bottom Middle
					this.x - innerWidth / 7,
					this.y + innerHeight / 3,
                );

                // Left Rectangle
                this.#pen.shape.rectangle(
                    this.x - innerWidth / 2 + border / 2 + 1,
                    this.y,
                    border,
                    innerHeight - 2
                );

                // Right Rectangle
                this.#pen.shape.rectangle(
                    this.x + innerWidth / 2 - border / 2 - 1,
                    this.y,
                    border,
                    innerHeight - 2
                );
				break;
			default:
				//Do nothing
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

		if(this.#isReleased()){
			this.#checked = !this.#checked;
		}

		this.#drawUnchecked();
		if (this.#checked){
			this.#drawTick();
		}
        this.#pen.state.load();
    }
    /**
     * Returns true if the given x and y coordinates are within the bounds of the checkbox.
	 * Includes a 2px border clickable area outside the actual checkbox
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
        const leftX = centerX - width / 2 - 2;
        const topY = centerY - height / 2 - 2;
        return (
            x >= leftX && x <= leftX + width + 4 && y >= topY && y <= topY + height + 4
        );
    }
}
