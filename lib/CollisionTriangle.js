import { CollisionLine } from "./CollisionLine.js";
import { CollisionShape } from "./CollisionShape.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { CollisionVector } from "./CollisionVector.js";

export class CollisionTriangle extends CollisionShape {

    #pointA;
    #pointB;
    #pointC;
    
    #lineAB;
    #lineBC;
    #lineCA;

    #center;

    constructor(x, y, x1, y1, x2, y2, x3, y3) {

        let a = new CollisionVector(x1, y1);
        let b = new CollisionVector(x2, y2);
        let c = new CollisionVector(x3, y3);

        let minX = a.x;
        if (b.x < minX) {
            minX = b.x;
        }
        if (c.x < minX) {
            minX = c.x;
        }

        let maxX = a.x;
        if (b.x > maxX) {
            maxX = b.x;
        }
        if (c.x > maxX) {
            maxX = c.x;
        }

        let minY = a.y;
        if (b.y < minY) {
            minY = b.y;
        }
        if (c.y < minY) {
            minY = c.y;
        }

        let maxY = a.y;
        if (b.y > maxY) {
            maxY = b.y;
        }
        if (c.y > maxY) {
            maxY = c.y;
        }

        let pA = new CollisionVector(x1, y1);
        let pB = new CollisionVector(x2, y2);
        let pC = new CollisionVector(x3, y3);
        let center = new CollisionVector((x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3);

        let radius = CollisionUtilities.distanceBetweenpoints(center, pA);
        let distB = CollisionUtilities.distanceBetweenpoints(center, pB);
        let distC = CollisionUtilities.distanceBetweenpoints(center, pC);
        if (distB > radius) {
            radius = distB;
        }
        if (distC > radius) {
            radius = distC;
        }
        
        super(x, y, minX, maxX, minY, maxY, radius);

        this.#center = center;

        this.#pointA = pA;
        this.#pointB = pB;
        this.#pointC = pC;
        if (CollisionTriangle.isPointBeforeOtherPointClockwise(this.#center, this.#pointC, this.#pointB)) {
            let temp = this.#pointC;
            this.#pointC = this.#pointB;
            this.#pointB = temp;
        }        

        this.#lineAB = new CollisionLine(this.#pointA.x, this.#pointA.y, this.#pointB.x, this.#pointB.y);
        this.#lineBC = new CollisionLine(this.#pointB.x, this.#pointB.y, this.#pointC.x, this.#pointC.y);
        this.#lineCA = new CollisionLine(this.#pointC.x, this.#pointC.y, this.#pointA.x, this.#pointA.y);
    }

    static isPointBeforeOtherPointClockwise(center, a, b) {

        //if b.x is to the right of the center and a.x is to the left
        if (b.x - center.x >= 0 && a.x - center.x < 0) {
            return true;
        }

        //if a.x is to the right of the center and b.x is to the left
        if (b.x - center.x < 0 && a.x - center.x >= 0) {
            return false;
        }

        //if both are in line with the center on the axis
        if (b.x == center.x && a.x == center.x) {
            //look at y axis instead
            //if both are below center, invert check
            if ((b.y - center.y) <= 0 && (a.y - center.y) <= 0) {
                return a.y > b.y;
            } else {
                return a.y < b.y;
            }
        }

        // compute the cross product of vectors (center -> a) x (center -> b)
        const cross = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
        if (cross < 0) {
            return true;
        }
            
        if (cross > 0) {
            return false;
        }
        
        // points a and b are on the same line from the center
        // check which point is closer to the center
        const d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
        const d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
        return (d1 < d2);
    }

    pointWithinTriangle(x, y) {
        return CollisionTriangle.pointInsideTriangle(new CollisionVector(x, y), this.#center, this.#lineAB, this.#lineBC, this.#lineCA);
    }

    static pointInsideTriangle(point, center, line1, line2, line3) {
        if (line1.pointsOnSameSideOfLine(point, center, line1)) {
            if (line2.pointsOnSameSideOfLine(point, center, line2)) {
                if (line3.pointsOnSameSideOfLine(point, center, line3)) {
                    return true;
                }
            }
        }
        return false;
    }
}
