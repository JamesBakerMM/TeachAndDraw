export class Velocity {
    #x;
    #y;
    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
    }
    set _perfX(value) {
        this.#x = value;
        return this.#x;
    }
    set _perfY(value) {
        this.#y = value;
        return this.#y;
    }
    set x(value) {
        if (Number.isFinite(value)) {
            this.#x = value;
            return this.#x;
        }
        throw Error(`x has to be a number! you gave ${value}:${typeof value}`);
    }
    get x() {
        return this.#x;
    }
    set y(value) {
        if (Number.isFinite(value)) {
            this.#y = value;
            return this.#y;
        }
        throw Error(`y has to be a number! you gave ${value}:${typeof value}`);
    }
    get y() {
        return this.#y;
    }
}
