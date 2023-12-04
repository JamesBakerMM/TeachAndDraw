export class Space {
    constructor() {
        this.origin = {
            x: 0,
            y: 0,
        };
        this.scale = 1;
    }
    x(value) {
        return value + this.origin.x;
    }
    y(value) {
        return value + this.origin.y;
    }
    rescale(value) {
        return value * this.scale;
    }
}