export class CollisionUtilities {

    constructor(){}

    static difference(v1, v2) {
        if (v1 > v2) {
            return v1-v2;
        } else {
            return v2-v1;
        }
    }

    static distance(x, y) {
        return Math.sqrt(x**2 + y**2);
    }

    static distanceBetweenpoints(v1, v2) {
        return this.distance(this.difference(v1.x, v2.x), this.difference(v1.y, v2.y));
    }

    static normalize(x, y) {
        if (x == 0 && y == 0) {
            return {x: 0, y: 0}
        } else {
            let dist = this.distance(x, y);
            return {x: x / dist, y: y / dist};
        }
    }

    static dotProduct(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y);
    }

    static sphereTest(x1, y1, r1, x2, y2, r2) {
        const dist = this.distance(this.difference(x1, x2), this.difference(y1, y2));
        if (dist < r1 + r2) {
            return true;
        } else {
            return false;
        }
    }
}