
export class Vector {
    /** Circular buffer for temporary vectors. */
    static #tmp_buf = [];
    /** Index into circular buffer. */
    static #tmp_idx = 0;

    /**
     * Return a reference to a vector in a circular buffer.
     * Intended for storing intermediate values.
     * @param {number} x
     * @param {number} y
     * @returns {Vector} Reference to object
     */
    static temp(x=0, y=x) {
        const bufferSize = 256;

        if (Vector.#tmp_buf.length === 0) {
            for (let i=0; i<bufferSize; i++) {
                Vector.#tmp_buf.push(new Vector(0, 0));
            }
        }
    
        Vector.#tmp_idx = (Vector.#tmp_idx + 1) % bufferSize;
        const vec = Vector.#tmp_buf[Vector.#tmp_idx];
        vec.x = x;
        vec.y = y;
        return vec;
    }

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

    /**
     *
     * @param {Vector} vec
     * @returns {number}
     */
    cross(vec) {
        return this.x*vec.y - vec.x*this.y;
    }

    /**
     * Rotate the vector angle radians about the origin.
     * @param {number} angle 
     */
    rotate(angle) {
        const S = Math.sin(angle);
        const C = Math.cos(angle);
        const x = this.x;
        const y = this.y;
        this.x = C*x - S*y;
        this.y = S*x + C*y;
    }
}
