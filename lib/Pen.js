import { ImageManager } from "./ImageManager.js";
import { Img } from "./Img.js";
import { Space } from "./Space.js";
import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { Maffs } from "./maffs.js";
import { Button } from "./Button.js";
import { Mouse } from "./Mouse.js";
import { Point } from "./Point.js";

export class Pen {
    static debug=true;
    constructor(preload, setup, draw) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //instruction set
        this.context.space = new Space();
        this.colour = new Colour(this.context);
        this.shape = new Shape(this.context, this.colour);
        this.text = new Text(this.context, this.colour);
        this.math = new Maffs(this.context);
        this.mouse = new Mouse(this);

        //fps controls
        this.frameCount = 0;
        this.fps = 60; // Target FPS
        this.fpsInterval = 1000 / this.fps; // Interval in milliseconds
        this.fpsThen = window.performance.now();
        
        //collections
        this.preloadTasks = [];
        this.assets = {};
        this.userFuncs = {
            preload: preload,
            setup: setup,
            draw: draw,
        };
        this.entities = [];
    }

    set x(value) {
        if (Number.isFinite(value)) {
            this.context.space.origin.x = value;
            return this.context.space.origin.x;
        }
    }
    set y(value) {
        if (Number.isFinite(value)) {
            this.context.space.origin.y = value;
            return this.context.space.origin.y;
        }
    }
    get x() {
        return this.context.space.origin.x;
    }
    get y() {
        return this.context.space.origin.y;
    }
    /**
     * @param {number} value
     */
    set debug(value) {
        Pen.debug = value;
    }
    get debug() {
        return Pen.debug;
    }
    /**
     * @param {number} value
     */
    set w(value) {
        this.canvas.width = value;
    }
    get w() {
        return this.canvas.width;
    }
    /**
     * @param {number} value
     */
    set h(value) {
        this.canvas.height = value;
    }
    get h() {
        return this.canvas.height;
    }
    loadImage(x,y,filepath) {
        if (Number.isFinite(x)||Number.isFinite(y)) {
            const img = new Img(x,y,this,filepath);

            return img;
        }
        console.error("HEY X OR Y ISNT A NUMBER")
    }
    preload() {
        this.userFuncs.preload();
        console.log(this.preloadTasks);
        this.start();
    }
    setupCanvas() {
        //launch static checker eventually.
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.userFuncs.setup();
        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    drawCanvas() {
        const now = window.performance.now();
        const elapsed = now - this.fpsThen;
        // Check if enough time has passed since the last frame
        if (elapsed > this.fpsInterval) {
            this.frameCount += 1;
            this.fpsThen = now - (elapsed % this.fpsInterval);
            // Clear the canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.colour.fill = "white";
            this.colour.stroke = "white";

            this.userFuncs.draw();

            if(this.debug){
                this.colour.fill="rgba(0,0,0,1)";
                this.shape.rectangle(0,0,150,15)
                this.colour.fill="green";
                this.colour.stroke="green";
                this.text.draw(10,10,`frame:${this.frameCount}`);
            }
        }

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    makeButton(x, y, w, h,label="btn") {
        return new Button(x, y, w, h, label, this);
    }
    makePoint(x, y) {
        return new Point(x, y, this);
    }

    async start() {
        // try {
        const loadedAssets = await Promise.all(this.preloadTasks);
        loadedAssets.forEach((asset, index) => {
            this.assets[`asset${index}`] = asset;
            console.log("assets", this.assets);
        });
        this.setupCanvas(); // Call user-defined setup
    }
}

class Controls {}
class Keyboard extends Controls {}
