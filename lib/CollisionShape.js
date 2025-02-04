export class CollisionShape {

    #minX;
    #minY;
    #maxX;
    #maxY;

    constructor(minX, maxX, minY, maxY) {
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
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
