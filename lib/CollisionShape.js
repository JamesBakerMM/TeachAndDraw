export class CollisionShape {

    #x;
    #y;
    #minX;
    #minY;
    #maxX;
    #maxY;
    #radius;

    #newX;
    #newY
    #newVelocityX;
    #newVelocityY;
    #newVelocityRot;

    constructor(x, y, minX, maxX, minY, maxY, radius) {
        this.#x = x;
        this.#y = y;
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
        this.#radius = radius;
        
        this.#newX = 0;
        this.#newY = 0;
        this.#newVelocityX = 0;
        this.#newVelocityY = 0;
        this.#newVelocityRot = 0;
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

    get newX() {
        return this.#newX;
    }
    get newY() {
        return this.#newY;
    }
    get newVelocityX() {
        return this.#newVelocityX;
    }
    get newVelocityY() {
        return this.#newVelocityY;
    }
    get newVelocityRot() {
        return this.#newVelocityRot;
    }

    set x(value) {
        this.#x = value;
    }
    set y(value) {
        this.#y = value;
    }

    set newX(value) {
        this.#newX = value;
    }
    set newY(value) {
        this.#newY = value;
    }
    set newVelocityX(value) {
        this.#newVelocityX = value;
    }
    set newVelocityY(value) {
        this.#newVelocityY = value;
    }
    set newVelocityRot(value) {
        this.#newVelocityRot = value;
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
