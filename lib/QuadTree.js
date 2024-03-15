export class Quad {

    #depth;
    #depthInverse;
    #width;
    #height;

    #left;
    #right;
    #top;
    #bottom;
    
    #quad1;
    #quad2;
    #quad3;
    #quad4;
    
    constructor(depth, depthMax, width, height, x, y) {
        
        this.#depth = depth;
        this.#depthInverse = depthMax - this.#depth;
        this.#width = width;
        const halfWidth = this.#width >> 1;
        this.#height = height;
        const halfHeight = this.#height >> 1;

        this.#left = x;
        this.#right = x + width;
        this.#top = y;
        this.#bottom = y + height;
        
        if (depth < depthMax) {
            if (depth == 0) {
                this.#quad1 = new Quad(depth+1, depthMax, width, halfHeight, this.#left, this.#top);
                this.#quad2 = new Quad(depth+1, depthMax, width, halfHeight, this.#left, this.#top + halfHeight);
            } else {
                this.#quad1 = new Quad(depth+1, depthMax, halfWidth, halfHeight, this.#left, this.#top);
                this.#quad2 = new Quad(depth+1, depthMax, halfWidth, halfHeight, this.#left + halfWidth, this.#top);
                this.#quad3 = new Quad(depth+1, depthMax, halfWidth, halfHeight, this.#left, this.#top + halfHeight);
                this.#quad4 = new Quad(depth+1, depthMax, halfWidth, halfHeight, this.#left + halfWidth, this.#top + halfHeight);
            }
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

            if (this.#depthInverse == 1) {
                const q4 = this.#quad4.getValue(x1, x2, y1, y2) << 3;
                const q3 = this.#quad3.getValue(x1, x2, y1, y2) << 2;
                const q2 = this.#quad2.getValue(x1, x2, y1, y2) << 1;
                const q1 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
                return q1 + q2 + q3 + q4;
            } else if (this.#depthInverse == 2) {
                const q4 = this.#quad4.getValue(x1, x2, y1, y2) << 12;
                const q3 = this.#quad3.getValue(x1, x2, y1, y2) << 8;
                const q2 = this.#quad2.getValue(x1, x2, y1, y2) << 4;
                const q1 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
                return q1 + q2 + q3 + q4;
            } else if (this.#depthInverse == 3) {
                const q2 = this.#quad2.getValue(x1, x2, y1, y2) << 16;
                const q1 = this.#quad1.getValue(x1, x2, y1, y2) << 0;
                return q1 + q2;
            }

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
    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }
}

export class QuadTree {

    #quad;
    
    constructor() {
        const depthMax = 3;
        const sizeMax = 1024;

        this.#quad = new Quad(0, depthMax, sizeMax, sizeMax, 0, 0);
        console.log(this.#quad);
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