import { CollisionShape } from "./CollisionShape.js";
import { CollisionVector } from "./CollisionVector.js";

export class CollisionCircle extends CollisionShape {

    constructor(x, y, radius) {
        super(x, y, x - radius, x + radius, y - radius, y + radius, radius);
    }

    pointWithinCircle(x, y) {
        if (CollisionCircle.getDistance(this.x - x, this.y - y) < this.radius) {
            return true;
        } else {
            return false;
        }
    }

    static doCirclesOverlap(circle1, circle2) {
        if (CollisionCircle.getDistance(circle2.x - circle1.x, circle2.y - circle2.y) > (circle1.radius + circle2.radius)) {
            return false;
        } else {
            return true;
        }
    }

    static getIntersectBetweenCircles(circle1, circle2) {
        if (!CollisionCircle.doBoundsOverlap(circle1, circle2)) {
            return null;
        }
        if (!CollisionCircle.doCirclesOverlap(circle1, circle2)) {
            return null;
        }

        const c2Inc1 = circle1.pointWithinCircle(circle2.x, circle2.y);
        const c1Inc2 = circle2.pointWithinCircle(circle1.x, circle1.y);

        //if each are inside the other
        if (c1Inc2 && c2Inc1) {
            //get the midpoint between circles
            const distance = CollisionCircle.getDistance(circle2.x - circle1.x, circle2.y - circle2.y);
            const vector = new CollisionVector(circle2.x - circle1.x, circle2.y - circle1.y).normalize().multiply(distance / 2);
            return new CollisionVector(circle1.x + vector.x, circle1.y + vector.y);
        } else if (c1Inc2 && !c2Inc1) {
            //get the radius of c1 along the between vector
            const vector = new CollisionVector(circle2.x - circle1.x, circle2.y - circle1.y).normalize().multiply(circle1.radius);
            return new CollisionVector(circle1.x + vector.x, circle1.y + vector.y);
        } else if (!c1Inc2 && c2Inc1) {
            //get the radius of c2 along the between vector from c2
            const vector = new CollisionVector(circle1.x - circle2.x, circle1.y - circle2.y).normalize().multiply(circle2.radius);
            return new CollisionVector(circle2.x + vector.x, circle2.y + vector.y);
        } else {
            //get the mid point between the overlap
            const distance = CollisionCircle.getDistance(circle2.x - circle1.x, circle2.y - circle2.y);
            const overlap = (circle1.radius + circle2.radius) - distance;
            const midDist = circle1.radius - (overlap / 2);
            const vector = new CollisionVector(circle2.x - circle1.x, circle2.y - circle1.y).normalize().multiply(midDist);
            return new CollisionVector(circle1.x + vector.x, circle1.y + vector.y);
        }
    }
}
