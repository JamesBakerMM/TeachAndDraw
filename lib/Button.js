import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import {Point} from "./Point.js";
export class Button extends Entity {
    #pen;
    #mouseDownOnButton;
    constructor(x, y, w, h, label = `E:${this.id}`, pen) {
        super(x,y);
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

        this.context = pen.context;

        this.fill = "grey";
        this.stroke = "black";
        this.label = label;
        this.font = null;
        this.textSize = 12;
        this.wordwrap = false;
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
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = "black";
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
        this.#pen.text.alignment = "center";
        this.#pen.text.baseline = "middle";
        this.#pen.text.size=16;

        if(this.#pen.debug){
            Debug.drawButton(this.#pen,this);
            return this.#pen.debug
        }

        this.#pen.state.save();

        let isHovered = this.isHovered();

        if (isHovered) {
            //this.#pen.mouse.buttonCursor();
            this.drawHover();

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

            this.drawIdle();

        }

        this.#pen.state.load();
        if (isHovered) {
            return "HOVERED";
        } else {
            return "IDLE";
        }
    }
}
