export class Quad {

    #depth;
    #depthInverse;
    #size;

    #left;
    #right;
    #top;
    #bottom;
    
    #quad1;
    #quad2;
    #quad3;
    #quad4;
    
    constructor(depth, depthMax, size, x, y) {
        
        this.#depth = depth;
        this.#depthInverse = depthMax - this.#depth;
        this.#size = size;
        const sizeHalf = this.#size >> 1;
        const sizeQuat = sizeHalf >> 1;

        this.#left = x - sizeHalf;
        this.#right = x + sizeHalf;
        this.#top = y - sizeHalf;
        this.#bottom = y + sizeHalf;
        
        if (depth < depthMax) {
            this.#quad1 = new Quad(depth+1, depthMax, sizeHalf, this.#left + sizeQuat, y - sizeQuat);
            this.#quad2 = new Quad(depth+1, depthMax, sizeHalf, this.#right - sizeQuat, y - sizeQuat);
            this.#quad3 = new Quad(depth+1, depthMax, sizeHalf, this.#left + sizeQuat, y + sizeQuat);
            this.#quad4 = new Quad(depth+1, depthMax, sizeHalf, this.#right - sizeQuat, y + sizeQuat);
        }
    }

    getQuad(num) {
        if (num == 1) {
            return this.#quad1;
        } else if (num == 2) {
            return this.#quad2;
        } else if (num == 3) {
            return this.#quad3;
        } else if (num == 4) {
            return this.#quad4;
        }
    }

    getValue(x1, x2, y1, y2) {

        if (x2 < this.#left) {
            return 0;
        }
        if (x1 > this.#right) {
            return 0;
        }
        if (y2 < this.#top) {
            return 0;
        }
        if (y1 > this.#bottom) {
            return 0;
        }

        if (this.#quad1 != null) {

            let q1;
            let q2;
            let q3;
            let q4;

            if (this.#depthInverse == 1) {
                q1 = this.#quad4.getValue(x1, x2, y1, y2) << 3;
                q2 = this.#quad3.getValue(x1, x2, y1, y2) << 2;
                q3 = this.#quad2.getValue(x1, x2, y1, y2) << 1;
                q4 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
            } else if (this.#depthInverse == 2) {
                q1 = this.#quad4.getValue(x1, x2, y1, y2) << 12;
                q2 = this.#quad3.getValue(x1, x2, y1, y2) << 8;
                q3 = this.#quad2.getValue(x1, x2, y1, y2) << 4;
                q4 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
            } else if (this.#depthInverse == 3) {
                q1 = this.#quad4.getValue(x1, x2, y1, y2) << 48;
                q2 = this.#quad3.getValue(x1, x2, y1, y2) << 32;
                q3 = this.#quad2.getValue(x1, x2, y1, y2) << 16;
                q4 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
            } 
            let num = q1 + q2 + q3 + q4;

            return num;
        } else {
            return 1;
        }
    }

    get left() {
        return this.#left;
    }
    get right() {
        return this.#right;
    }
    get top() {
        return this.#top;
    }
    get bottom() {
        return this.#bottom;
    }
    get size() {
        return this.#size;
    }

}

export class QuadTree {

    #quad;
    
    constructor() {
        const depthMax = 2;
        const sizeMax = 1024;
        this.#quad = new Quad(0, depthMax, sizeMax, 400, 300);
    }

    getValue(x, y, radius) {
        const x1 = Math.round(x - radius);
        const x2 = Math.round(x + radius);
        const y1 = Math.round(y - radius);
        const y2 = Math.round(y + radius);
        return this.#quad.getValue(x1, x2, y1, y2);
    }

    getQuad() {
        return this.#quad;
    }
}
