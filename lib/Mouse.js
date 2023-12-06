import { InputDevice } from "./InputDevice.js";

export class Mouse extends InputDevice {
    #cursorVisible;
    #pen;
    #canvas;
    #context;
    constructor(pen) {
        super();
        this.#pen = pen;
        this.#canvas = pen.canvas;
        this.#context = this.#pen.context;
        this.position = this.#pen.makePoint(0, 0);
        this.previous = this.#pen.makePoint(0, 0);
        this.#cursorVisible = true;
        this.isPressed = false;

        // Setup event listeners
        this.initializeMouseEvents();
    }

    /**
     * @param {boolean} value
     */
    set cursorVisible(value) {
        if (typeof value === "boolean") {
            this.#cursorVisible = value;
        }
        throw `cursorVisible requires a boolean, you passed it ${value}`;
    }

    initializeMouseEvents() {
        this.#canvas.addEventListener("mousemove", (event) => {
            const rect = this.#canvas.getBoundingClientRect();
            const scaleX = this.#canvas.width / rect.width;
            const scaleY = this.#canvas.height / rect.height;

            this.position.x = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
            this.position.y = (event.clientY - rect.top) * scaleY; // been adjusted to be relative to element
        });

        //mouseIsPressed
        this.#canvas.addEventListener("mousedown", () => {
            this.isPressed = true;
        });

        this.#canvas.addEventListener("mouseup", () => {
            this.isPressed = false;
        });

        document.addEventListener("mouseup", () => {
            this.isPressed = false;
        });
    }
    draw() {
        if (this.#pen.debug) {
            if (this.isPressed) {
                const prevStroke = this.#pen.colour.stroke;
                const prevFill = this.#pen.colour.fill;

                this.#pen.colour.fill = "green";

                this.#pen.text.draw(
                    this.position.x - 20,
                    this.position.y - 10,
                    `🖱️ x:${parseInt(this.x)} y:${parseInt(this.y)}`
                );

                this.#pen.colour.stroke = prevStroke;
                this.#pen.colour.fill = prevFill;
            }
        }
    }
    get x() {
        //get bounding rect
        //check mouse position within that
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
}
