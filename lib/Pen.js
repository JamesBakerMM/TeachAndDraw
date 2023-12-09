import { ImageManager } from "./ImageManager.js";
import { Img } from "./Img.js";
import { Space } from "./Space.js";
import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { Maffs } from "./maffs.js";
import { Button } from "./Button.js";
import { Mouse } from "./Mouse.js";
import { Keyboard } from "./Keyboard.js";
import { Point } from "./Point.js";
import { AssetManager, AssetJob } from "./AssetManager.js";
import { TextFileAsset } from "./TextFileAsset.js";
import { JsonFileAsset } from "./JsonFileAsset.js";

export class Pen {
    static debug = false;
    #assets;
    constructor(draw) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //internal state managers
        this.#assets = new AssetManager(this);

        //instruction set
        this.context.space = new Space(); //nuke this can use translate for the effect
        this.colour = new Colour(this.context);
        this.shape = new Shape(this.context, this.colour);
        this.text = new Text(this.context, this.colour);
        this.math = new Maffs(this.context);
        this.mouse = new Mouse(this);
        this.kb = new Keyboard(this);

        //fps controls
        this.frameCount = -1;
        this.fps = 60; // Target FPS
        this.fpsInterval = 1000 / this.fps; // Interval in milliseconds
        this.fpsThen = window.performance.now();

        //collections
        this.preloadTasks = [];
        this.assets = {};
        this.userFuncs = {
            // preload: preload,
            // setup: setup,
            draw: draw,
        };
        this.entities = [];
        this.isTabActive = true;
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
    loadImage(x, y, filepath) {
        if (Number.isFinite(x) || Number.isFinite(y)) {
            //check if the filepath is already being loaded!

            for(let file of this.#assets.jobs) {
                if(file.filepath===filepath){
                    return file.asset
                }
            }


            const job = new AssetJob(filepath);
            const img = new Img(x, y, this, filepath, job);
            job.asset=img;
            this.#assets.jobs.push(job);
            return img;
        }
        console.error("HEY X OR Y ISNT A NUMBER");
    }
    loadTextFile(filepath){
        
        for(let file of this.#assets.jobs) {
            if(file.filepath===filepath){
                return file.asset
            }
        }

        const job = new AssetJob(filepath);
        const text = new TextFileAsset(filepath,job);
        job.asset=text;
        this.#assets.jobs.push(job);
        return text;
    }    
    loadJsonFile(filepath){
        for(let file of this.#assets.jobs) {
            if(file.filepath===filepath){
                return file.asset
            }
        }

        const job = new AssetJob(filepath);
        const json = new JsonFileAsset(filepath,job);
        job.asset=json;
        this.#assets.jobs.push(job);
        return json;
    }
    preload() {
        // this.userFuncs.preload();
        // console.log(this.preloadTasks);
        this.start();
    }
    setupVisibilityChange() {
        document.addEventListener("visibilitychange", () => {
            this.isTabActive = !document.hidden;
            if (this.isTabActive) {
                // Tab is active, resume the draw cycle
                this.drawCanvas();
            }
        });
    }
    setupCanvas() {
        //launch static checker eventually.
        this.canvas.width = 800;
        this.canvas.height = 600;
        // this.userFuncs.setup();
        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawDebug() {
        this.colour.fill = "rgba(0,0,0,1)";
        this.shape.rectangle(0, 8, 150, 15);
        this.colour.fill = "green";
        this.colour.stroke = "green";
        this.text.draw(10, 10, `frame:${this.frameCount}`);
        const INCREMENT = 50;
        for (let i = 0; i < this.w / INCREMENT; i++) {
            this.colour.fill = "rgba(0,55,0,0.5)";
            this.colour.stroke = "rgba(0,255,0,0.03)";
            for (let y = 0; y < this.h / INCREMENT; y++) {
                this.shape.line(i * INCREMENT, 0, i * INCREMENT, this.h);
                this.colour.stroke = "rgba(0,255,0,0.04)";
                this.shape.line(0, INCREMENT * y, this.w, INCREMENT * y);
                this.text.draw(INCREMENT, INCREMENT * y, y * INCREMENT);
                this.text.draw(i * INCREMENT, INCREMENT, i * INCREMENT);
            }
        }
    }
    drawCanvas() {
        if (!this.isTabActive) {
            return; // Stop the draw cycle if the tab is not active
        }
        const now = window.performance.now();
        const elapsed = now - this.fpsThen;
        // Check if enough time has passed since the last frame
        if (elapsed > this.fpsInterval && !document.hidden) {

            // console.log("CHECKING LOADING",this.#assets.isLoaded())
            if (this.#assets.isLoaded()===false) {
                // console.log("LOADING");
                this.clearCanvas();
                this.#assets.draw();
            } else {            
                this.clearCanvas();
                this.frameCount += 1;
                this.fpsThen = now - (elapsed % this.fpsInterval);
                // Clear the canvas
                this.colour.fill = "white";
                this.colour.stroke = "white";
                this.userFuncs.draw();
                if (this.debug) {
                    this.drawDebug();
                }
                this.kb.draw();
                this.mouse.draw();
            }
        }

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    makeButton(x, y, w, h, label = "btn") {
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
