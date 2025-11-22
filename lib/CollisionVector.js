import { CollisionUtilities } from "./CollisionUtilities.js";

export class CollisionVector {

    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    length() {
        return Math.sqrt(this.#x**2 + this.#y**2);
    }

    normalize() {
        const len = this.length();
        if (len != 0 && len != 1) {
            this.#x = this.#x / len;
            this.#y = this.#y / len;
        }
        return this;
    }

    normalized() {
        const len = this.length();
        if (len == 0) {
            return new CollisionVector(0, 0);
        } else if (len == 1) {
            return new CollisionVector(this.#x, this.#y);
        } else {
            return new CollisionVector(this.#x / len, this.#y / len);
        }
    }

    multiply(multipler) {
        this.#x = this.#x * multipler;
        this.#y = this.#y * multipler;
        return this;
    }

    reverse() {
        return this.multiply(-1);
    }

    reversed() {
        return new CollisionVector(-this.x, -this.y);
    }

    getNormal() {
        const normalised = this.normalized();
        return new CollisionVector(-normalised.y, normalised.x);
    }

    getDistanceBetweenPoints(otherPoint) {
        const x = otherPoint.x - this.#x;
        const y = otherPoint.y - this.#y;
        return CollisionUtilities.distance(x, y);
    }
}
