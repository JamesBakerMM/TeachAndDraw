import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";
import { Tad } from "./TeachAndDraw.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Vector } from "./Vector.js";

export class Camera2 {
    #isActive;

    /** @type {Tad} */
    #tad;
    #position = new Vector(0, 0);
    #scale = 1;
    rotation = 0;

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

    set zoom(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `zoom has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.#scale = 1/value;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    applyTransforms( ctx ) {
        ctx.translate(+this.#tad.w/2, +this.#tad.h/2);
        ctx.rotate(-this.rotation);
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
        tmp.rotate(-this.rotation);
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
        tmp.multiply(1/this.#scale);
        tmp.rotate(this.rotation);
        tmp.add(this.#position);
        return tmp;
    }

    draw() {
        if (this.#tad.debug) {
            Debug.drawCamera(
                this.#tad,
                { x: this.x, y: this.y },
                // { x: this.xOffset, y: this.yOffset }
            );
        }
    }
}