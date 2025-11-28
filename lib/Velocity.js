//errors
// import { ErrorMsgManager } from "./ErrorMessageManager.js";

export class Velocity {
    /** @type {number} */
    #x;

    /** @type {number} */
    #y;

    /** @type {number} */
    #direction = 0;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
        this.#recalcDirection();
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * @private
     * @param {number} value
     * private_internal
     * @returns {number}
     */
    static _adjustDegreesSoTopIsZero(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        let remapped = value + 90;

        // Ensure the degrees fit within the 0-360 range
        remapped = remapped % 360;

        if (remapped < 0) {
            remapped += 360;
        }

        return remapped;
    }

    /**
     * @private
     * @param {number} value
     * private_internal
     * @returns {number}
     */
    static _unadjustDegreesFromZero(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        let remapped = value - 90;

        // Ensure the degrees fit within the 0-360 range
        remapped = remapped % 360;

        if (remapped < 0) {
            remapped += 360;
        }

        return remapped;
    }

    /**
     * @private
     * @param {number} degree
     * @returns {number}
     */
    static _degreeToRadian(degree) {
        return degree * (Math.PI / 180);
    }
    /**
     * @private
     * @param {number} radian
     * @returns {number}
     */
    static _radianToDegree(radian) {
        return radian * (180 / Math.PI);
    }

    /**
     * @private
     * normalize the degrees to be within 0 - 360
     * @param {number} degree
     */
    static _normalizeDegree(degree) {
        degree = degree % 360;
        if (degree < 0) {
            degree += 360;
        }
        return degree;
    }

    /**
     * Recalc lastDirectionDeg when x/y change and vector is not zero.
     */
    #recalcDirection() {
        if (this.#x === 0 && this.#y === 0) {
            return;
        }
        const radian = Math.atan2(this.#y, this.#x);
        const degree = Velocity._radianToDegree(radian);
        const adjustedDegree = Velocity._adjustDegreesSoTopIsZero(degree); 
        this.#direction = Velocity._normalizeDegree(adjustedDegree);
    }

    get speed() {
        return Math.hypot(this.#x, this.#y);
    }

    /**
     * Sets the speed as man
     * @param {Number} value
     */
    set speed(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "speed has to be a number!"
                )
            );
        }
        const degree = this.direction;
        const adjustedDegree = Velocity._unadjustDegreesFromZero(degree);
        const radian = Velocity._degreeToRadian(adjustedDegree);

        this.#x = value * Math.cos(radian);
        this.#y = value * Math.sin(radian);
        return;
    }

    set direction(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "direction has to be a number!"
                )
            );
        }
        const normalizedDegree = Velocity._normalizeDegree(value);
        this.#direction = normalizedDegree;

        const adjustedDegree =
            Velocity._unadjustDegreesFromZero(normalizedDegree);

        const radian = Velocity._degreeToRadian(adjustedDegree);
        this.#x = this.speed * Math.cos(radian);
        this.#y = this.speed * Math.sin(radian);
        return;
    }

    get direction() {
        return this.#direction;
    }

    /**
     * @param {number} value
     */
    set _perfX(value) {
        this.#x = value;
        this.#recalcDirection();
        return;
    }

    /**
     * @return {number}
     */
    get _perfX() {
        return this.#x;
    }

    /**
     * @param {number} value
     */
    set _perfY(value) {
        this.#y = value;
        this.#recalcDirection();
        return;
    }

    /**
     * @returns {number}
     */
    get _perfY() {
        return this.#y;
    }

    /** @param {number} value */
    set x(value) {
        if (Number.isFinite(value)) {
            this.#x = value;
            this.#recalcDirection();
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value, "x has to be a number!")
        );
    }
    /**
     * @returns {number}
     */
    get x() {
        return this.#x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        if (Number.isFinite(value)) {
            this.#y = value;
            this.#recalcDirection();
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value, "y has to be a number!")
        );
    }

    /**
     * @returns {number}
     */
    get y() {
        return this.#y;
    }

    /**
     * @param {number} mx
     * @param {number} my
     * @returns
     */
    modify(mx, my) {
        this.x = this.#x + mx;
        this.y = this.#y + my;
        return;
    }
}

//Locks
Object.defineProperty(Velocity.prototype, "modify", {
    value: Velocity.prototype.modify,
    writable: false,
    configurable: false,
});
