import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Mouse extends InputDevice {
    #pen;
    #canvas;
    #cursor;
    constructor(pen) {
        super();
        this.#pen = pen;
        this.#canvas = pen.canvas;
        this.position = this.#pen.makePoint(0, 0);
        this.previous = this.#pen.makePoint(0, 0);
        this.#cursor="default";
        this.isPressed = false;

        // Setup event listeners
        this.initializeMouseEvents();
    }

    set cursor(value) {
        const validValues=["default","hidden","pointer"];
        
        if (validValues.includes(value)) {
            this.#cursor=value;
        }
        return this.#cursor
    }

    get cursor(){
        return this.#cursor
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
            Debug.drawMouse(this.#pen,this);
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