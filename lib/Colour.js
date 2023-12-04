export class Colour {
    #fill;
    #stroke;
    constructor(context) {
        this.context = context;
        this.#fill = "#000000"; // default fill color
        this.#stroke = "#000000"; // default stroke color
    }

    get fill() {
        return this.#fill;
    }

    set fill(value) {
        this.#fill = value;
        this.context.fillStyle = value;
    }

    get stroke() {
        return this.#stroke;
    }

    set stroke(value) {
        this.#stroke = value;
        this.context.strokeStyle = value;
    }
}
