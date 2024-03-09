export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        Object.preventExtensions(this);
    }

    addVec(vec) {
        const newVec = this.clone();
        newVec.add(vec);
        return newVec;
    }

    subtractVec(vec) {
        const newVec = this.clone();
        newVec.subtract(vec);
        return newVec;
    }

    multiplyVec(scalar) {
        const newVec = this.clone();
        newVec.multiply(scalar);
        return newVec;
    }

    normal() {
        const newVec = this.clone();
        newVec.x = -this.y;
        newVec.y = this.x;
        newVec.normalize();
        return newVec;
    }

    normalizeVec() {
        const newVec = this.clone();
        newVec.normalize();
        return newVec;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

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

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
}
