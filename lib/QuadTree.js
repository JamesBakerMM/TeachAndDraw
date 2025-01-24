export class Quad {
    #depth;
    #size;

    #left;
    #right;
    #top;
    #bottom;

    #quad1;
    #quad2;
    #quad3;
    #quad4;

    #objects;

    /**
     * @param {number} depth
     * @param {number} depthMax
     * @param {string | any[]} objects
     * @param {number} size
     * @param {number} x
     * @param {number} y
     */
    constructor(depth, depthMax, objects, size, x, y) {
        this.#depth = depth;
        this.#size = size;
        const halfSize = this.#size / 2;

        this.#left = x;
        this.#right = x + size;
        this.#top = y;
        this.#bottom = y + size;

        if (objects.length <= 4 || depth == depthMax) {
            this.#objects = objects;
        } else {
            this.#objects = null;

            let obj1 = new Array();
            let obj2 = new Array();
            let obj3 = new Array();
            let obj4 = new Array();
            for (let i = 0; i < objects.length; i++) {
                const o = objects[i];
                if (o.x1 < this.#left + halfSize) {
                    //left
                    if (o.y1 < this.#top + halfSize) {
                        //left-top
                        obj1.push(o);
                    }
                    if (o.y2 >= this.#top + halfSize) {
                        //right-top
                        obj3.push(o);
                    }
                }
                if (o.x2 >= this.#left + halfSize) {
                    //right
                    if (o.y1 < this.#top + halfSize) {
                        //left-bottom
                        obj2.push(o);
                    }
                    if (o.y2 >= this.#top + halfSize) {
                        //right-bottom
                        obj4.push(o);
                    }
                }
            }

            if (obj1.length > 0) {
                this.#quad1 = new Quad(
                    depth + 1,
                    depthMax,
                    obj1,
                    halfSize,
                    this.#left,
                    this.#top
                );
            } else {
                this.#quad1 = null;
            }
            if (obj2.length > 0) {
                this.#quad2 = new Quad(
                    depth + 1,
                    depthMax,
                    obj2,
                    halfSize,
                    this.#left + halfSize,
                    this.#top
                );
            } else {
                this.#quad2 = null;
            }
            if (obj3.length > 0) {
                this.#quad3 = new Quad(
                    depth + 1,
                    depthMax,
                    obj3,
                    halfSize,
                    this.#left,
                    this.#top + halfSize
                );
            } else {
                this.#quad3 = null;
            }
            if (obj4.length > 0) {
                this.#quad4 = new Quad(
                    depth + 1,
                    depthMax,
                    obj4,
                    halfSize,
                    this.#left + halfSize,
                    this.#top + halfSize
                );
            } else {
                this.#quad4 = null;
            }
        }
    }

    /**
     * @param {number} num 
     * @returns 
     */
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
    get objects() {
        return this.#objects;
    }
}

export class QuadTree {
    #quad;

    constructor() {
        this.#quad = null;
    }

    makeTree(objects) {
        const size = 1024;
        const depthMax = 8;
        this.#quad = new Quad(0, depthMax, objects, size, 0, 0);
    }

    getTree() {
        return this.#quad;
    }
}
