import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Mouse extends InputDevice {
    #pen;
    #canvas;
    #cursor;
    #validValues
    constructor(pen) {
        super();
        this.#pen = pen;
        this.position = this.#pen.makePoint(0, 0);
        this.previous = this.#pen.makePoint(0, 0);
        this.#cursor="default";
        this.isPressed = false;

        this.#validValues=new Set();
        this.#validValues.add("default");
        this.#validValues.add("hidden");
        this.#validValues.add("pointer");

        // Setup event listeners
        this.initializeMouseEvents();
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    set cursor(value) {
        if (this.#validValues.has(value)) {
            this.#cursor=value;
        }
        return this.#cursor
    }

    get cursor(){
        return this.#cursor
    }

    initializeMouseEvents() {
        this.#pen.canvas.addEventListener("mousemove", (event) => {
            const rect = this.#pen.canvas.getBoundingClientRect();
            const scaleX = this.#pen.canvas.width / rect.width;
            const scaleY = this.#pen.canvas.height / rect.height;

            this.position.x = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
            this.position.y = (event.clientY - rect.top) * scaleY; // been adjusted to be relative to element
        });

        //mouseIsPressed
        this.#pen.canvas.addEventListener("mousedown", () => {
            this.isPressed = true;
        });

        this.#pen.canvas.addEventListener("mouseup", () => {
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