import { CollisionLine } from "./CollisionLine.js";
import { CollisionShape } from "./CollisionShape.js";
import { CollisionTriangle } from "./CollisionTriangle.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { CollisionVector } from "./CollisionVector.js";
import { Vector } from "./Vector.js";
import { tad } from "./TeachAndDraw.js";

export class CollisionPolygon extends CollisionShape {

    #points;
    #edges;
    #triangles;
    #center;

    constructor(x, y, points) {
        if (points.length < 4) {
            throw new Error("Collision Polygons must have at least 4 points");
        }

        let cx = points[0].x;
        let cy = points[0].y;
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
        let radius = center.getDistanceBetweenPoints(points[0]);
        for (let i = 1; i < points.length; i++) {
            const r = center.getDistanceBetweenPoints(points[i]);
            
            if (r > radius) {
                radius = r;
            }
        }

        super(x, y, minX, maxX, minY, maxY, radius);

        this.#points = new Array();
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            this.#points.push(new CollisionVector(point.x, point.y));
        }

        this.#edges = new Array();
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            let p2 = points[0];
            if (i < points.length-1) {
                p2 = points[i+1];
            }
            this.#edges.push(new CollisionLine(p1.x, p1.y, p2.x, p2.y));
        }

        this.#triangles = new Array();
        for (let i = 0; i < points.length - 2; i++) {
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
            this.#triangles.push(new CollisionTriangle(x, y, this.#points[index1].x, this.#points[index1].y, this.#points[index2].x, this.#points[index2].y,this.#points[index3].x, this.#points[index3].y));
        }

        this.#center = center;
    }

    getPoint(index) {
        return this.#points[index];
    }

    getClosetPointIndex(x, y) {
        const point = new CollisionVector(x, y);
        let closet = 0;
        let length = CollisionUtilities.distanceBetweenpoints(point, this.#points[0]);
        for (let i = 1; i < this.#points.length; i++) {
            let l = CollisionUtilities.distanceBetweenpoints(point, this.#points[i]);
            if (l < length){
                length = l;
                closet = i;
            }
        }
        return closet;
    }

    getRotationDirection(flatLine, intersect) {
        let index = this.getClosetPointIndex(intersect.x, intersect.y);
        let p1 = null;
        let p2 = null;
        if (index == 0) {
            p1 = this.#points[this.#points.length-1];
            p2 = this.#points[1];
        } else if (index == this.#points.length-1) {
            p1 = this.#points[index-1];
            p2 = this.#points[0];
        } else {
            p1 = this.#points[index-1];
            p2 = this.#points[index+1];
        }

        const angle1_a = CollisionUtilities.angleBetweenVectors(flatLine, new Vector(p1.x - intersect.x, p1.y - intersect.y));
        const angle1_b = CollisionUtilities.angleBetweenVectors(flatLine.reversed(), new Vector(p1.x - intersect.x, p1.y - intersect.y));
        let angle1 = angle1_a;
        if (angle1_b < angle1_a) {
            angle1 = angle1_b;
        }

        const angle2_a = CollisionUtilities.angleBetweenVectors(flatLine, new Vector(p2.x - intersect.x, p2.y - intersect.y));
        const angle2_b = CollisionUtilities.angleBetweenVectors(flatLine.reversed(), new Vector(p2.x - intersect.x, p2.y - intersect.y));
        let angle2 = angle2_a;
        if (angle2_b < angle2_a) {
            angle1 = angle2_b;
        }

        const direction = CollisionTriangle.isPointBeforeOtherPointClockwise(intersect, p1, p2);

        if (angle1 < angle2) {
            if (direction) {
                return angle1;
            } else {
                return -angle1;
            }
        } else {
            if (direction) {
                return -angle2;
            } else {
                return angle2;
            }
        }
    }

    doesCircleIntersect(x, y, radius) {

        //check if the circle center is within the polygon
        const result = this.isPointWithin(x, y);
        if (result) {
            return true;
        }

        //check if it overlaps any of the edges
        for (let i = 0; i < this.#edges.length; i++) {
            const result = this.#edges[i].doesCircleIntersect(x, y, radius);
            if (result) {
                return true;
            }
        }

        
        return false;
    }

    doesPolygonIntersect(anotherPolygon, xOffset=0, yOffset=0) {
        
        //check if a point of the polygon is completely within the polygon
        for (let i = 0; i < anotherPolygon.#points.length; i++) {
            const point = anotherPolygon.#points[i];
            const result = this.isPointWithin(point.x + xOffset, point.y + yOffset);
            if (result) {
                return true;
            }
        }
        for (let i = 0; i < this.#points.length; i++) {
            const point = this.#points[i];
            const result = anotherPolygon.isPointWithin(point.x + xOffset, point.y + yOffset);
            if (result) {
                return true;
            }
        }

        let edges = anotherPolygon.#edges;
        if (xOffset != 0 && yOffset != 0)
        {
            edges = new Array();
            for (let j = 0; j < anotherPolygon.#edges.length; j++) {
                let edge = anotherPolygon.#edges[j];
                edges.push(edge.getCopy());
            }
        }

        //check if it overlaps any of the edges
        for (let i = 0; i < this.#edges.length; i++) {
            for (let j = 0; j < anotherPolygon.#edges.length; j++) {
                const result = this.#edges[i].doesLineIntersect(anotherPolygon.#edges[j]);
                if (result) {
                    return true;
                }
            }
        }

        return false;
    }

    getEdgeIntersectFromCircle(circle) {
        let intersects = new Array();
        for (let i = 0; i < this.#edges.length; i++) {
            const result = this.#edges[i].getCircleIntersect(circle);
            if (result != null) {
                intersects.push(result);
            }
        }

        //check if any points are inside the circle
        if (intersects.length == 0) {
            for (let i = 0; i < this.#points.length; i++) {
                const point = this.#points[i];
                const result = circle.pointWithinCircle(point);
                if (result != null) {
                    intersects.push(point);
                }
            }
        }

        if (intersects.length == 0) {
            return null;
        }

        const circlePoint = new CollisionVector(circle.x, circle.y);
        let closetDist = intersects[0].getDistanceBetweenPoints(circlePoint);
        let closestIndex = 0;
        for (let i = 1; i < intersects.length; i++) {
            const result = intersects[i].getDistanceBetweenPoints(circlePoint);
            if (result < closetDist) {
                closetDist = result;
                closestIndex = i;
            }
        }

        return intersects[closestIndex];
    }

    getVectorFromPolygonIntersect(otherPolygon) {
        let intersects = new Array();
        for (let i = 0; i < this.#edges.length; i++) {
            const edge1 = this.#edges[i];
            for (let j = 0; j < otherPolygon.#edges.length; j++) {
                const result = edge1.getIntersectWithLine(otherPolygon.#edges[j]);
                if (result != null) {
                    intersects.push(result);
                }
            }
        }

        if (intersects.length < 2) {
            return null;
        }

        //get the two closest points
        let closestIndex1 = 0;
        let closetDist1 = intersects[closestIndex1].getDistanceBetweenPoints(this.#center);
        let closestIndex2 = 1;
        let closetDist2 = intersects[closestIndex2].getDistanceBetweenPoints(this.#center);
        for (let i = 2; i < intersects.length; i++) {
            const result = intersects[i].getDistanceBetweenPoints(this.#center);
            if (result < closetDist1) {
                closestIndex2 = closestIndex1;
                closetDist2 = closetDist1;
                closestIndex1 = i;
                closetDist1 = result;
            } else if (result < closetDist2) {
                closestIndex2 = i;
                closetDist2 = result;
            }
        }

        //calculate the vector between the two points
        const p1 = intersects[closestIndex1];
        const p2 = intersects[closestIndex2];
        const mid = new CollisionVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        const vector = new CollisionVector(p2.x - p1.x, p2.y - p1.y);

        const length1 = this.#center.getDistanceBetweenPoints(mid);
        const length2 = otherPolygon.#center.getDistanceBetweenPoints(mid);
        let length = 0;
        if (length1 < length2) {
            length = length1;
        } else {
            length = length2;
        }

        const normal = vector.getNormal().multiply(length);
        const normalInverted = new CollisionVector(-normal.x, -normal.y);

        const n1 = new CollisionVector(mid.x + normal.x, mid.y + normal.y);
        const n2 = new CollisionVector(mid.x + normalInverted.x, mid.y + normalInverted.y);

        if (n1.getDistanceBetweenPoints(this.#center) < n2.getDistanceBetweenPoints(this.#center)) {
            return [mid, normal];
        } else {
            return [mid, normalInverted];
        }
    }

    isPointWithin(x, y) {
        //do triangle inside tests until we run out of triangles
        for (let i = 0; i < this.#triangles.length; i++) {
            const result = this.#triangles[i].pointWithinTriangle(x, y);
            if (result) {
                return true;
            }
        }
        return false;
    }

    copyPoints(x, y) {
        let newArray = new Array();
        for (let i = 0; i < this.#points.length; i++) {
            const point = this.#points[i];
            newArray.push(new CollisionVector(point.x + x, point.y + y));
        }
        return newArray;
    }
}
