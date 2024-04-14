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
    teleportTo(){
        console.warn("needs a better name and not implemented yet")
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

        //add a warning check for if you are adding 100+ or -100+ to it as that may be an indicator of a misunderstanding 

        const totalDifference = value - this.x;
        this.xOffset -= totalDifference;
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

        //add a warning check for if you are adding 100+ or -100+ to it as that may be an indicator of a misunderstanding 
        
        const totalDifference = value - this.y;
        this.yOffset -= totalDifference;
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
        }
    }
}
