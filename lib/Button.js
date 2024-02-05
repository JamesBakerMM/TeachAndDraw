import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Point } from "./Point.js";
export class Button extends Entity {
    #pen;
    #mouseDownOnButton;
    constructor(x, y, w, h, label = `E:${this.id}`, pen) {
        super(pen, x, y);
        this.#pen = pen;
        this.#mouseDownOnButton = false;
        this.w = w;
        this.h = h;
        this.func = () => {
            console.log(`you clicked entity #${this.id}!`);
        };
        this.onClick = () => {
            console.log(`you clicked entity #${this.id}!`);
        };

        this.fill = "grey";
        this.stroke = "black";
        this.label = label;
        this.font = null;
        this.textSize = 12;
        this.wordwrap = false;
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * Handles the press action on the button.
     */
    handlePress() {
        if (this.#mouseDownOnButton === false) {
            this.#mouseDownOnButton = true;
        }
    }

    /**
     * Handles the release action on the button.
     */
    handleRelease() {
        if (this.#mouseDownOnButton) {
            this.#mouseDownOnButton = false;

            if (this.isHovered()) {
                this.onClick(); // Trigger the clicked event if still hovered
            }
        }
    }

    drawHover() {
        let strokeColour = this.fill;
        let fillColour = this.stroke;
        fillColour = this.stroke;
        strokeColour = this.fill;

        this.#pen.colour.fill = fillColour;
        this.#pen.colour.stroke = strokeColour;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = strokeColour;
        this.#pen.text.draw(this.x, this.y, this.label);
    }
    drawIdle() {
        this.#pen.colour.fill = this.fill;
        this.#pen.colour.stroke = this.stroke;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = this.stroke;
        this.#pen.text.draw(this.x, this.y, this.label);
    }
    isHovered() {
        return Point.isInRect(
            this.#pen.mouse.x,
            this.#pen.mouse.y,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }

    /**
     * The main draw function of the button.
     */
    draw() {
        this.#pen.state.save();

        this.#pen.shape.xAlignment = "center";
        this.#pen.shape.yAlignment = "center";

        this.#pen.text.alignment = "center";
        this.#pen.text.baseline = "middle";
        this.#pen.text.size = 16;

        if (this.isHovered()) {
            //this.#pen.mouse.buttonCursor();
            if (this.#pen.debug) {
                console.log("kjhsdkfhsd debug");
                Debug.drawHoveredButton(this.#pen, this);
            } else {
                this.drawHover();
            }

            if (this.#pen.mouse.isPressed) {
                this.handlePress();
            } else {
                this.handleRelease();
            }
        } else {
            if (
                this.#mouseDownOnButton &&
                this.#pen.mouse.isPressed === false
            ) {
                this.#mouseDownOnButton = false;
            }
            if (this.#pen.debug) {
                Debug.drawIdleButton(this.#pen, this);
            } else {
                this.drawIdle();
            }
        }

        this.#pen.state.load();
        if (this.isHovered()) {
            return "HOVERED";
        } else {
            return "IDLE";
        }
    }
}
