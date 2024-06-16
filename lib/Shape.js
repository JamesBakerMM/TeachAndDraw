import { Debug } from "./Debug.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

import { Alignment } from "./Alignment.js";

const DEFAULT_STROKE_DASH = 0;

export class Shape {
    #pen;
    #rotation
    /**
     *
     * @param {Object} pen
     */

    #strokeDash;
    constructor(pen) {
        Object.defineProperty(this, 'alignment', {
            value: new Alignment(),
            writable: false, 
            configurable: false,
        });
        this.#pen = pen;
        this.#strokeDash = DEFAULT_STROKE_DASH;
        console.log(pen)
        this.#rotation = pen.math.adjustDegressSoTopIsZero(0);
        Object.seal(this); 
    }
    get rotation() {
        const degreeReadjustedValue =
            this.#pen.math.unadjustDegreesFromZero(this.#rotation);
        return degreeReadjustedValue;
    }
    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "The width for this animation needs to be a number!"
                )
            );
        }
        const degreeAdjustedValue =
            this.#pen.math.adjustDegressSoTopIsZero(value);
        this.#rotation = degreeAdjustedValue;
        return this.#rotation;
    }
    /**
     * @param {number} value
     */
    set strokeWidth(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "strokeWidth has to be a number!"
                )
            );
        }
        this.#pen.context.lineWidth = value;
        return this.#pen.context.lineWidth;
    }

    get strokeWidth() {
        return this.#pen.context.lineWidth;
    }

    /**
     * @param {number} value
     */
    set strokeDash(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "strokeDash has to be a number!"
                )
            );
        }
        if (value === 0) {
            this.#pen.context.setLineDash([]);
            this.#strokeDash = 0;
            return this.#strokeDash;
        }
        this.#strokeDash = value;
        this.#pen.context.setLineDash([value * 2, value]);
        return this.#strokeDash;
    }

    get strokeDash() {
        return this.#strokeDash;
    }

    #alignX(x, w) {
        if (this.alignment.x=== "center") {
            x = x - w / 2;
        }
        if (this.alignment.x === "right") {
            x = x - w;
        }
        return x;
    }

    #alignY(y, h) {
        if (this.alignment.y === "center") {
            y = y - h / 2;
        }
        if (this.alignment.y === "bottom") {
            y = y - h;
        }
        return y;
    }

    /**
     *
     * Draws a rectangle with rounded corners on the canvas.
     * @param {number} x - The x-coordinate of the rectangle's center.
     * @param {number} y - The y-coordinate of the rectangle's center.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle. Defaults to the width if not specified.
     * @param {number} rounding - The radius of the rounded corners.
     * @description draws a rectangle with rounded corners to the canvas at the given coords, default is x and y as the center of the rectange. H is an optional parameter.
     * @returns {boolean}
     */
    roundedRectangle(x, y, w, h, rounding) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (h === undefined) {
            //if nothing passed for h, use width
            h = w;
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }
        if (Number.isFinite(rounding) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    rounding,
                    "rounding has to be a number!"
                )
            );
        }
        // Ensure rounding is not larger than half the rectangle's width or height
        rounding = Math.min(rounding, w / 2, h / 2);

        let ctx = this.#pen.context;
        ctx.beginPath();

        // Start at the top left corner
        ctx.moveTo(x + rounding, y);

        // Top side
        ctx.lineTo(x + w - rounding, y);

        // Top right corner
        ctx.arcTo(x + w, y, x + w, y + rounding, rounding);

        // Right side
        ctx.lineTo(x + w, y + h - rounding);

        // Bottom right corner
        ctx.arcTo(x + w, y + h, x + w - rounding, y + h, rounding);

        // Bottom side
        ctx.lineTo(x + rounding, y + h);

        // Bottom left corner
        ctx.arcTo(x, y + h, x, y + h - rounding, rounding);

        // Left side
        ctx.lineTo(x, y + rounding);

        // Top left corner
        ctx.arcTo(x, y, x + rounding, y, rounding);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    #applyRotation(x,y){

        this.#pen.context.translate(x, y);

        if (this.#rotation !== 0) {
            this.#pen.context.rotate(this.#rotation * Math.PI / 180);
        }
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @description draws a rectangle to the canvas at the given coords, default is x and y as the center of the rectange. H is an optional parameter.
     * @returns {boolean}
     */
    rectangle(x, y, w, h) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (h === undefined) {
            //if nothing passed for h, use width
            h = w;
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }

        // offscreen prevent render checks
        if (x - w > this.#pen.width) {
            return;
        }
        if (x + w < 0) {
            return;
        }
        if (y - w > this.#pen.height) {
            return;
        }
        if (y + w < 0) {
            return;
        }
        const oldX = x;
        const oldY = y;
        // this.#pen.context.save();
        // this.#applyRotation(x,y);
        x = this.#alignX(x, w);
        y = this.#alignY(y, h);

        this.#pen.context.beginPath();
        this.#pen.context.rect(x, y, w, h);

        this.#pen.context.fill();
        this.#pen.context.stroke();
        if (this.#pen.debug) {
            Debug.drawRectangle(this.#pen, oldX, oldY, w, h);
        }
        // this.#pen.context.load();
        // this.#pen.context.restore();
    }
    /**
     * Draws an oval on the canvas.
     * @param {number} x - The x-coordinate of the oval's center.
     * @param {number} y - The y-coordinate of the oval's center.
     * @param {number} w - The width of the oval.
     * @param {number} h - The height of the oval. Defaults to the width if not specified.
     */
    oval(x, y, w, h=w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }

        // offscreen prevent render checks
        if (x - w > this.#pen.width) {
            return;
        }
        if (x + w < 0) {
            return;
        }
        if (y - w > this.#pen.height) {
            return;
        }
        if (y + w < 0) {
            return;
        }

        const oldX = x;
        const oldY = y;
        if (this.alignment.x === "left") {
            x = x + w;
        }
        
        if (this.alignment.x === "right") {
            x = x - w;
        }
        if (this.alignment.y === "top") {
            y = y + h;
        }
        if (this.alignment.y === "bottom") {
            y = y - h;
        }

        this.#pen.context.beginPath();
        this.#pen.context.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
        this.#pen.context.fill();
        this.#pen.context.stroke();
        this.#pen.context.closePath();

        if (this.#pen.debug) {
            Debug.drawOval(this.#pen, oldX, oldY, w, h);
        }
    }

    /**
     * Draws a line between two points on the canvas.
     * @param {number} xStart - The x-coordinate of the starting point.
     * @param {number} yStart - The y-coordinate of the starting point.
     * @param {number} xEnd - The x-coordinate of the ending point.
     * @param {number} yEnd - The y-coordinate of the ending point.
     */
    line(xStart, yStart, xEnd, yEnd) {
        if (Number.isFinite(xStart) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    xStart,
                    "xStart has to be a number!"
                )
            );
        }
        if (Number.isFinite(xEnd) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    xEnd,
                    "xEnd has to be a number!"
                )
            );
        }
        if (Number.isFinite(yStart) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    yStart,
                    "yStart has to be a number!"
                )
            );
        }
        if (Number.isFinite(yEnd) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    yEnd,
                    "yEnd has to be a number!"
                )
            );
        }
        this.#pen.context.beginPath();
        this.#pen.context.moveTo(xStart, yStart);
        this.#pen.context.lineTo(xEnd, yEnd);
        this.#pen.context.stroke();
    }

    /**
     * Draws a series of connected lines on the canvas.
     * @param {...number} coords - A sequence of x and y coordinates for each point in the line.
     */
    multiline(...coords) {
        for (let coord of coords) {
            if (Number.isFinite(coord) === false) {
                throw new Error(
                    ErrorMsgManager.numberCheckFailed(
                        coord,
                        "all coords have to be numbers!"
                    )
                );
            }
        }

        if (coords.length < 4 || coords.length % 2 !== 0) {
            throw Error(
                `Not enough coordinates provided, need at least 4 and it must be an equal number! You gave ${coords.length}`
            );
        }
        //check all coords are numbers
        this.#pen.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#pen.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#pen.context.lineTo(adjustedX, adjustedY);
        }
        this.#pen.context.stroke();
    }

    /**
     * Draws a closed shape by connecting a series of points on the canvas.
     * @param {...number} coords - A sequence of x and y coordinates for each point in the shape.
     */
    polygon(...coords) {
        for (let coord of coords) {
            if (Number.isFinite(coord) === false) {
                throw new Error(
                    ErrorMsgManager.numberCheckFailed(
                        coord,
                        "all coords have to be numbers!"
                    )
                );
            }
        }

        if (coords.length < 6 || coords.length % 2 !== 0) {
            throw new Error(
                `incorrect number of coords, need to be at least 6 coords and pairs you gave: ${coords.length} coords, ${coords}`
            );
        }
        //check if all coords are numbers
        this.#pen.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#pen.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#pen.context.lineTo(adjustedX, adjustedY);
        }
        this.#pen.context.closePath();
        this.#pen.context.fill();
        this.#pen.context.stroke();
    }

    /**
     * Draws an arc on the canvas.
     * @param {number} x - The x-coordinate of the arc's center.
     * @param {number} y - The y-coordinate of the arc's center.
     * @param {number} w - The width of the arc.
     * @param {number} h - The height of the arc.
     * @param {number} startAngle - The starting angle of the arc, in degrees.
     * @param {number} endAngle - The ending angle of the arc, in degrees.
     */
    arc(x, y, w, h, startAngle, endAngle) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }

        if (Number.isFinite(startAngle) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    startAngle,
                    "startAngle has to be a number!"
                )
            );
        }

        if (Number.isFinite(endAngle) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    endAngle,
                    "endAngle has to be a number!"
                )
            );
        }

        // offscreen prevent render checks
        if (x - w * 0.5 > this.#pen.width) {
            return;
        }
        if (x + w * 0.5 < 0) {
            return;
        }
        if (y - w * 0.5 > this.#pen.height) {
            return;
        }
        if (y + w * 0.5 < 0) {
            return;
        }

        // Calculate the radius as the average of width and height
        const radius = Math.sqrt(w * w + h * h) / 2;
        const angleOffset = 90;
        const startAngleRadians = (startAngle - angleOffset) * (Math.PI / 180);
        const endAngleRadians = (endAngle - angleOffset) * (Math.PI / 180);

        this.#pen.context.beginPath();

        // Move to the center of the arc
        const xAdjusted = x;
        const yAdjusted = y;
        this.#pen.context.moveTo(xAdjusted, yAdjusted);

        // Draw arc
        this.#pen.context.arc(
            xAdjusted,
            yAdjusted,
            radius,
            startAngleRadians,
            endAngleRadians
        );

        // Draw line back to the center
        this.#pen.context.lineTo(xAdjusted, yAdjusted);

        this.#pen.context.stroke();
        this.#pen.context.fill();
    }

    /**
     * Sets the config state of the shape library with the provided state object.
     * @param {Object} newState - The new config state for the shape.
     */
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        this.alignment.x=newState.shapeAlignmentX;
        this.alignment.y=newState.shapeAlignmentY;
        this.#pen.context.lineWidth = newState.shapeStrokeWidth;
        this.strokeDash=newState.shapeStrokeDash;
    }
}

//Locks
Object.defineProperty(Shape.prototype, 'arc', {
    value: Shape.prototype.arc,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'polygon', {
    value: Shape.prototype.polygon,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'multiline', {
    value: Shape.prototype.multiline,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'line', {
    value: Shape.prototype.line,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'oval', {
    value: Shape.prototype.oval,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'rectangle', {
    value: Shape.prototype.rectangle,
    writable: false,
    configurable: false
});

Object.defineProperty(Shape.prototype, 'roundedRectangle', {
    value: Shape.prototype.roundedRectangle,
    writable: false,
    configurable: false
});