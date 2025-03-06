import { CollisionLine } from "./CollisionLine.js";
import { CollisionShape } from "./CollisionShape.js";
import { CollisionTriangle } from "./CollisionTriangle.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { CollisionVector } from "./CollisionVector.js";

export class CollisionPolygon extends CollisionShape {

    #points;
    #triangles;
    #center;

    constructor(x, y, points) {
        if (points.length < 4) {
            throw new Error("Collision Polygons must have at least 4 points");
        }

        let cx = 0;
        let cy = 0;
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y; 
        for (let i = 1; i < points.length; i++) {
            const p = points[i];
            cx += p.x;
            cy += p.y;
            if (p.x < minX) {
                minX = p.x;
            }
            if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            }
            if (p.y > maxY) {
                maxY = p.y;
            }
        }
        let center = new CollisionVector(cx / points.length, cy / points.length);
        let radius = CollisionUtilities.distanceBetweenpoints(center, points[0]);
        for (let i = 1; i < points.length; i++) {
            const r = CollisionUtilities.distanceBetweenpoints(center, points[i]);
            if (r > radius) {
                radius = r;
            }
        }

        super(x, y, minX, maxX, minY, maxY, radius);

        this.#points = points;
        this.#triangles = new Array();
        
        for (let i = 0; i < points.length + 2; i++) {
            let index1 = i;
            if (index1 >= points.length) {
                index1 = index1 - points.length
            }
            let index2 = i+1;
            if (index2 >= points.length) {
                index2 = index2 - points.length
            }
            let index3 = i+2;
            if (index3 >= points.length) {
                index3 = index3 - points.length
            }
            this.#triangles.push(new CollisionTriangle(this.#points[index1].x, this.#points[index1].y, this.#points[index2].x, this.#points[index2].y,this.#points[index3].x, this.#points[index3].y));
        }

        this.#center = center;
    }

    getPoint(index) {
        return this.#points[index];
    }

    pointWithinPolygon(x, y) {
        return false;
    }
}
