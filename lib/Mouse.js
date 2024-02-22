import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Mouse extends InputDevice {
    #pen;
    #cursor;
    #validValues
    #position
    #wheelDelta
    constructor(pen) {
        super();
        this.#pen = pen;
        this.#position = this.#pen.makePoint(0, 0);
        this.previous = this.#pen.makePoint(0, 0);
        this.#cursor="default";
        this.isPressed = false;
        this.left=false;
        this.right=false;
        this.wheel={
            up:false,
            down:false
        }
        this.#wheelDelta=0;
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
        //change to listen to document as well, cross compare the 2 to work out the new x and y

        this.#pen.canvas.addEventListener("mousemove", (event) => {
            const rect = this.#pen.canvas.getBoundingClientRect();
            const scaleX = this.#pen.canvas.width / rect.width;
            const scaleY = this.#pen.canvas.height / rect.height;

            this.#position.x = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
            this.#position.y = (event.clientY - rect.top) * scaleY; // been adjusted to be relative to element
        });

        this.#pen.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        //mouseIsPressed
        this.#pen.canvas.addEventListener("mousedown", (event) => {
            event.preventDefault();
            this.isPressed = true;
            if (event.button === 0) {
                this.left = true;
            } else if (event.button === 2) {
                this.right = true;
            }
        });
        
        this.#pen.canvas.addEventListener("mouseup", (event) => {
            event.preventDefault();
            this.isPressed = false;
            if (event.button === 0) {
                this.left = false;
            } else if (event.button === 2) {
                this.right = false;
            }
        });

        this.#pen.canvas.addEventListener("wheel", (event) => { 
            this.#wheelDelta += event.wheelDeltaY;
            if (event.wheelDeltaY < 0) {
                this.wheel.up = false;
                this.wheel.down = true;
            } else if (event.wheelDeltaY > 0) {
                this.wheel.up = true;
                this.wheel.down = false;
            }
        });
    }
    draw() {
        if(this.#pen.frameCount%10===0){
            this.wheel.up = false;
            this.wheel.down = false;
        }
        if (this.#pen.debug) {
            Debug.drawMouse(this.#pen,this);
        }
    }
    get x() {
        return this.#position.x;
    }
    get y() {
        return this.#position.y;
    }
}