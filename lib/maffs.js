//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Tad } from "./TeachAndDraw.js";

export class Maffs {
    #tad;
    /**
     * @param {Tad} tad 
     */
    constructor(tad) {
        this.#tad = tad;
    }

    /**
     * 
     * @param {number} value 
     */
    abs(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return Math.abs(value);
    }

    /**
     * Rounds a number down to the nearest integer.
     * @param {number} value - The number to floor.
     * @returns {number} The closest integer that is less than or equal to the input.
     * @throws {Error} If the input is not a number.
     */
    floor(value){
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return Math.floor(value);
    }

    /**
     * Rounds a number up to the nearest integer.
     * @param {number} value - The number to ceiling.
     * @returns {number} The closest integer that is greater than or equal to the input.
     * @throws {Error} If the input is not a number.
     */
    ceiling(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return Math.ceil(value);
    }
    
    /**
     * Rounds a number to the nearest integer.
     * @param {number} value - The number to round.
     * @returns {number} The integer that is closest to the input.
     * @throws {Error} If the input is not a number.
     */
    round(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return Math.round(value);
    }

    /**
     *
     * @param {number} value
     * private_internal
     * @returns {number}
     */
    adjustDegressSoTopIsZero(value) {
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
     *
     * @param {number} value
     * private_internal
     * @returns {number}
     */
    unadjustDegreesFromZero(value) {
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
     *
     * @param {number} value
     * @returns
     */
    degreeToRadian(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return value * (Math.PI / 180);
    }
    /**
     *
     * @param {number} value
     * @returns
     */
    radianToDegree(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        return value * (180 / Math.PI);
    }
    //set up of sin,cos, tan etc using degrees

    /**
     * Takes degree to do sin on
     * @param {number} value
     * @returns
     */
    sin(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        const angle = this.degreeToRadian(value);
        return Math.sin(angle);
    }

    /**
     *
     * @param {number} value
     * @returns
     */
    cos(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        const angle = this.degreeToRadian(value);
        return Math.cos(angle);
    }

    /**
     *
     * @param {number} value
     * @returns
     */
    tan(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        let angle = this.degreeToRadian(value);
        return Math.tan(angle);
    }
    /**
     *
     * @param {number} value
     * @returns
     */
    atan(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value));
        }
        let angleRadians = Math.atan(value);
        return this.radianToDegree(angleRadians);
    }
    /**
     *
     * @param {number} y
     * @param {number} x
     * @returns
     */
    atan2(y, x) {
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        let angleRadians = Math.atan2(y, x);
        return this.radianToDegree(angleRadians);
    }
    /**
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns
     */
    distance(x1, y1, x2, y2) {
        if (Number.isFinite(x1) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    x1,
                    "xStart has to be a number!"
                )
            );
        }
        if (Number.isFinite(x2) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    x2,
                    "xEnd has to be a number!"
                )
            );
        }
        if (Number.isFinite(y1) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    y1,
                    "yStart has to be a number!"
                )
            );
        }
        if (Number.isFinite(y2) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    y2,
                    "yEnd has to be a number!"
                )
            );
        }
        let distX = x2 - x1;
        let distY = y2 - y1;
        return Math.sqrt(distX * distX + distY * distY);
    }

    /**
     * @param {number} minVal 
     * @param {number} maxVal 
     * @returns 
     */
    random(minVal, maxVal) {
        if (Number.isFinite(minVal) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    minVal,
                    "the 1st value has to be a number!"
                )
            );
        }

        if (maxVal === undefined) {
            // If secondVal is not provided, return a random number from 0 to firstVal
            return Math.random() * minVal;
        }

        if (Number.isFinite(maxVal) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    maxVal,
                    "the 2nd value has to be a number!"
                )
            );
        }

        if (minVal > maxVal) {
            throw Error("firstVal must be less than or equal to secondVal");
        }
        return Math.random() * (maxVal - minVal) + minVal;
    }
    /**
     * Re-maps a number from one range to another.
     *
     * @param {number} value - The number to re-map.
     * @param {number} currentRangeMin - The lower bound of the number's current range.
     * @param {number} currentRangeMax - The upper bound of the number's current range.
     * @param {number} targetRangeMin - The lower bound of the number's target range.
     * @param {number} targetRangeMax - The upper bound of the number's target range.
     * @returns {number} The re-mapped number.
     */
    rescaleNumber(
        value,
        currentRangeMin,
        currentRangeMax,
        targetRangeMin,
        targetRangeMax
    ) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "the 1st value has to be a number!"
                )
            );
        }
        if (Number.isFinite(currentRangeMin) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    currentRangeMin,
                    "the 2nd value has to be a number!"
                )
            );
        }
        if (Number.isFinite(currentRangeMax) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    currentRangeMax,
                    "the 3rd value has to be a number!"
                )
            );
        }
        if (Number.isFinite(targetRangeMin) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    targetRangeMin,
                    "the 4th value has to be a number!"
                )
            );
        }
        if (Number.isFinite(targetRangeMax) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    targetRangeMax,
                    "the 5th value has to be a number!"
                )
            );
        }

        if (currentRangeMax - currentRangeMin === 0) {
            throw new Error("Input range cannot be zero.");
        }

        return (
            ((value - currentRangeMin) * (targetRangeMax - targetRangeMin)) /
                (currentRangeMax - currentRangeMin) +
            targetRangeMin
        );
    }
}

//locks to make the methods read only
Object.defineProperty(Maffs.prototype, "adjustDegressSoTopIsZero", {
    value: Maffs.prototype.adjustDegressSoTopIsZero,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "degreeToRadian", {
    value: Maffs.prototype.degreeToRadian,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "radianToDegree", {
    value: Maffs.prototype.radianToDegree,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "sin", {
    value: Maffs.prototype.sin,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "cos", {
    value: Maffs.prototype.cos,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "tan", {
    value: Maffs.prototype.tan,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "atan", {
    value: Maffs.prototype.atan,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "atan2", {
    value: Maffs.prototype.atan2,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "random", {
    value: Maffs.prototype.random,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "floor", {
    value: Maffs.prototype.floor,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "floor", {
    value: Maffs.prototype.floor,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "ceiling", {
    value: Maffs.prototype.ceiling,
    writable: false,
    configurable: false,
});

Object.defineProperty(Maffs.prototype, "round", {
    value: Maffs.prototype.round,
    writable: false,
    configurable: false,
});
