import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";

export class Camera {
    xCenter;
    yCenter;
    xOffset;
    yOffset;
    #isActive;
    #pen;
    constructor(pen) {
        this.#pen = pen;
        this.#isActive = true;
        this.xCenter = pen.w / 2;
        this.yCenter = pen.h / 2;
        this.xOffset = 0;
        this.yOffset = 0;
    }
    /**
     * sets the camera internal center to a new position, called every cycle of draw to sync center as center of canvas
     * @param {number} x
     * @param {number} y
     */
    setCameraCenter(x, y) {
        if (x !== this.xCenter || y !== this.yCenter) {
            this.xCenter = x;
            this.yCenter = y;
            //changed the center! do I reset the offsets?
            //do I adjust them to be proportional to the new center?
        }
    }
    set isActive(value) {
        if (typeof value === "boolean") {
            ErrorMsgManager.booleanCheckFailed(
                value,
                "you can only set the camera to active with a boolean value"
            );
        }
        this.#isActive = value;
        return this.#isActive;
    }
    get isActive() {
        return this.#isActive;
    }
    /**
     * sets the cameras x offset
     * returns the cameras 'x' by adding its offset to its center
     * @param {number} value
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
        this.xOffset = (this.xCenter+this.xOffset)-value;
        return this.xCenter + this.xOffset;
    }
    /**
     * returns the cameras 'x' by adding its offset to its center
     * @param {number} value
     */
    get x() {
        return this.xCenter + this.xOffset;
    }
    /**
     * sets the cameras y offset
     * returns the cameras 'y' by adding its offset to its center
     * @param {number} value
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
        //calculate the offset

        this.yOffset = (this.yCenter+this.yOffset)-value;
        return this.yCenter + this.yOffset;
    }

    /**
     * returns the cameras 'x' by adding its offset to its center
     * @param {number} value
     */
    get y() {
        return this.yCenter + this.yOffset;
    }
    draw() {
        if (this.#pen.debug) {
            Debug.drawCamera(
                this.#pen,
                { x: this.xCenter, y: this.yCenter },
                { x: this.xOffset, y: this.yOffset }
            );
            //call a debug method that draws a indicator for: current camera location and the center it's tracked away from
        }
    }
}
