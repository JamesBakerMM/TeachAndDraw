import { Debug } from "./Debug.js";
import { Tad } from "./TeachAndDraw.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Vector } from "./Vector.js";

export class Camera {
    /** @type {Tad} */
    #tad;
    #position = new Vector(0, 0);
    #rotation = 0;
    #scale    = 1;

    constructor(tad) {
        this.#tad = tad;
    }

    /**
     * @param {number} value
     */
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.#position.x = value;
    }
    get x() {
        return this.#position.x;
    }

    /**
     * @param {number} value
     */
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `y has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.#position.y = value;
    }
    get y() {
        return this.#position.y;
    }

    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(value, "value has to be a number!")
            );
        }
    
        this.#rotation = Math.PI * (value / 180);
    }

    get rotation() {
        return 180 * (this.#rotation / Math.PI);
    }

    set zoom(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(value, "value has to be a number!")
            );
        }

        this.#scale = this.#tad.math.clamp(value, 0.1, 10);
    }
    
    get zoom() {
        return this.#scale;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} speed
     */
    moveTo(x, y, speed=0.1) {
        const dt = this.#tad.time.msElapsed;
        this.x += speed * (x - this.x);
        this.y += speed * (y - this.y);
        // this.x = this.#tad.math.flerp(this.x, x, dt, speed);
        // this.y = this.#tad.math.flerp(this.y, y, dt, speed);
    }

    /**
     * 
     * @param {number} target Target angle in degrees
     * @param {number} speed
     */
    rotateTo(target, speed=0.1) {
        const dt = this.#tad.time.msElapsed;
        const rad = Math.PI * (target / 180);

        target %= 360;
        let curr = this.rotation % 360;
    
        const diff = Math.abs(target - curr);

        if (diff < 180) {
            this.rotation += speed * (target - curr);
        } else {
            target += 360;
            this.rotation += speed * (target - curr);
        }
    }


    /**
     * @param {number} target Target zoom
     * @param {number} speed
     */
    zoomTo(target, speed=0.1) {
        const dt = this.#tad.time.msElapsed;
        this.zoom += speed * (target - this.zoom);
        // this.x = this.#tad.math.flerp(this.x, x, dt, speed);
        // this.y = this.#tad.math.flerp(this.y, y, dt, speed);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    applyTransforms( ctx ) {
        ctx.translate(+this.#tad.w/2, +this.#tad.h/2);
        ctx.rotate(-this.#rotation);
        ctx.scale(this.#scale, this.#scale);
        ctx.translate(-this.x, -this.y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Vector} temporary-use vector
     */
    worldToScreen(x, y) {
        const tmp = Vector.temp(x, y);
        tmp.subtract(this.#position);
        tmp.rotate(-this.#rotation);
        tmp.multiply(this.#scale);
        tmp.x += this.#tad.w/2;
        tmp.y += this.#tad.h/2;
        return tmp;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Vector} temporary-use vector
     */
    screenToWorld(x, y) {
        const tmp = Vector.temp(x, y);
        tmp.x -= this.#tad.w/2;
        tmp.y -= this.#tad.h/2;
        tmp.rotate(this.#rotation);
        tmp.multiply(1/this.#scale);
        tmp.add(this.#position);
        return tmp;
    }

    draw() {
        if (this.#tad.debug) {
            Debug.drawCamera(this.#tad);
        }
    }
}