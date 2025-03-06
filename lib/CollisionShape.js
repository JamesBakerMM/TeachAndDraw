export class CollisionShape {

    #x;
    #y;
    #minX;
    #minY;
    #maxX;
    #maxY;
    #radius;

    constructor(x, y, minX, maxX, minY, maxY, radius) {
        this.#x = x;
        this.#y = y;
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
        this.#radius = radius;
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    get minX() {
        return this.#minX;
    }
    get maxX() {
        return this.#maxX;
    }
    get minY() {
        return this.#minY;
    }
    get maxY() {
        return this.#maxY;
    }
    get radius() {
        return this.#radius;
    }

    static getDistance(x, y) {
        return Math.sqrt(x**2 + y**2);
    }

    static doBoundsOverlap(shape1, shape2) {
        if (shape1.#minX > shape2.#maxX || shape2.#minX > shape1.#maxX || shape1.#minY > shape2.#maxY || shape2.#minY > shape1.#maxY) {
            return false;
        } else {
            return true;
        }
    }
}
