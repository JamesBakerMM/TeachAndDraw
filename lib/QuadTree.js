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
        const sizeHalf = this.#size / 2;
        const sizeQuat = sizeHalf / 2;

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


        if ( ( (x1 < this.#left && x2 < this.#left) || (x1 > this.#right && x2 > this.#right)   )  ||
             ( (y1 < this.#top && y2 < this.#top)   || (y1 > this.#bottom && y2 > this.#bottom) ) ) {
            return 0 << this.#depthInverse;
        } else {
            if (this.#quad1 != null) {
                return (this.#quad1.getValue(x1, x2, y1, y2) << 3) + 
                       (this.#quad2.getValue(x1, x2, y1, y2) << 2) + 
                       (this.#quad3.getValue(x1, x2, y1, y2) << 1) + 
                       (this.#quad4.getValue(x1, x2, y1, y2));
            } else {
                return 1;
            }
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
        const depthMax = 4;
        const sizeMax = 2048;
        this.#quad = new Quad(0, depthMax, sizeMax, 400, 300);
    }

    getValue(x, y, w, h) {
        const x1 = x - (w / 2);
        const x2 = x + (w / 2);
        const y1 = y - (h / 2);
        const y2 = y + (h / 2);
        return this.#quad.getValue(x1, x2, y1, y2);
    }

    getQuad() {
        return this.#quad;
    }
}
