import { CollisionCircle } from "./CollisionCircle.js";
import { CollisionShape } from "./CollisionShape.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { CollisionVector } from "./CollisionVector.js";

export class CollisionLine extends CollisionShape {

    #point1;
    #point2;

    #eqM;
    #eqC;

    #vector;

    constructor(x1, y1, x2, y2) {
        let minX = x1;
        let maxX = x2;
        if (x2 < x1) {
            minX = x2;
            maxX = x1;
        }

        let minY = y1;
        let maxY = y2;
        if (y2 < y1) {
            minY = y2;
            maxY = y1;
        }
        let p1 = new CollisionVector(x1, y1);
        let p2 = new CollisionVector(x2, y2);
        let radius = p1.getDistanceBetweenPoints(p2);

        super(0, 0, minX, maxX, minY, maxY, radius);

        if (x1 == x2) {
            this.#eqM = Number.POSITIVE_INFINITY;
            this.#eqC = Number.POSITIVE_INFINITY;
        } else if (y1 == y2) {
            this.#eqM = 0;
            this.#eqC = y1;
        } else {
            this.#eqM = (y2-y1) / (x2-x1);
            this.#eqC = y1 - (this.#eqM * x1);
        }

        this.#point1 = p1;
        this.#point2 = p2;

        this.#vector = new CollisionVector(x2-x1, y2-y1);
    }

    getXFromY(y) {
        if (this.isVertical()) {
            return this.minX;
        } else {
            return (y - this.#eqC) / this.#eqM;
        }
    }

    getYFromX(x) {
        if (this.isVertical()) {
            return Number.POSITIVE_INFINITY;
        } else {
            return (this.#eqM * x) + this.#eqC;
        }
    }

    isVertical() {
        if (Number.isFinite(this.#eqM)) {
            return false;
        } else {
            return true;
        }
    }

    pointWithinBounds(x, y) {
        if (x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY) {
            return true;
        } else {
            return false;
        }
    }

    length() {
        return CollisionUtilities.distanceBetweenpoints(this.#point1, this.#point2);
    }

    getNormalVector() {
        return this.#vector.getNormal();
    }

    /**
     * Returns if a circle defined by (x, y, radius) intersects the line
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @returns {boolean}
     */
    doesCircleIntersect(x, y, radius)
    {
        //check if either point is within the circle
        const circlePoint = new CollisionVector(x, y);
        if (circlePoint.getDistanceBetweenPoints(this.#point1) < radius) {
            return true;
        }
        if (circlePoint.getDistanceBetweenPoints(this.#point2) < radius) {
            return true;
        }
        
        //check if the line and a normal from the circle to it's edge intersect
        let normal = this.#vector.getNormal();
        normal = normal.multiply(radius);
        const circleLine = new CollisionLine(x-normal.x, y-normal.y, x+normal.x, y+normal.y)

        return this.doesLineIntersect(circleLine);
    }

    doesLineIntersect(anotherLine) {
        const intersect = this.getIntersectWithLine(anotherLine);
        if (intersect == null) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Returns if a circle intersects the line
     * @param {CollisionCircle} circle 
     * @returns {null | CollisionVector}
     */
    getCircleIntersect(circle)
    {        
        //check if the line and a normal from the circle to it's edge intersect
        let normal = this.#vector.getNormal();
        normal = normal.multiply(circle.radius);
        const circleLine = new CollisionLine(circle.x-normal.x, circle.y-normal.y, circle.x+normal.x, circle.y+normal.y);
        const result = this.getIntersectWithLine(circleLine);
        return result;
    }

    pointsOnSameSideOfLine(point, center) {
        var sign1 = (point.y - this.#point1.y)*(this.#point2.x - this.#point1.x) - (point.x - this.#point1.x)*(this.#point2.y - this.#point1.y);
        var sign2 = (center.y - this.#point1.y)*(this.#point2.x - this.#point1.x) - (center.x - this.#point1.x)*(this.#point2.y - this.#point1.y);

        if ((sign1 < 0 && sign2 < 0) || (sign1 > 0 && sign2 > 0)) {
            return true;
        } else {
            return false;
        }
    }

    getIntersectWithLine(anotherLine) { 

        //Lines have same slope, are parallel
        if (this.#eqM == anotherLine.#eqM) {
            return null;
        }

        let xIntersection;
        let yIntersection;

        if (this.isVertical()) {
            xIntersection = this.getXFromY(0);
            yIntersection = anotherLine.getYFromX(xIntersection);

        } else if (anotherLine.isVertical()) {
            xIntersection = anotherLine.getXFromY(0);
            yIntersection = this.getYFromX(xIntersection);

        } else {
            xIntersection = (anotherLine.#eqC - this.#eqC) / (this.#eqM - anotherLine.#eqM);
            yIntersection = this.getYFromX(xIntersection);
        }

        //check if intersection is between the bounds of both lines
        if (this.pointWithinBounds(xIntersection, yIntersection) && anotherLine.pointWithinBounds(xIntersection, yIntersection)) {
            return new CollisionVector(xIntersection, yIntersection);
        } else {
            return null;
        }
    }
    
    getCopy() {
        return new CollisionLine(this.#point1.x, this.#point1.y, this.#point2.x, this.#point2.y);
    }
}
