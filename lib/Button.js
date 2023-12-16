import { Entity } from "./Entity.js";

export class Button extends Entity {
    #pen;
    #mouseDownOnButton;
    constructor(x, y, w, h, label = `E:${this.id}`, pen) {
        super();
        this.#pen = pen;
        this.#mouseDownOnButton = false;
        this.x = x;
        this.y = y;
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
     * Handles the hover state of the button.
     */
    handleHover() {
        if (this.#pen.debug) {
            this.drawHoveredDebug();
        } else {
            this.drawHover();
        }
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
    drawDebug() {
        this.#pen.text.size=10;
        const strokeColour = "rgb(0,255,0)";
        const fillColour = "rgba(0,155,0,0.5)";
        this.#pen.colour.fill = fillColour;
        this.#pen.colour.stroke = strokeColour;

        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = strokeColour;
        this.#pen.text.draw(this.x, this.y + 20, this.label);
        for (let i = 0; i < this.w / 10; i++) {
            let x1 = this.x - this.w / 2 + i * 10 + 20;
            let y1 = this.y - this.h / 2;
            let x2 = this.x - this.w / 2 + i * 10;
            let y2 = this.y + this.h / 2;

            if (x1 > this.x + this.w / 2 === false) {
                this.#pen.shape.line(x1, y1, x2, y2);
            }
        }

        this.#pen.shape.oval(this.x, this.y, 10);
        this.#pen.colour.fill = "rgb(0,0,0)";
        this.#pen.text.draw(this.x, this.y, `${this.id}`);

        this.#pen.colour.fill = "black";
        this.#pen.shape.rectangle(this.x, this.y - this.h / 2 + 7, this.w, 15);
        this.#pen.colour.fill = "rgb(0,255,0)";
        this.#pen.text.draw(this.x, this.y - this.h / 2 + 7, `👆 Type:Btn`);
    }
    drawHoveredDebug() {
        this.#pen.text.size=10;
        let strokeColour = this.stroke;
        let fillColour = this.fill;
        strokeColour = "rgba(0,155,0,0.5)";
        fillColour = "rgba(0,255,0)";
        this.#pen.colour.fill = fillColour;
        this.#pen.colour.stroke = "black";

        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = "black";
        this.#pen.text.draw(this.x, this.y + 20, this.label);
        for (let i = 0; i < this.w / 10; i++) {
            let x1 = this.x - this.w / 2 + i * 10 + 20;
            let y1 = this.y - this.h / 2;
            let x2 = this.x - this.w / 2 + i * 10;
            let y2 = this.y + this.h / 2;

            if (x1 > this.x + this.w / 2 === false) {
                this.#pen.shape.line(x1, y1, x2, y2);
            }
        }

        this.#pen.shape.oval(this.x, this.y, 10);
        this.#pen.colour.fill = "rgb(0,255,0)";
        this.#pen.text.draw(this.x, this.y, `${this.id}`);

        this.#pen.colour.fill = "black";
        this.#pen.shape.rectangle(this.x, this.y - this.h / 2 + 7, this.w, 15);
        this.#pen.colour.fill = "rgb(0,255,0)";
        this.#pen.text.draw(this.x, this.y - this.h / 2 + 7, `👆 Type:Btn`);
    }
    drawIdle() {
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = "black";
        this.#pen.text.draw(this.x, this.y, this.label);
    }
    isHovered() {
        return this.#pen.mouse.position.isInRect(
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

        this.#pen.text.alignment = "center";
        this.#pen.text.baseline = "middle";
        this.#pen.text.size=16;

        let isHovered = this.isHovered();

        if (isHovered) {
            this.handleHover();

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
                this.#mouseDownOnButton = false; // Reset mouse down state
            }

            if (this.#pen.debug) {
                this.drawDebug();
            } else {
                this.drawIdle();
            }
        }

        this.#pen.state.load();
        if (isHovered) {
            return "HOVERED";
        } else {
            return "IDLE";
        }
    }
}
