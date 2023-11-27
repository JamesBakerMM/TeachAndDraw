class Canvas {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");
        this.colour = new Colour(this.context);
        this.shape = new Tools(this.context,this.colour);
        this.text = new Text(this.context,this.colour);
        this.math = new Maffs(this.context);
    }
    loadAssets() {}
    setupCanvas() {
        //launch static checker!
        this.canvas.width = 800;
        this.canvas.height = 600;
        setup(); // User-defined setup
        window.requestAnimationFrame(()=>{this.drawCanvas()}); // Start the drawing loop
    }
    drawCanvas() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        pen.colour.fill="white";
        pen.colour.stroke="black";

        draw();
        // User-defined drawing code
        // ...

        // Request to call draw again for the next frame
        window.requestAnimationFrame(()=>{this.drawCanvas()}); // Start the drawing loop
    }
}

class Tools {
    constructor(context,colour) {
        this.context=context;
        this.colour=colour;
    }
    rectangle(x, y, w, h) {
        this.context.beginPath();
        this.context.rect(x, y, w, h);
        this.context.fill();
        this.context.stroke();
    }
    oval(x, y, w, h) {
        this.context.beginPath();
        this.context.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }
    line(xStart, yStart, xEnd, yEnd) {
        this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        this.context.lineTo(xEnd, yEnd);
        this.context.stroke();
    }
    multiline(points) {}
    shape(points) {
        //multiple vertex shape, auto connects last to first
    }
    arc(x, y, w, h, start, end) {}
    loadImageFile(filepath) {}
    image(x, y, img, size = 100) {}
    loadTextFile(filepath) {}
}

class Colour {
    #fill
    #stroke
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


class Text {
    constructor(context,colour) {
        this.context=context;
        this.colour=colour;
    }
    /**
     *
     * @param {*} x
     * @param {*} y
     * @param {*} content
     * @param {*} w
     * @param {*} h
     */
    text(x, y, content, w, h) {}
    /**
     *
     * @param {*} size
     */
    size(size) {
        //return false if can't find the file

        return true; //
    }
    /**
     *
     * @param {*} font
     */
    font(font) {}
    /**
     *
     * @param {*} filepath
     */
    loadFont(filepath) {
        return file;
    }
}

class Maffs {
    constructor(context) {
        this.context=context;
    }
    sin() {}
    cos() {}
    tan() {}
    atan() {}
    atan2() {}
    random() {}
}
class Controls{}
class Mouse extends Controls{}
class Keyboard extends Controls{}

const pen = new Canvas();
pen.setupCanvas();
pen.drawCanvas();