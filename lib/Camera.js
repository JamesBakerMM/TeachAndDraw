import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Tad } from "./TeachAndDraw.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

export class Camera {
    #isActive;
    #tad;
    /**
     * Creates an instance of the camera.
     * @example
     * camera.isActive = true;
     * camera.moveTo(100, 100);
     * camera.draw(); // For debug purposes
     * @param {Tad} tad
     * @property {boolean} isActive - The active status of the camera.
     * @property {number} x - The x-coordinate of the camera.
     * @property {number} y - The y-coordinate of the camera.
     * @property {number} xCenter - The x-coordinate of the camera center.
     * @property {number} yCenter - The y-coordinate of the camera center.
     * @property {number} xOffset - The x-coordinate offset of the camera.
     * @property {number} yOffset - The y-coordinate offset of the camera.
     * @constructor
     */
    constructor(tad) {
        this.#tad = tad;
        this.#isActive = true;
        this.xCenter = tad.w / 2;
        this.yCenter = tad.h / 2;
        this.xOffset = 0;
        this.yOffset = 0;
    }
    /**
     * Sets the camera internal center to a new position, called every cycle of draw to sync center as center of canvas.
     * @param {number} x
     * @param {number} y
     */
    setCameraCenter(x, y) {
        if (x !== this.xCenter || y !== this.yCenter) {
            this.xCenter = x;
            this.yCenter = y;
        }
    }

    /**
     * Sets the camera to be enabled or disabled based on the value passed.
     * @param {boolean} value - The active status of the camera.
     * @throws {Error} If the value is not a boolean.
     */
    set isActive(value) {
        if (typeof value === "boolean") {
            ErrorMsgManager.booleanCheckFailed(
                value,
                "you can only set the camera to active with a boolean value"
            );
        }
        this.#isActive = value;
        return;
    }

    /**
     * Returns whether the camera is active or not.
     * @returns {boolean} The active status of the camera.
     */
    get isActive() {
        return this.#isActive;
    }

    /**
     * Moves the camera to a new position.
     * @param {number} x
     * @param {number} y
     * @example
     * camera.moveTo(100, 100);
     * @throws {Error} If the value is not a finite number.
     */
    moveTo(x, y) {
        //calculate where x is on the screen
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    x,
                    "camera.moveTo(x,_) has to be a number!"
                )
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    y,
                    "camera.moveTo(_,y) has to be a number!"
                )
            );
        }
        this.xOffset = this.xCenter + this.xOffset - x;
        this.yOffset = this.yCenter + this.yOffset - y;
        //work out the newX
        //work out where it is currently
        //work out where the user has set x on the actual canvas in relation to this
        //calculate what the new total offset would be
        //calculate what the offset needs to be
    }

    /**
     * sets the camera's x offset.
     * @param {number} value
     * @example
     * camera.xOffset = 100;
     * @throws {Error} if the value is not a finite number (so not NaN or infinite)
     */
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "cameras x has to be a number!"
                )
            );
        }

        //add a warning check for if you are adding 100+ or -100+ to it as that may be an indicator of a misunderstanding

        const totalDifference = value - this.x;
        this.xOffset -= totalDifference;
    }

    /**
     * Returns the cameras 'x' by adding its offset to its center.
     * @returns {number} The x-coordinate of the camera.
     */
    get x() {
        return this.xCenter + this.xOffset;
    }

    /**
     * sets the cameras y offset
     * @param {number} value
     * @example
     * camera.yOffset = 100;
     * @throws {Error} if the value is not a finite number (so not NaN or infinite)
     */
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "cameras y has to be a number"
                )
            );
        }

        //add a warning check for if you are adding 100+ or -100+ to it as that may be an indicator of a misunderstanding

        const totalDifference = value - this.y;
        this.yOffset -= totalDifference;
        return;
    }

    /**
     * returns the cameras 'y' by adding its offset to its center
     * @returns {number} The y-coordinate of the camera.
     */
    get y() {
        return this.yCenter + this.yOffset;
    }

    /**
     * Draws the camera to the screen, for debug purposes.
     */
    draw() {
        if (this.#tad.debug) {
            Debug.drawCamera(
                this.#tad,
                { x: this.xCenter, y: this.yCenter },
                { x: this.xOffset, y: this.yOffset }
            );
        }
    }
}
