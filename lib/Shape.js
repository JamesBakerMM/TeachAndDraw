import { Debug } from "./Debug.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Tad } from "./TeachAndDraw.js";


/**
 * @typedef {import("./DrawStateManager.js").DrawState} DrawState
 */
import { Alignment } from "./Alignment.js";
import { Vector } from "./Vector.js";

const DEFAULT_STROKE_DASH = 0;

export class Shape {
    #tad;
    #rotation;
    #position;
    #movedByCamera;
    #rounding;

    /**
     *
     * @param {Tad} tad
     */

    #strokeDash;
    /**
     *
     * @param {Tad} tad
     */
    constructor(tad) {
        this.alignment = new Alignment();
        Object.defineProperty(this, "alignment", {
            value: new Alignment(),
            writable: false,
            configurable: false,
        });
        this.#tad = tad;
        this.#strokeDash = DEFAULT_STROKE_DASH;
        console.log(tad);
        this.#rotation = tad.math.adjustDegressSoTopIsZero(0);
        this.#position = {x: 0, y: 0};
        this.#movedByCamera = true;
        this.#rounding = 0;

        Object.seal(this);
    }
    get rotation() {
        const degreeReadjustedValue = this.#tad.math.unadjustDegreesFromZero(
            this.#rotation
        );
        return degreeReadjustedValue;
    }
    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Rotation must be a number!"
                )
            );
        }
        const degreeAdjustedValue =
            this.#tad.math.adjustDegressSoTopIsZero(value);
        this.#rotation = degreeAdjustedValue;
        return;
    }
    set movedByCamera(flag) {
        if (typeof flag !== "boolean") {
            throw Error("movedByCamera must be a boolean value!");
        }
        this.#movedByCamera = flag;
    }
    get movedByCamera() {
        return this.#movedByCamera;
    }
    set rounding(value) {
        if (typeof value !== "number") {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "rounding must be a number!"
                )
            );
        }
        this.#rounding = value;
    }
    get rounding() {
        return this.#rounding;
    }
    set x(x) {
        if (Number.isFinite(x) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(x, "x must be a finite number!")
            );
        }
        this.#position.x = x;
    }
    get x() {
        return this.#position.x;
    }
    set y(y) {
        if (Number.isFinite(y) === false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(y, "y must be a finite number!")
            );
        }
        this.#position.y = y;
    }
    get y() {
        return this.#position.y;
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
        this.#tad.context.lineWidth = value;
        return;
    }

    get strokeWidth() {
        return this.#tad.context.lineWidth;
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
            this.#tad.context.setLineDash([]);
            this.#strokeDash = 0;
            return;
        }
        this.#strokeDash = value;
        this.#tad.context.setLineDash([value * 2, value]);
        return;
    }

    get strokeDash() {
        return this.#strokeDash;
    }

    /**
     *
     * @param {number} x
     * @param {number} w
     * @returns {number}
     */
    #alignX(x, w) {
        if (this.alignment.x === "center") {
            x = x - w / 2;
        }
        if (this.alignment.x === "right") {
            x = x - w;
        }
        return x;
    }

    /**
     *
     * @param {number} y
     * @param {number} h
     * @returns {number}
     */
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
     */
    #roundedRectangle(x, y, w, h, rounding) {
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
        if (this.#movedByCamera) {
            x += this.#tad.camera.xOffset;
            y += this.#tad.camera.yOffset;
        }

        // Ensure rounding is not larger than half the rectangle's width or height
        rounding = Math.min(rounding, w / 2, h / 2);

        const oldX = x;
        const oldY = y;
        x = this.#alignX(x, w);
        y = this.#alignY(y, h);
        let ctx = this.#tad.context;
        ctx.save();
        this.#applyRotation(x+w/2, y+h/2);
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
        if (this.#tad.debug) {
            Debug.drawRectangle(this.#tad, oldX, oldY, w, h);
        }

        ctx.restore();

    }

    /**
     * @param {number} x
     * @param {number} y
     */
    #applyRotation(x, y) {
        this.#tad.context.translate(x, y);

        if (this.rotation !== 0) {
            this.#tad.context.rotate((this.rotation * Math.PI) / 180);
        }

        this.#tad.context.translate(-x, -y);
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @description draws a rectangle to the canvas at the given coords, default is x and y as the center of the rectange. H is an optional parameter.
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

        if (this.#rounding >= 1) {
            this.#roundedRectangle(x, y, w, h, this.#rounding);
            return;
        }

        if (this.#movedByCamera) {
            x += this.#tad.camera.xOffset;
            y += this.#tad.camera.yOffset;
        }

        // offscreen prevent render checks
        if (x - w > this.#tad.width) {
            return;
        }
        if (x + w < 0) {
            return;
        }
        if (y - w > this.#tad.height) {
            return;
        }
        if (y + w < 0) {
            return;
        }
        const oldX = x;
        const oldY = y;

        x = this.#alignX(x, w);
        y = this.#alignY(y, h);

        let ctx = this.#tad.context;
        ctx.save();
        this.#applyRotation(x+w/2, y+h/2);

        ctx.beginPath();
        ctx.rect(x, y, w, h);

        ctx.fill();
        ctx.stroke();
        if (this.#tad.debug) {
            Debug.drawRectangle(this.#tad, oldX, oldY, w, h);
        }

        ctx.restore();
    }
    /**
     * Draws an oval on the canvas.
     * @param {number} x - The x-coordinate of the oval's center.
     * @param {number} y - The y-coordinate of the oval's center.
     * @param {number} w - The width of the oval.
     * @param {number} h - The height of the oval. Defaults to the width if not specified.
     */
    oval(x, y, w, h = w) {
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
        if (this.#movedByCamera) {
            x += this.#tad.camera.xOffset;
            y += this.#tad.camera.yOffset;
        }
        // offscreen prevent render checks
        if (x - w > this.#tad.width) {
            return;
        }
        if (x + w < 0) {
            return;
        }
        if (y - w > this.#tad.height) {
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

        this.#tad.context.save();
        this.#applyRotation(x, y);

        this.#tad.context.beginPath();
        this.#tad.context.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
        this.#tad.context.fill();
        this.#tad.context.stroke();
        this.#tad.context.closePath();

        if (this.#tad.debug) {
            Debug.drawOval(this.#tad, oldX, oldY, w, h);
        }

        this.#tad.context.restore();
    }

    /**
     * Compute coordinates needed for drawing rounded lines/polygons.
     * @param {Vector} A 
     * @param {Vector} B 
     * @param {Vector} C
     * @returns {Array} D, E, F points of triangle.
     */
    #computeRoundingDEF(A, B, C) {
        // Reference image: https://stackoverflow.com/questions/44855794/html5-canvas-triangle-with-rounded-corners
        const BA    = Vector.temp(A.x-B.x, A.y-B.y);
        const BAhat = Vector.temp(BA.x, BA.y);
              BAhat.normalize();

        const BC    = Vector.temp(C.x-B.x, C.y-B.y);
        const BChat = Vector.temp(BC.x, BC.y);
              BChat.normalize();

        // Angle between BA and BC
        let theta = Math.acos(BChat.dot(BAhat));
        const sinTheta = Math.sin(theta/2);
        const cosTheta = Math.cos(theta/2);

        let Opposite = this.rounding;
        let Hypotenuse = Opposite / sinTheta;
        let Adjacent = Hypotenuse * cosTheta;
    
        // Constrain radius
        let minLength = Math.min(BA.distance(), BC.distance());
        if (Adjacent > 0.5*minLength) {
            Adjacent = 0.5*minLength;
            Hypotenuse = Adjacent/cosTheta;
            Opposite = sinTheta * Hypotenuse;
        }

        // Vector from B to D
        const BD = Vector.temp(BAhat.x, BAhat.y);
              BD.multiply(Adjacent);

        // Vector from B to E
        const BE = Vector.temp(BChat.x, BChat.y);
              BE.multiply(Adjacent);

        // Vector pointing from B to F
        const BFhat = Vector.temp(BAhat.x+BChat.x, BAhat.y+BChat.y);
              BFhat.normalize();

        // Vector from B to F
        const BF = Vector.temp(BFhat.x, BFhat.y);
              BF.multiply(Hypotenuse);

        // Location of D, E and F
        const D = Vector.temp(B.x+BD.x, B.y+BD.y);
        const E = Vector.temp(B.x+BE.x, B.y+BE.y);
        const F = Vector.temp(B.x+BF.x, B.y+BF.y);

        return [D, E, F, Opposite];
    }

    /**
     * @param {Array<number>} coords
     */
    #roundedMultiLine(coords) {
        const first = new Vector(coords[0], coords[1]);
        const last = new Vector(coords[coords.length-2], coords[coords.length-1]);

        const ctx = this.#tad.context;
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);

        for (let i=2; i<coords.length-2; i+=2) {
            let A = Vector.temp(coords[i-2], coords[i-1]);
            let B = Vector.temp(coords[i+0], coords[i+1]);
            let C = Vector.temp(coords[i+2], coords[i+3]);
            let [D, E, F, radius] = this.#computeRoundingDEF(A, B, C);

            ctx.lineTo(D.x, D.y);
            ctx.arcTo(B.x, B.y, E.x, E.y, radius);
        }

        ctx.lineTo(last.x, last.y);
        ctx.stroke();
    }

    /**
     * 
     * @param {Array<number>} coords 
     */
    #roundedPolygon(coords) {
        const secondLast = new Vector(coords[coords.length-4], coords[coords.length-3]);
        const last = new Vector(coords[coords.length-2], coords[coords.length-1]);
        const first = new Vector(coords[0], coords[1]);
        const second = new Vector(coords[2], coords[3]);

        let radius = this.rounding;
        let D, E, F;
        let [firstD, firstE, firstF] = this.#computeRoundingDEF(last, first, second);

        const ctx = this.#tad.context;
        ctx.beginPath();
        ctx.moveTo(firstE.x, firstE.y);

        for (let i=2; i<coords.length-2; i+=2)
        {
            let A = Vector.temp(coords[i-2], coords[i-1]);
            let B = Vector.temp(coords[i+0], coords[i+1]);
            let C = Vector.temp(coords[i+2], coords[i+3]);
            [D, E, F, radius] = this.#computeRoundingDEF(A, B, C);

            ctx.lineTo(D.x, D.y);
            ctx.arcTo(B.x, B.y, E.x, E.y, radius);
        }

        [D, E, F, radius] = this.#computeRoundingDEF(secondLast, last, first);
        ctx.lineTo(D.x, D.y);
        ctx.arcTo(last.x, last.y, E.x, E.y, radius);
    
        [D, E, F, radius] = this.#computeRoundingDEF(last, first, second);
        ctx.lineTo(D.x, D.y);
        ctx.arcTo(first.x, first.y, E.x, E.y, radius);

        ctx.stroke();
        ctx.closePath();
        ctx.fill();
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
        if (this.#movedByCamera) {
            xStart += this.#tad.camera.xOffset;
            xEnd += this.#tad.camera.xOffset;
            yStart += this.#tad.camera.yOffset;
            yEnd += this.#tad.camera.yOffset;
        }
        this.#tad.context.save();
        this.#applyRotation(xStart, yStart);

        this.#tad.context.beginPath();
        this.#tad.context.moveTo(xStart, yStart);
        this.#tad.context.lineTo(xEnd, yEnd);
        this.#tad.context.stroke();

        this.#tad.context.restore();
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
        this.#tad.context.save();

        if (this.#movedByCamera) {
            this.#tad.context.translate(
                this.#tad.camera.xOffset,
                this.#tad.camera.yOffset
            );
        }

        this.#applyRotation(coords[0], coords[1]);

        if (this.#rounding >= 1) {
            this.#roundedMultiLine(coords);
            this.#tad.context.restore();
            return;
        }

        this.#tad.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#tad.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#tad.context.lineTo(adjustedX, adjustedY);
        }
        this.#tad.context.stroke();
        this.#tad.context.restore();
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

        if (this.#rounding >= 1) {
            this.#roundedPolygon(coords);
            this.#tad.context.restore();
            return;
        }

        // Compute the center of geometry
        let avgX = 0;
        let avgY = 0;
        for (let i=0; i<coords.length; i+=2) {
            avgX += coords[i];
            avgY += coords[i+1];
        }
        avgX /= coords.length/2;
        avgY /= coords.length/2;

        // Rotate about the center of geometry
        this.#tad.context.save();

        if (this.#movedByCamera) {
            this.#tad.context.translate(
                this.#tad.camera.xOffset,
                this.#tad.camera.yOffset
            );
        }

        this.#applyRotation(avgX, avgY);

        //check if all coords are numbers
        this.#tad.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#tad.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#tad.context.lineTo(adjustedX, adjustedY);
        }
        this.#tad.context.closePath();
        this.#tad.context.fill();
        this.#tad.context.stroke();
        this.#tad.context.restore();
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
        if (this.#movedByCamera) {
            x += this.#tad.camera.xOffset;
            y += this.#tad.camera.yOffset;
        }

        // offscreen prevent render checks
        if (x - w * 0.5 > this.#tad.width) {
            return;
        }
        if (x + w * 0.5 < 0) {
            return;
        }
        if (y - w * 0.5 > this.#tad.height) {
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

        this.#tad.context.save();
        this.#applyRotation(x, y);

        this.#tad.context.beginPath();

        // Move to the center of the arc
        const xAdjusted = x;
        const yAdjusted = y;
        this.#tad.context.moveTo(xAdjusted, yAdjusted);

        // Draw arc
        this.#tad.context.arc(
            xAdjusted,
            yAdjusted,
            radius,
            startAngleRadians,
            endAngleRadians
        );

        // Draw line back to the center
        this.#tad.context.lineTo(xAdjusted, yAdjusted);

        this.#tad.context.stroke();
        this.#tad.context.fill();
        this.#tad.context.restore();
    }

    /**
     * Sets the config state of the shape library with the provided state object.
     * @param {DrawState} newState - The new state to set.
     */
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        this.alignment.x = newState.shapeAlignmentX;
        this.alignment.y = newState.shapeAlignmentY;
        this.#tad.context.lineWidth = newState.shapeStrokeWidth;
        this.rounding = newState.shapeRounding;
        this.strokeDash = newState.shapeStrokeDash;
        this.movedByCamera = newState.shapeMovedByCamera;
    }
}

//Locks
Object.defineProperty(Shape.prototype, "arc", {
    value: Shape.prototype.arc,
    writable: false,
    configurable: false,
});

Object.defineProperty(Shape.prototype, "polygon", {
    value: Shape.prototype.polygon,
    writable: false,
    configurable: false,
});

Object.defineProperty(Shape.prototype, "multiline", {
    value: Shape.prototype.multiline,
    writable: false,
    configurable: false,
});

Object.defineProperty(Shape.prototype, "line", {
    value: Shape.prototype.line,
    writable: false,
    configurable: false,
});

Object.defineProperty(Shape.prototype, "oval", {
    value: Shape.prototype.oval,
    writable: false,
    configurable: false,
});

Object.defineProperty(Shape.prototype, "rectangle", {
    value: Shape.prototype.rectangle,
    writable: false,
    configurable: false,
});
