export class Flip {
    #x;
    #y;
    constructor() {
        this.#x = false;
        this.#y = false;
        Object.seal(this);
    }
    set x(value) {
        if (typeof value !== "boolean") {
            throw new Error("flip x needs to be given a boolean!");
        }
        this.#x=value;
    }
    get x() {
        return this.#x
    }
    set y(value) {
        if (typeof value !== "boolean") {
            throw new Error("flip y needs to be given a boolean!");
        }
        this.#y=value;
    }
    get y() {
        return this.#y
    }
}
