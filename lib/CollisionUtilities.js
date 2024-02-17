export class CollisionUtilities {

    constructor(){
    }

    static difference(v1, v2) {
        if (v1 > v2) {
            return v1-v2;
        } else {
            return v2-v1;
        }
    }

    static distance(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }

    static normalize(x, y) {
        let dist = this.distance(x, y);
        return {x: x / dist, y: y / dist};
    }

    //returns true if spheres overlap
    static sphereTest(x1, y1, r1, x2, y2, r2) {
        let dist = this.distance(this.difference(x1, x2), this.difference(y1, y2));
        if (dist < r1 + r2) {
            return true;
        } else {
            return false;
        }
    }
   
}