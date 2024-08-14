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
     * Creates an instance of Buttono on the canvas.
     * @example
     * const checkbox = new Checkbox(100, 100, 100, 50, pen);
     * checkbox.draw(); // Inside your update function.
	 * or should it be
	 * const checkbox = makeCheckbox(100, 300, 30);
	 * checkbox.draw();
     * @param {number} x - The x-coordinate of the checkbox.
     * @param {number} y - The y-coordinate of the checkbox.
     * @param {number} w - The width of the checkbox.
     * @param {number} [h] - The height of the checkbox [optional]. //optional, in Pen, not here?
     * @throws {Error} If the x, y, w, or h values are not numbers.
     * 
     * @property {string} style - The style of the button.
     * @property {string} border - The border colour of the button.
     * @property {string} background - The background colour of the button.
     * @property {string} secondaryColour - The secondary colour of the button.
     * @property {string} accentColour - The accent colour of the button.
     * @property {boolean} up - True if the button has just been released after being pressed.
     * @property {number} w - The width of the button.
     * @property {number} h - The height of the button.
     * @property {boolean} exists - True if the button exists.
     * @property {number} x - The x-coordinate of the button.
     * @property {number} y - The y-coordinate of the button.
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
        this.border = "black";
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
	/** Set the value of the checked parameter
	 * @param {boolean} value
	 */
	set checked(value) {
		if (this.exists === false) {
            return false;
        }
		if((typeof value === "boolean") === false){
			const stringBooleanMessage = (value === "true" || value === "false") ? `\nTo be booleans, true and false must be written without quotation marks, otherwise they become strings` : ""
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
	/** Set the value property of the checkbox
	 * @param {any} value
	 */
	set value(value) {
		if (this.exists === false) {
            return false;
        }
		//what type checking is needed if it can be any data type?
		this.#name = value;
	}

	/**
	 * Returns string for name property.
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}
	/** Set the value of the name parameter
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
     * Draws the button's decorative elements (if any).
     */
    #drawDecorations() {
        switch (this.#pen.gui.theme) {
            case "retro":
                // Draw a white triangle bevel on the top left
                this.#pen.colour.fill = "black";
                this.#pen.stroke = "transparent";
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
	#drawUnchecked(){
		this.#drawDecorations();
		this.#pen.colour.fill = this.background;
		this.#pen.shape.rectangle(this.x, this.y, this.w - 8, this.h - 8);
	}
	#drawTick(){
		switch (this.#pen.gui.theme) {
            case "retro":
				// Draw a black tick
                this.#pen.colour.fill = "black";
                this.#pen.colour.stroke = "transparent";
				const border = this.w * 0.05; //5% border
				const innerWidth = this.w - 8;
				const innerHeight = this.h - 8;
				const thickness = innerHeight / 4;
                this.#pen.shape.polygon(
                    // Top Left
                    this.x - innerWidth / 2 + border,
                    this.y - innerHeight / 7,
					// Bottom Left
					this.x - innerWidth / 2 + border,
                    this.y - innerHeight / 7 + thickness,
					// Bottom Middle
					this.x - innerWidth / 7,
					this.y + innerHeight / 3,
					// Bottom Right
					this.x + innerWidth / 2 - border,
					this.y - innerHeight / 5 + border,
					// Top Right
					this.x + innerWidth / 2 - border,
					this.y - innerHeight / 5 - thickness + border,
					// Top Middle
					this.x - innerWidth / 7,
					this.y + innerHeight / 3 - thickness,
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
     * Returns true if the given x and y coordinates are within the bounds of the button.
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
