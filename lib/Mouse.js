import { InputDevice } from "./InputDevice.js";
import { Tad } from "./TeachAndDraw.js";
import { Paint } from "./Paint.js";
import { Debug } from "./Debug.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

/**
 * @typedef {MouseEvent & {
 *   adjustedX?: number,
 *   adjustedY?: number,
 *   adjusted?: boolean,
 *   isCanvas?: boolean,
 *   isBody?: boolean,
 *   wheelDeltaX:number,
 *   wheelDeltaY:number,
 * }} CustomMouseEvent
 */

/**
 * @typedef {import("./Collider.js").Collider} Collider
 */

export class Mouse extends InputDevice {
    #leftDown;
    #rightDown;
    #leftReleased;
    #rightReleased;
    #position;
    #wheelDelta;
    #fill;
    #stroke;
    /**
     * @type {Collider}
     */
    #collider;

    /**
     * @param {Tad} tad
     */
    constructor(tad) {
        super(tad);
        this.tad = tad;
        this.#fill = Paint.white;
        this.#stroke = Paint.black;
        this.#position = tad.makePoint(0, 0);
        this.previous = tad.makePoint(0, 0);
        this.wheel = {
            up: false,
            down: false,
        };
        this.#wheelDelta = 0;

        this.#leftDown = false;
        this.#rightDown = false;
        this.#leftReleased = false;
        this.#rightReleased = false;

        Object.preventExtensions(this); //protect against accidental assignment;
    }
    get fill() {
        return this.#fill;
    }
    set fill(value) {
        if (!this.tad.colour.isValid(value)) {
            throw Error(ErrorMsgManager.colourCheckFailed(value));
        }
        this.#fill = value;
    }
    get stroke() {
        return this.#stroke;
    }
    set stroke(value) {
        if (!this.tad.colour.isValid(value)) {
            throw Error(ErrorMsgManager.colourCheckFailed(value));
        }
        this.#stroke = value;
    }
    get leftDown() {
        return this.#leftDown;
    }
    get rightDown() {
        return this.#rightDown;
    }
    get leftReleased() {
        return this.#leftReleased;
    }
    get rightReleased() {
        return this.#rightReleased;
    }

    get collider() {
        // In the future it may be worth looking into changing this into a group
        // of three colliders which conform to the shape of the cursor.

        if (this.#collider === undefined) {
            this.#collider = this.tad.makeCircleCollider(0, 0, 16);
            this.#collider.static = true;
        }

        return this.#collider;
    }

    /**
     * private_internal
     */
    initEventListeners() {
        const body = document.querySelector("body");

        body.addEventListener("mousemove", 
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isBody = true;
                this.#updateMousePosition(event);
            }
        );
        this.tad.canvas.addEventListener("mousemove", 
            
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                this.#updateMousePosition(event);
            }
        ); 

        //mouse pressing
        this.tad.canvas.addEventListener(
            "mousedown",
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                this.#updateMousePosition(event);
            }
        );

        this.tad.canvas.addEventListener(
            "mouseup",
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                this.#updateMousePosition(event);
            }
        );

        //mouse wheel
        this.tad.canvas.addEventListener(
            "wheel",
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                this.#updateMousePosition(event);
            }
        );

        //stop default context menu
        this.tad.canvas.addEventListener(
            "contextmenu",
            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                event.preventDefault();
            }
        );

        //Not currently using the same logic as other mouse event listeners

        this.tad.canvas.addEventListener(
            "wheel",

            /** @param {CustomMouseEvent} event */
            (event) => {
                event.isCanvas = true;
                this.#wheelDelta += event.wheelDeltaY;
                if (event.wheelDeltaY < 0) {
                    this.wheel.up = false;
                    this.wheel.down = true;
                } else if (event.wheelDeltaY > 0) {
                    this.wheel.up = true;
                    this.wheel.down = false;
                }
            }
        );
    }

    draw() {
        this.tad.state.reset();
        if (this.tad.frameCount % 10 === 0) {
            this.wheel.up = false;
            this.wheel.down = false;
        }
        if (this.tad.debug) {
            Debug.drawMouse(this.tad, this);
        } else {
            this.tad.state.save();
            this.tad.state.reset();
            this.tad.colour.fill = this.fill;
            this.tad.colour.stroke = this.stroke;
            const SIZE = 13;
            this.tad.shape.polygon(
                this.x,
                this.y,
                this.x,
                this.y + SIZE * 1.5,
                this.x + SIZE,
                this.y + SIZE
            );

            this.collider.position.x = (3 * this.x + SIZE) / 3;
            this.collider.position.y = (3 * this.y + 2.5 * SIZE) / 3;
            // this.collider.rotation = 180.0 * (Math.atan2(this.y-this.y+SIZE, this.x-this.x+SIZE) / Math.PI);

            this.tad.state.load();
        }
        this.endOfFrame();
    }

    /**
     * private_internal
     */
    endOfFrame() {
        super.endOfFrame();
        this.previous.x = this.#position.x;
        this.previous.y = this.#position.y;
        if (this.leftReleased) {
            this.#leftDown = false;
        }
        if (this.rightReleased) {
            this.#rightDown = false;
        }
        this.#leftReleased = false;
        this.#rightReleased = false;
        for (let i = 0; i < this.activeBuffer.length; i++) {
            const EVENT = /** @type {CustomMouseEvent} */ (this.activeBuffer[i]);
            switch (EVENT.type) {
                case "mousemove":
                    //update state variables: type of event, x and y
                    break;
                case "mousedown":
                    switch (EVENT.button) {
                        case 0:
                            this.#leftDown = true;
                            break;
                        case 2:
                            this.#rightDown = true;
                            break;
                    }
                    break;
                case "mouseup":
                    switch (EVENT.button) {
                        case 0:
                            this.#leftReleased = true;
                            break;
                        case 2:
                            this.#rightReleased = true;
                            break;
                    }
                    break;
                case "wheel":
                    break;
            }
            this.#position.x = EVENT.adjustedX;
            this.#position.y = EVENT.adjustedY;
        }
    }
    /**
     *
     * @param {CustomMouseEvent} event
     */
    #updateMousePosition(event) {
        const rect = this.tad.canvas.getBoundingClientRect();
        const adjustedX = event.clientX - rect.left;
        const adjustedY = event.clientY - rect.top;

        event.adjustedX = adjustedX;
        event.adjustedY = adjustedY;
        event.adjusted = true;
        // Create a new custom event object with adjusted coordinates
        this.store(event);
    }
    /**
     * Gets the current x-coordinate of the mouse relative to the canvas.
     *
     * @returns {number} The x-coordinate of the mouse.
     */
    get x() {
        return this.#position.x;
    }
    /**
     * Gets the current y-coordinate of the mouse relative to the canvas.
     *
     * @returns {number} The y-coordinate of the mouse.
     */
    get y() {
        return this.#position.y;
    }
}
