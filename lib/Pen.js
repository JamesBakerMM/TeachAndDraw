import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { Maffs } from "./maffs.js";
import { Mouse } from "./Mouse.js";
import { Touch } from "./Touch.js";
import { Keyboard } from "./Keyboard.js";
import { Debug } from "./Debug.js";
import { Camera } from "./Camera.js";
import { Sound } from "./Sound.js";
import { Gui } from "./Gui.js";

// @ts-ignore
import { lock } from "./Lock.js";
import { Video } from "./Video.js";

import { TimeManager } from "./TimeManager.js";

//entities
import { Img, ImgWrapper } from "./Img.js";
import { Button } from "./Button.js";

//data structures
import { Entity } from "./Entity.js";
import { Point } from "./Point.js";
import { Group, makeGroup } from "./Group.js";
import { Animation } from "./Animation.js";

//game stuff
import { MovementManager } from "./MovementManager.js";
import { Collider } from "./Collider.js";
import { CollisionManager } from "./CollisionManager.js";

//assets
import { AssetManager, AssetJob } from "./AssetManager.js";
import { TextFileAsset } from "./TextFileAsset.js";
import { JsonFileAsset } from "./JsonFileAsset.js";
import { SoundFileAsset } from "./SoundFileAsset.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

import { DrawStateManager } from "./DrawStateManager.js";

/**
 * @class Pen
 */
export class Pen {
    /**
     * @type {boolean}
     */
    static debug = false;

    #assets;
    #movementManager;
    #collisionManager;
    #userFuncs;
    #isTabActive;
    #paused;
    /**
     * @type {number[]}
     */
    #frameTimes;

    constructor(
        draw = () => {
            console.warn("no user made function for draw given!");
        }
    ) {
        this.canvas = document.getElementById("myCanvas");
        // @ts-ignore
        this.context = this.canvas.getContext("2d");

        //instruction set
        this.math = new Maffs(this);
        this.colour = new Colour(this);
        this.shape = new Shape(this);
        this.text = new Text(this);
        this.mouse = new Mouse(this);
        this.touch = new Touch(this);
        this.keys = new Keyboard(this);
        this.camera = new Camera(this);

        this.sound = new Sound(this);

        this.gui = new Gui(this);

        //internal state managers
        this.#assets = new AssetManager(this);
        this.state = new DrawStateManager(this);

        //physics
        this.#movementManager = new MovementManager(this);
        this.#collisionManager = new CollisionManager(this);

        this.time = new TimeManager();
        //fps controls
        this.averageFps = 0; // Stores the average frames per second.

        this.#frameTimes = []; // Stores the timestamps of the last N frames.
        this.lastFrameTimestamp = window.performance.now();

        this.#paused = false;

        //collections
        this.#userFuncs = {
            draw: draw,
        };

        this.#isTabActive = true;

        //tunnelling code
        this.fractionOfMovement = 0.1;
    }

    /**
     * @private
     */
    stroke() {
        throw new Error("You probably wanted $.colour.stroke not $.stroke :)");
    }

    /**
     * @private
     */
    fill() {
        throw new Error("You probably wanted $.colour.fill not $.fill :)");
    }

    /**
     * Makes
     * @param  {...any} values
     * @returns {Group}
     */
    makeGroup(...values) {
        return makeGroup(this, ...values);
    }

    set paused(value) {
        if (typeof value === "boolean") {
            this.#paused = value;
            return;
        }
        throw new Error(
            `Paused expects a boolean you gave ${value}:${typeof value}`
        );
    }
    get paused() {
        return this.#paused;
    }
    /**
     * @param {number} value
     */
    set debug(value) {
        // confirm its a boolean
        let prevVal = Pen.debug;
        // @ts-ignore
        Pen.debug = value;
        if (Pen.debug && prevVal === false) {
            //went from false to true!
            Debug.applyDebugGrid();
        }
        if (Pen.debug === false && prevVal) {
            //went from true to false
            Debug.removeDebugGrid();
        }
    }
    get debug() {
        // @ts-ignore
        return Pen.debug;
    }
    /**
     * @param {number} value
     */
    set w(value) {
        this.width = value;
    }
    get w() {
        return this.width;
    }
    /**
     * @param {number} value
     */
    set h(value) {
        this.height = value;
    }
    get h() {
        return this.height;
    }

    /**
     * @param {number} value
     */
    set width(value) {
        // @ts-ignore
        this.canvas.width = value;
    }
    get width() {
        // @ts-ignore
        return this.canvas.width;
    }
    /**
     * @param {number} value
     */
    set height(value) {
        // @ts-ignore
        this.canvas.height = value;
    }
    get height() {
        // @ts-ignore
        return this.canvas.height;
    }

    get frameCount() {
        return this.time.frameCount;
    }

    set fps(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "fps has to be a number!"
                )
            );
        }
        if (value < 1) {
            throw new Error("fps has to be set 1 or more");
        }
        this.time.fps = value;
    }

    get fps() {
        return this.time.fps;
    }
    /**
     * Loads an animation consisting of multiple images from given file paths.
     * This method creates a new Animation object, loads each image specified in the filepaths,
     * and returns the assembled animation.
     * @param {number} x - The x-coordinate where the animation will be positioned.
     * @param {number} y - The y-coordinate where the animation will be positioned.
     * @param {...string} filepaths - File paths of images to be loaded for the animation.
     * @returns {Animation} The newly created Animation object.
     * @throws {Error} If x or y are not finite numbers.
     * @throws {Error} If any of the filepaths are not strings or if no filepaths are provided.
     */
    loadAnimation(x, y, ...filepaths) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (filepaths.length === 0) {
            throw new Error(
                "no images provided! animations need photos! photos of spiderman!"
            );
        }
        if (this.frameCount >= 0) {
            throw new Error(
                `You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!\n
                ---------------------
For more information on common mistakes with loading visit:
${Video.loading.title} | ${Video.loading.url}
                `
            );
        }
        for (let i = 0; i < filepaths.length; i++) {
            const path = filepaths[i];
            if (typeof path !== "string") {
                throw new Error(
                    `Filepath at index ${i} is not a string. You gave: ${path}|${typeof path}`
                );
            }
        }
        const images = [];
        for (let path of filepaths) {
            images.push(this.loadImageToStamp(x, y, path));
        }
        const newAnim = new Animation(x, y, this, ...images);
        return newAnim;
    }

    /**
     * Loads an image from a given file path, wraps it in an ImgWrapper object, and returns the wrapper.
     * This method checks if the image has already been loaded to avoid duplication.
     * If the image is new, it creates a new AssetJob for loading and tracking the image's loading state.
     *
     * @param {number} x - The x-coordinate where the image will be positioned upon rendering.
     * @param {number} y - The y-coordinate where the image will be positioned upon rendering.
     * @param {string} filepath - The file path of the image to be loaded.
     * @returns {ImgWrapper} The ImgWrapper object containing the loaded image.
     * @throws {Error} If x or y are not finite numbers, indicating incorrect positioning parameters.
     * @throws {Error} If the filepath argument is not a string, indicating an invalid file path.
     */

    loadImageToStamp(x, y, filepath) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                //check if the filepath is already being loaded!
                // @ts-ignore
                const imgWrapper = new ImgWrapper(x, y, file.asset, this);
                // @ts-ignore
                file.asset.wrapper.push(imgWrapper);
                return imgWrapper;
            }
        }

        const job = new AssetJob(filepath);
        const img = new Img(filepath, job);
        const imgWrapper = new ImgWrapper(x, y, img, this);
        img.wrapper.push(imgWrapper);
        // @ts-ignore
        job.asset = img;
        this.#assets.jobs.push(job);

        return imgWrapper;
    }

    /**
     * Loads a text file from the specified filepath. If the file is already in the process of loading or has been loaded, it returns the existing TextFileAsset instance; otherwise, it starts a new load process.
     *
     * @param {string} filepath - The path to the text file to load.
     * @returns {TextFileAsset} The TextFileAsset instance for the loaded text file.
     * @throws {Error} If the filepath argument is not a string.
     */

    loadTextFile(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }

        const job = new AssetJob(filepath);
        const text = new TextFileAsset(filepath, job);
        // @ts-ignore
        job.asset = text;
        this.#assets.jobs.push(job);
        return text;
    }

    /**
     * Loads a JSON file from the specified filepath. If the file is already being loaded or has been loaded,
     * it returns the existing JsonFileAsset instance; otherwise, it initiates a new load process.
     *
     * @param {string} filepath - The path to the JSON file to load.
     * @returns {JsonFileAsset} The JsonFileAsset instance for the loaded JSON file.
     * @throws {Error} If the filepath argument is not a string.
     */
    loadJsonFile(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }
        const job = new AssetJob(filepath);
        const json = new JsonFileAsset(filepath, job);
        // @ts-ignore
        job.asset = json;
        this.#assets.jobs.push(job);
        return json;
    }

    /**
     *
     * @param {string} filepath
     * @returns {SoundFileAsset}
     * * @throws {Error} If the filepath argument is not a string.
     */
    loadSound(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }

        const job = new AssetJob(filepath);

        const soundAsset = new SoundFileAsset(
            filepath,
            job,
            this.sound.context
        );
        // @ts-ignore
        job.asset = soundAsset;
        this.#assets.jobs.push(job);
        return soundAsset;
    }

    /**
     * Sets up a listener for the document's visibility change event to pause the game when the tab is not active
     */

    /**
     * private_internal
     */
    setupTabSwitchListener() {
        document.addEventListener("visibilitychange", () => {
            this.#isTabActive = !document.hidden;
            if (this.#isTabActive) {
                this.drawCanvas();
            } else {
                this.keys.clearKeys();
            }
        });
    }

    /**
     * private_internal
     */
    setupCanvas() {
        //launch static checker eventually.
        this.width = 800;
        this.height = 600;

        //set up the entity all group done here due to hoisting issues
        // @ts-ignore
        Entity.all = makeGroup();
        // @ts-ignore
        Entity.all.name = "Entity.all";

        this.setupTabSwitchListener();
        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }

    /**
     * private_internal
     */
    clearCanvas() {
        // @ts-ignore
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * private_internal
     */
    drawEntities() {
        for (let entity of Entity.all) {
            entity.draw();
        }
    }

    /**
     * private_internal
     */
    drawColliders() {
        for (let i = 0; i < Collider.all.length; i++) {
            Collider.all[i].draw();
        }
    }
    /**
     *
     * @param {Array<Number>} arr
     * private_internal
     * @returns
     */
    #calculateAverage(arr) {
        let sum = 0;
        if (arr.length === 0) {
            return 0;
        }
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum / arr.length;
    }

    /**
     * private_internal
     */
    drawCanvas() {
        if (!this.#isTabActive || this.#paused) {
            return; // Stop the draw cycle if the tab is not active
        }

        if (!document.hidden) {
            // per frame code
            //update camera cehnter
            this.camera.setCameraCenter(this.width / 2, this.height / 2);
            if (this.debug) {
                //frameRate tracking and calculation
                const frameTimeDif = this.time.msThen - this.lastFrameTimestamp;
                this.lastFrameTimestamp = this.time.msThen;
                this.#frameTimes.push(frameTimeDif);

                const twoSeconds = this.time.fps * 2;
                if (this.#frameTimes.length > twoSeconds) {
                    // Keep last 2 seconds of frame times
                    this.#frameTimes.shift();
                }

                const averageFrameTime = this.#calculateAverage(
                    this.#frameTimes
                );
                this.averageFps = 1000 / averageFrameTime;
            }

            this.clearCanvas();
            if (this.#assets.isLoaded() === false) {
                this.#assets.draw();
            } else {
                this.time.update();
                // Clear the canvas
                this.state.reset();

                //JAMES PLZ FIX INTO UPKEEP
                if (Collider.all != undefined) {
                    for (let i = 0; i < Collider.all.length; i++) {
                        Collider.all[i].validOverlapsIds = new Set();
                        Collider.all[i].validCollisionIds = new Set();
                    }
                }

                this.#userFuncs.draw();

                //JAMES PLZ FIX INTO DOWNKEEP
                if (Collider.all != undefined) {
                    for (let i = 0; i < Collider.all.length; i++) {
                        Collider.all[i].overlays = new Set();
                        Collider.all[i].collisions = new Set();
                    }
                }

                if (this.debug) {
                    Debug.constructInfoPane(this);
                    Debug.drawPen(this);
                }

                this.keys.draw();
                this.mouse.draw();
                this.touch.draw();

                //physics stuff
                this.fractionOfMovement = 1;
                for (let i = 0; i < 1 / this.fractionOfMovement; i++) {
                    this.#collisionManager.handleCollisions();
                    // @ts-ignore
                    this.#movementManager.handleMovement(
                        this.fractionOfMovement
                    );
                }

                this.#collisionManager.finishCollisions();

                this.camera.draw();
                Group.cleanup();
            }
        }

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }

    /**
     * Creates a new Entity object.
     * @param {number} x - The x-coordinate of the entitys's position.
     * @param {number} y - The y-coordinate of the entitys's position.
     * @returns {Entity} The newly created Entity.
     * @throws {Error} If x, y, are not finite numbers.
     */
    makeEntity(x, y) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        return new Entity(this, x, y);
    }

    /**
     * Creates a new Button object.
     * @param {number} x - The x-coordinate of the button's position.
     * @param {number} y - The y-coordinate of the button's position.
     * @param {number} w - The width of the button.
     * @param {number} h - The height of the button.
     * @param {string} [label="btn"] - The label text of the button. Defaults to "btn".
     * @returns {Button} The newly created Button object.
     * @throws {Error} If x, y, w, h are not finite numbers or if label is not a string.
     */
    makeButton(x, y, w, h, label = "btn") {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }

        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number")
            );
        }

        if (typeof label !== "string") {
            throw Error(
                `You need to give a string for the label.\n` +
                    `You gave: ${label}:${typeof label}`
            );
        }
        return new Button(x, y, w, h, label, this);
    }
    /**
     * Creates a new Point object.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {Point} The newly created Point object.
     * @throws {Error} If x or y are not finite numbers.
     */
    makePoint(x, y) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        return new Point(this, x, y);
    }
    /**
     * Creates a new Collider object representing a box collider.
     * @param {number} x - The x-coordinate of the collider's position.
     * @param {number} y - The y-coordinate of the collider's position.
     * @param {number} w - The width of the collider.
     * @param {number} h - The height of the collider.
     * @returns {Collider} The newly created Collider object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    makeBoxCollider(x, y, w, h) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }
        return new Collider(this, x, y, w, h, "box");
    }
    /**
     * Creates a new Collider object representing a box collider.
     * @param {number} x - The x-coordinate of the collider's position.
     * @param {number} y - The y-coordinate of the collider's position.
     * @param {number} d - The diameter of the collider.
     * @returns {Collider} The newly created Collider object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    makeCircleCollider(x, y, d) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(d) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(d, "d has to be a number!")
            );
        }
        return new Collider(this, x, y, d, d, "circle");
    }
    /**
     *
     * @param {any} userDrawFunc
     * @param {any} canvas
     */
    use(userDrawFunc, canvas = document.getElementById("myCanvas")) {
        this.#userFuncs.draw = userDrawFunc;
        this.setupCanvas();

        //later change it so this is the only place canvas is acquired
        this.canvas = canvas;
        /**
         * @type {CanvasRenderingContext2D} context
         */
        // @ts-ignore
        this.context = this.canvas.getContext("2d");
    }

    /**
     * private_internal
     */
    getCollisionManager() {
        return this.#collisionManager;
    }
}

export const $ = new Pen();
/**
 * @type {Shape}
 */
export const shape = $.shape;
/**
 * @type {Colour}
 */
export const colour = $.colour;
/**
 * @type {Mouse}
 */
export const mouse = $.mouse;
/**
 * @type {Touch}
 */
export const touch = $.touch;

/**
 * @type {Keyboard}
 */
export const keys = $.keys;

/**
 * @type {Text}
 */
export const text = $.text;

// @ts-ignore
window.$ = $;
