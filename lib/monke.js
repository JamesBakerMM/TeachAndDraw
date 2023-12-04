import {ImageManager} from "./ImageManager.js";
import {Space} from "./Space.js";
import {Shape} from "./Shape.js";
import {Colour} from "./Colour.js";
import {Text} from "./Text.js";
import {Maffs} from "./maffs.js";
import {Button} from "./Button.js";
import {Mouse} from "./Mouse.js";
import {Point} from "./Point.js";

export class Pen {
    #debug;
    constructor(preload, setup, draw) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");
        this.context.space = new Space();
        this.colour = new Colour(this.context);
        this.shape = new Shape(this.context, this.colour);
        this.text = new Text(this.context, this.colour);
        this.math = new Maffs(this.context);
        this.image = new ImageManager(this.context);
        this.mouse= new Mouse(this);
        this.preloadTasks = [];
        this.assets = {};
        this.userFuncs = {
            preload: preload,
            setup: setup,
            draw: draw,
        };
    }

    set x(value){
        //check if number
        this.context.space.origin.x = value;
    }
    set y(value){
        //check if number
        this.context.space.origin.y = value;       
    }
    get x(){
        return this.context.space.origin.x;
    }
    get y(){
        return this.context.space.origin.y;       
    }
    /**
     * @param {number} value
     */
    set debug(value) {
        this.#debug = value;
    }
    get debug() {
        return this.#debug;
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
    loadImage(filepath) {
        const img = new Image();
        img.src = filepath;

        return img
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
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.colour.fill = "white";
        this.colour.stroke = "white";

        this.userFuncs.draw();

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    makeButton(x,y,w,h){
        return new Button(x,y,w,h,this)
    }
    makePoint(x,y){
        return new Point(x,y,this)
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
