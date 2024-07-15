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
            if (dist == 0) {
                return {x: 0, y: 0}
            } else {
                return {x: x / dist, y: y / dist};
            }
        }
    }

    static getNormal(x ,y) {
        const vector = CollisionUtilities.normalize(x, y);
        return {x: -vector.y, y: vector.x};
    }

    static dotProduct(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y);
    }

    static angleBetweenVectors(v1, v2) {
        const angle = Math.acos(CollisionUtilities.dotProduct(v1, v2) / (CollisionUtilities.distance(v1.x, v1.y) * CollisionUtilities.distance(v2.x, v2.y)));
        return CollisionUtilities.convertToDegrees(angle);
    }

    static convertToDegrees(value) {
        return (value / 3.1459) * 360
    }


    static sphereTest(x1, y1, r1, x2, y2, r2) {
        const dist = this.distance(this.difference(x1, x2), this.difference(y1, y2));
        if (dist < r1 + r2) {
            return true;
        } else {
            return false;
        }
    }
    
    /////////////////////////////////////
    // Tests if the point 'check' lies on the inside or outside of the line x1y1 to x2y2. x3y3 provides the point to check the results against. 
    // 1: On same side. -1: On different sides, 0: check falls on the line.
    static pointInsideTest(x, y, x1, y1, x2, y2, x3, y3)
    {
        const insideResult = ((y3 - y1)*(x2 - x1)) - ((x3 - x1)*(y2 - y1));
        const checkResult = ((y - y1)*(x2 - x1)) - ((x - x1)*(y2 - y1));
        if ((insideResult > 0 && checkResult > 0) || (insideResult < 0 && checkResult < 0)) {
            return 1;
        } else if (checkResult == 0) {
            return 0;
        } else {
            return -1;
        }
    }

    static triangleInsideTest(x, y, x1, y1, x2, y2, x3, y3)
    {
        if (CollisionUtilities.pointInsideTest(x, y, x1, y1, x2, y2, x3, y3) == 1 && CollisionUtilities.pointInsideTest(x, y, x2, y2, x3, y3, x1, y1) == 1 && CollisionUtilities.pointInsideTest(x, y, x3, y3, x1, y1, x2, y2) == 1) {
            return true;
        } else {
            return false;
        }
    }

    //returns null if it doesnt, returns a point if it does
    static lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) { 
        const m1 = (y2-y1) / (x2-x1);
        const c1 = y1 - (m1 * x1);

        const m2 = (y4-y3) / (x4-x3);
        const c2 = y3 - (m2 * x3);

        if (m1 == m2) { //return null if lines are parallel
            return null;
        }

        let xIntersection = 0;
        let yIntersection = 0;
        if (!Number.isFinite(m1)) {
            xIntersection = 0;
            yIntersection = y1;
        } else if (!Number.isFinite(m2)) {
            xIntersection = 0;
            yIntersection = y1;
        } else {
            xIntersection = (c2 - c1) / (m1 - m2);
            yIntersection = m1 * xIntersection + c1;
        }
        return {x: xIntersection, y: yIntersection};
    }

    static lineIntersectsLineLimited(x1, y1, x2, y2, x3, y3, x4, y4) { 
        let intersect = CollisionUtilities.lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4);

        if (intersect == null) {
            return null;
        }

        if (x1 <= intersect.x && intersect.x <= x2 && y1 <= intersect.y && intersect.y <= y2) {
            return intersect;
        } else {
            return null;
        }
    }

    //returns null if it doesnt, returns a point if it does
    static lineIntersectsCircle(x, y, radius, x1, y1, x2, y2)
    {        
        const vector1 = {x: x2-x1, y: y2-y1};
        const normal = CollisionUtilities.getNormal(vector1.x, vector1.y);
        const intersect = CollisionUtilities.lineIntersectsLine(x1, y1, x2, y2, x, y, x+normal.x, y+normal.y);
        
        let betweenX = false;
        if (x1 < x2) {
            if (intersect.x >= x1 && intersect.x <= x2) {
                betweenX = true;
            }
        } else if (x2 < x1) {
            if (intersect.x >= x2 && intersect.x <= x1) {
                betweenX = true;
            }
        }

        let betweenY = false;
        if (y1 < y2) {
            if (intersect.y >= y1 && intersect.y <= y2) {
                betweenY = true;
            }
        } else if (y2 < y1) {
            if (intersect.y >= y2 && intersect.y <= y1) {
                betweenY = true;
            }
        }

        if (intersect != null && betweenX && betweenY && CollisionUtilities.distance(intersect.x - x, intersect.y - y) <= radius) {
            return intersect;
        } else {
            return null;
        }
    }

    static rotatePointAroundPoint(px, py, ox, oy, rotation) {
        const x = px - ox;
        const y = py - oy;
        const rads = (rotation / 180) * Math.PI;
        const cos = Math.cos(rads)
        const sin = Math.sin(rads)
        
        const rx = (x * cos) - (y * sin)
        const ry = (y * cos) + (x * sin)

        return {x:rx + ox, y:ry + oy};
    }
    
    static rectangleIntersectsCircle(x, y, radius, x1, y1, x2, y2, x3, y3, x4, y4) {

        if (CollisionUtilities.distance(x1 - x, y1 - y) <= radius) {
            return true;
        }
        if (CollisionUtilities.distance(x2 - x, y2 - y) <= radius) {
            return true;
        }
        if (CollisionUtilities.distance(x3 - x, y3 - y) <= radius) {
            return true;
        }
        if (CollisionUtilities.distance(x4 - x, y4 - y) <= radius) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(x, y, x1, y1, x2, y2, x3, y3) || CollisionUtilities.triangleInsideTest(x, y, x2, y2, x4, y4, x3, y3) ) {
            return true;
        }

        let result = null;
        
        result = CollisionUtilities.lineIntersectsCircle(x, y, radius, x1, y1, x2, y2);
        if (result != null) {
            return true;
        }

        result = CollisionUtilities.lineIntersectsCircle(x, y, radius, x2, y2, x4, y4);
        if (result != null) {
            return true;
        }

        result = CollisionUtilities.lineIntersectsCircle(x, y, radius, x4, y4, x3, y3);
        if (result != null) {
            return true;
        }

        result = CollisionUtilities.lineIntersectsCircle(x, y, radius, x3, y3, x1, y1);
        if (result != null) {
            return true;
        }

        return false;
        
    }  

    static rectangleIntersectsRectangle(rx1, ry1, rx2, ry2, rx3, ry3, rx4, ry4,
                                        px1, py1, px2, py2, px3, py3, px4, py4) {
        
        //do point checks
        if (CollisionUtilities.triangleInsideTest(rx1, ry1, px1, py1, px2, py2, px3, py3) || CollisionUtilities.triangleInsideTest(rx1, ry1, px2, py2, px4, py4, px3, py3)) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(rx2, ry2, px1, py1, px2, py2, px3, py3) || CollisionUtilities.triangleInsideTest(rx2, ry2, px2, py2, px4, py4, px3, py3) ) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(rx3, ry3, px1, py1, px2, py2, px3, py3) || CollisionUtilities.triangleInsideTest(rx3, ry3, px2, py2, px4, py4, px3, py3) ) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(rx4, ry4, px1, py1, px2, py2, px3, py3) || CollisionUtilities.triangleInsideTest(rx4, ry4, px2, py2, px4, py4, px3, py3) ) {
            return true;
        }
        //reverse
        if (CollisionUtilities.triangleInsideTest(px1, py1, rx1, ry1, rx2, ry2, rx3, ry3) || CollisionUtilities.triangleInsideTest(px1, py1, rx2, ry2, rx4, ry4, rx3, ry3) ) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(px2, py2, rx1, ry1, rx2, ry2, rx3, ry3) || CollisionUtilities.triangleInsideTest(px2, py2, rx2, ry2, rx4, ry4, rx3, ry3) ) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(px3, py3, rx1, ry1, rx2, ry2, rx3, ry3) || CollisionUtilities.triangleInsideTest(px3, py3, rx2, ry2, rx4, ry4, rx3, ry3) ) {
            return true;
        }
        if (CollisionUtilities.triangleInsideTest(px4, py4, rx1, ry1, rx2, ry2, rx3, ry3) || CollisionUtilities.triangleInsideTest(px4, py4, rx2, ry2, rx4, ry4, rx3, ry3) ) {
            return true;
        }

        //now do line checks
        if (CollisionUtilities.lineIntersectsLineLimited(rx1, ry1, rx2, ry2, px1, py1, px2, py2) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx1, ry1, rx2, ry2, px2, py2, px4, py4) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx1, ry1, rx2, ry2, px4, py4, px3, py3) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx1, ry1, rx2, ry2, px3, py3, px1, py1) != null) {
            return true;
        }

        if (CollisionUtilities.lineIntersectsLineLimited(rx2, ry2, rx4, ry4, px1, py1, px2, py2) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx2, ry2, rx4, ry4, px2, py2, px4, py4) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx2, ry2, rx4, ry4, px4, py4, px3, py3) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx2, ry2, rx4, ry4, px3, py3, px1, py1) != null) {
            return true;
        }

        if (CollisionUtilities.lineIntersectsLineLimited(rx4, ry4, rx3, ry3, px1, py1, px2, py2) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx4, ry4, rx3, ry3, px2, py2, px4, py4) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx4, ry4, rx3, ry3, px4, py4, px3, py3) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx4, ry4, rx3, ry3, px3, py3, px1, py1) != null) {
            return true;
        }

        if (CollisionUtilities.lineIntersectsLineLimited(rx3, ry3, rx1, ry1, px1, py1, px2, py2) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx3, ry3, rx1, ry1, px2, py2, px4, py4) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx3, ry3, rx1, ry1, px4, py4, px3, py3) != null) {
            return true;
        }
        if (CollisionUtilities.lineIntersectsLineLimited(rx3, ry3, rx1, ry1, px3, py3, px1, py1) != null) {
            return true;
        }

        return false;
    }

    
}