export class Vector {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        Object.preventExtensions(this);
    }

    /**
     * 
     * @param {Vector} vec 
     * @returns {Vector}
     */
    addVec(vec) {
        const newVec = this.clone();
        newVec.add(vec);
        return newVec;
    }

    /**
     * 
     * @param {Vector} vec 
     * @returns Vector
     */
    subtractVec(vec) {
        const newVec = this.clone();
        newVec.subtract(vec);
        return newVec;
    }

    /**
     * 
     * @param {Number} scalar 
     * @returns {Vector}
     */
    multiplyVec(scalar) {
        const newVec = this.clone();
        newVec.multiply(scalar);
        return newVec;
    }

    /**
     * 
     * @returns {Vector}
     */
    normal() {
        const newVec = this.clone();
        newVec.x = -this.y;
        newVec.y = this.x;
        newVec.normalize();
        return newVec;
    }

    /**
     * 
     * @returns {Vector}
     */
    normalizeVec() {
        const newVec = this.clone();
        newVec.normalize();
        return newVec;
    }

    /**
     * 
     * @returns {Vector}
     */
    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     * 
     * @param {Vector} vec 
     */
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    /**
     * 
     * @param {Vector} vec 
     */
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    /**
     * 
     * @param {number} scalar 
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * 
     * @returns {number}
     */
    distance() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const distanceFromZero = this.distance();
        if (distanceFromZero === 0) {
            this.x = 0;
            this.y = 0;
            return;
        }
        this.x = this.x / distanceFromZero;
        this.y = this.y / distanceFromZero;
    }

    /**
     * 
     * @param {Vector} vec 
     * @returns {number}
     */
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
}
