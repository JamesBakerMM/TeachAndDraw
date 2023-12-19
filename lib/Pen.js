import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { Maffs } from "./maffs.js";
import { Mouse } from "./Mouse.js";
import { Keyboard } from "./Keyboard.js";
import { Debug } from "./Debug.js";

import { lock } from "./Lock.js";

//entities
import { Img,ImgWrapper } from "./Img.js";
import { Button } from "./Button.js";

//data structures
import { Point } from "./Point.js";
import { Group } from "./Group.js";
import { Animation } from "./Animation.js";

//game stuff
import {Collider} from "./Collider.js";

//assets
import { AssetManager, AssetJob } from "./AssetManager.js";
import { TextFileAsset } from "./TextFileAsset.js";
import { JsonFileAsset } from "./JsonFileAsset.js";
//@ts-expect-error
import { DrawStateManager } from "./DrawStateManager.js"

export class Pen {
    static debug = false;

    #assets;
    constructor(draw=()=>{}) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");

        //internal state managers
        this.#assets = new AssetManager(this);
        this.state = new DrawStateManager(this);

        //instruction set
        this.colour = new Colour(this.context);
        this.shape = new Shape(this.context, this.colour);
        this.text = new Text(this);
        this.math = new Maffs(this.context);
        this.mouse = new Mouse(this);
        this.kb = new Keyboard(this);

        //fps controls
        this.frameCount = -1;
        this.fps = 20; // Target FPS
        this.fpsInterval = 1000 / this.fps; // Interval in milliseconds
        this.fpsThen = window.performance.now();

        //collections
        this.assets = {};
        this.userFuncs = {
            draw: draw,
        };
        this.entities = [];
        this.isTabActive = true;
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
    loadAnimation(x,y,...paths) {
        if (Number.isFinite(x) || Number.isFinite(y)) {

            const images=[];
            for(let path of paths){
                images.push(this.loadImage(x,y,path));
            }
            console.log(images)
            const newAnim = new Animation(x,y,this,...images);
            console.log(newAnim)
            return newAnim;
        }
        throw Error("x and y have to be numbers");
    }
    loadImage(x, y, filepath) {
        if (Number.isFinite(x) || Number.isFinite(y)) {
            //check if the filepath is already being loaded!
            let file;
            for(let file of this.#assets.jobs) {
                if(file.filepath===filepath){
                    const imgWrapper = new ImgWrapper(x,y,file.asset,this);
                    file.asset.wrapper=imgWrapper;
                    return imgWrapper
                }
            }

            const job = new AssetJob(filepath);
            const img = new Img(filepath, job);
            const imgWrapper = new ImgWrapper(x,y,img,this);
            img.wrapper=imgWrapper;
            job.asset=img;
            this.#assets.jobs.push(job);
            // console.log("returning",imgWrapper,imgWrapper.draw)
            return imgWrapper;
        }
        throw new Error(
            `x and y need to be numbers you gave:
            x:${x}:${typeof x},y:${y}:${typeof y}`
        );
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
        this.start();
    }
    setupVisibilityChange() {
        document.addEventListener("visibilitychange", () => {
            this.isTabActive = !document.hidden;
            if (this.isTabActive) {
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
    drawCanvas() {
        if (!this.isTabActive) {
            // clear kb and mouse input
            return; // Stop the draw cycle if the tab is not active
        }
        const now = window.performance.now();
        const elapsed = now - this.fpsThen;
        // Check if enough time has passed since the last frame
        if (elapsed > this.fpsInterval && !document.hidden) {
            this.clearCanvas();
            if (this.#assets.isLoaded()===false) {
                this.#assets.draw();
            } else {            
                this.frameCount += 1;
                this.fpsThen = now - (elapsed % this.fpsInterval);
                
                // Clear the canvas
                this.state.reset();
                this.userFuncs.draw();
                if (this.debug) {
                    Debug.drawPen(this);
                }
                this.kb.draw();
                this.mouse.draw();
                Group.cleanup();
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
        return new Point(this,x, y);
    }
    makeBoxCollider(x,y,w,h=w){
        return new Collider(this,x,y,w,h)
    }
    makeCircleCollider(x,y,d){

    }
    start(userDrawFunc) {
        this.userFuncs.draw=userDrawFunc;
        this.setupCanvas(); // Call user-defined setup
    }
}

export const $ = new Pen();
/**
 * @type {Shape}
 */
export const shp = $.shape;
/**
 * @type {Colour}
 */
export const col = $.colour;
/**
 * @type {Mouse}
 */
export const mouse = $.mouse;

/**
 * @type {Keyboard}
 */
export const kb = $.kb;

/**
 * @type {Text}
 */
export const txt = $.text;
