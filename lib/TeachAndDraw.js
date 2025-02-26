import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { ClipBoard } from "./Clipboard.js";
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

import { PerformanceMetrics } from "./PerformanceMetrics.js";
import { TimeManager } from "./TimeManager.js";

//entities
import { Img, Stamp } from "./Img.js";
import { Button } from "./Button.js";

//data structures
import { Entity } from "./Entity.js";
import { Point } from "./Point.js";
import { Group, makeGroup } from "./Group.js";
import { MovingStamp } from "./Animation.js";

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
import { Checkbox } from "./Checkbox.js";
import { Slider } from "./Slider.js";
import { Dropdown } from "./Dropdown.js";
import { FontFileAsset } from "./FontFileAsset.js";
import { TextArea } from "./TextArea.js";

import { storage } from "./Storage.js";

/**
 * @class Tad
 */
export class Tad {
    /**
     * @type {boolean}
     */
    static debug = false;

    #assets;
    #collisionManager;
    #userFuncs;
    #isTabActive;
    #paused;
    /**
     * @type {number[]}
     */
    #frameTimes;
    /**
     * @type {string} - Any overall css styling needing to be added. Don't overwrite, add on to the property.
     */
    #overallStyle;

    constructor(
        //launch static checker eventually.
        draw = () => {
            console.warn("no user made function for draw given!");
        }
    ) {
        /**
         * @type {HTMLCanvasElement | undefined}
         */
        this.canvas =  /** @type {HTMLCanvasElement | null} */ (
            document.getElementById("myCanvas")
        );
        if(!this.canvas){
            throw new Error("no canvas found with id of myCanvas in the html!");
        }
        // @ts-ignore
        this.context = this.canvas.getContext("2d");
        this.width = 800;
        this.height = 600;
        this.storage = storage;


        this.dialog = /** @type {HTMLDialogElement} */ (document.querySelector("#tad_dialog"));
        if (!this.dialog) {
            const nuDialog = document.createElement("dialog");
            nuDialog.id = "tad_dialog";
            console.warn("dialog missing! creating dialog!");
            const body = document.querySelector("body");
            if(body) {
                body.appendChild(nuDialog)
            }
            this.dialog = nuDialog;
        }

        this.debug_aside = document.querySelector("#debug");
        if (!this.debug_aside) {
            const nuDebugAside = document.createElement("aside");
            nuDebugAside.id = "debug";
            console.warn("debug panel missing! creating debug panel!");
            const body = document.querySelector("body");
            if(body) {
                body.appendChild(nuDebugAside);
            }
            this.debug_aside = nuDebugAside;
        }
        //instruction set
        this.math = new Maffs(this);
        this.colour = new Colour(this);
        this.shape = new Shape(this);
        this.text = new Text(this);
        this.clipboard = new ClipBoard();
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
        this.#collisionManager = new CollisionManager(this);

        this.performanceMetrics = new PerformanceMetrics(this);

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

        this.#overallStyle = "";
    }

    /**
     * private_internal
     */
    drawCanvas() {
        if (!this.#isTabActive || this.#paused) {
            if (!this.dialog.querySelector("#unpause")) {
                const btn = document.createElement("button");
                btn.innerText = "Unpause";
                btn.id = "unpause";
                btn.addEventListener("click", () => {
                    this.dialog.close();
                    this.#paused = false;
                });
                this.dialog.innerHTML = "";
                this.dialog.appendChild(btn);
            }
            // if (!this.dialog.open) {
            //     this.dialog.showModal();
            // }
            window.requestAnimationFrame(() => {
                this.drawCanvas();
            });
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

                this.performanceMetrics.update();
            }

            this.clearCanvas();
            if (this.#assets.isLoaded() === false) {
                this.#assets.drawLoadingScreen();
            } else {
                this.upkeep();

                try {
                    this.#userFuncs.draw();
                } catch (error) {
                    this.#handleError(error);
                }

                //JAMES PLZ FIX INTO DOWNKEEP
                this.downkeep();
            }
        }

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    
    upkeep() {
        this.time.update();
        this.state.reset();

        // Update all entities
        for (const entity of Entity.all) {
            if (entity.exists) {
                entity.update();
            }
        }
    }

    downkeep() {  // Delete removed entities
        for (let i = 0; i < Entity.all.length; i++) {
            if (Entity.all[i].exists === false) {
                delete Entity.all[i];
                Entity.all.splice(i, 1);
                i -= 1;
            }
        }

        if (Collider.all != undefined) {
            for (let i = 0; i < Collider.all.length; i++) {
                Collider.all[i].overlays = new Set();
                Collider.all[i].collisions = new Set();
            }
        }

        if (this.debug) {
            Debug.constructInfoPane(this);
            Debug.drawTad(this);
        }

        this.keys.draw();
        this.mouse.draw();
        this.touch.draw();

        for (const entity of Entity.all) {
            if (entity.exists) {
                entity.move();
                entity.moveX();
            }
        }
        this.#collisionManager.handleCollisions();

        for (const entity of Entity.all) {
            if (entity.exists) {
                entity.moveY();
            }
        }
        this.#collisionManager.handleCollisions();
        if(Collider.all !== undefined && Collider.all !== null) {
            for (const collider of Collider.all) {
                if (collider.exists) {
                    if (collider.collisions.size > 0) {
                        let bounce = (collider.bounciness/100);
                        collider.velocity.x = collider.velocity.x * bounce;
                        collider.velocity.y = collider.velocity.y * bounce;
                    }
                }
            }
        }

        this.#collisionManager.finishCollisions();

        this.camera.draw();
        Group.cleanup();
    }

    /**
     * private_internal
     */
    get stroke() {
        throw new Error("You probably wanted $.colour.stroke not $.stroke :)");
    }

    /**
     * private_internal
     */
    get fill() {
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
        let prevVal = Tad.debug;
        // @ts-ignore
        Tad.debug = value;
        if (Tad.debug && prevVal === false) {
            //went from false to true!
            Debug.applyDebugGrid(this);
        }
        if (Tad.debug === false && prevVal) {
            //went from true to false
            Debug.removeDebugGrid(this);
        }
    }
    get debug() {
        // @ts-ignore
        return Tad.debug;
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
     * @returns {MovingStamp} The newly created Animation object.
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
            images.push(this.loadImage(x, y, path));
        }
        const newAnim = new MovingStamp(this, x, y, ...images);
        return newAnim;
    }

    /**
     * Loads an image from a given file path, wraps it in an Stamp object, and returns the wrapper.
     * This method checks if the image has already been loaded to avoid duplication.
     * If the image is new, it creates a new AssetJob for loading and tracking the image's loading state.
     *
     * @param {number} x - The x-coordinate where the image will be positioned upon rendering.
     * @param {number} y - The y-coordinate where the image will be positioned upon rendering.
     * @param {string} filepath - The file path of the image to be loaded.
     * @returns {Stamp} The Stamp object containing the loaded image.
     * @throws {Error} If x or y are not finite numbers, indicating incorrect positioning parameters.
     * @throws {Error} If the filepath argument is not a string, indicating an invalid file path.
     */

    loadImage(x, y, filepath) {
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
                const nuStamp = new Stamp(this, x, y, file.asset);
                // @ts-ignore
                file.asset.wrapper.push(nuStamp);
                return nuStamp;
            }
        }

        const job = new AssetJob(filepath);
        const img = new Img(filepath, job);
        const nuStamp = new Stamp(this, x, y, img);
        img.wrapper.push(nuStamp);
        // @ts-ignore
        job.asset = img;
        this.#assets.jobs.push(job);

        return nuStamp;
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
     * Used to load a custom font for use in the program. Must be file type ttf, otf, woff or woff2.
     * If the custom font doesn't work, you will see symbols (Webdings) instead of your font, or an error.
     * @param {string} name - The desired name for the font. Try to use the official font name (case sensitive)
     * @param {string} filepath - The local filepath to the font file.
     * @returns {string} - The name of the font, given successful.
     */
    loadCustomFont(name, filepath) {
        if (typeof name !== "string") {
            throw new Error(
                `Name is not a string! You gave: ${name}|${typeof name}.`
            );
        }
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }

        //Check whether file path is local
        const filepathStart = filepath.split(":")[0];
        if (filepathStart === "http" || filepathStart === "https") {
            throw new Error(
                `Filepaths given for custom fonts must be local filepaths that lead to files you have downloaded and added into your` +
                `folder structure. You gave ${filepath}, which is trying to access an online resource.`
            )
        }

        // Check whether a common font type is being overwritten
        const commonFonts = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"];
        if (commonFonts.includes(name)) {
            throw new Error(
                `${name} cannot be used as a custom font name, as it is already the name of a common web font. ` +
                `Either change the name, or if you're trying to use the common font called ${name}, then you don't ` +
                `need to load the font.`
            )
        }

        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                return name;
            }
        }

        // Check that file exists and can be loaded with no errors
        const job = new AssetJob(filepath);
        const font = new FontFileAsset(filepath, job);
        job.asset = font;
        this.#assets.jobs.push(job);

        // All checks passed, so add to font
        const newStyle = `
            @font-face {
                font-family: "${name}";
                src:
                    local("${name}"),
                    url("${filepath}")
            }

        `;
        this.#overallStyle += newStyle;
        this.#updateStylesheet();

        this.text._addCustomFont(name);
        return name;
    }
    /**
     * Used to update the stylesheet attached to head in html with the current overallStyle text.
     */
    #updateStylesheet(){
        const styleSheet = document.createElement("style");
        styleSheet.textContent = this.#overallStyle;
        document.head.appendChild(styleSheet);
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
        //set up the entity all group done here due to hoisting issues
        // @ts-ignore
        if (!Entity.all) {
            Entity.all = makeGroup(this);
            Entity.all.name = "Entity.all";
        }
        // @ts-ignore

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
        if(Collider.all){
            for (let i = 0; i < Collider.all.length; i++) {
                Collider.all[i].draw();
            }
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
     * 
     * @param {Error} error 
     */
    #handleError( error ) {
        if (error instanceof EvalError) {
            console.error(`Caught EvalError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof RangeError) {
            console.error(`Caught RangeError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof ReferenceError) {
            console.error(`Caught ReferenceError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof SyntaxError) {
            console.error(`Caught SyntaxError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof TypeError) {
            console.error(`Caught TypeError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof URIError) {
            console.error(`Caught URIError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof AggregateError) {
            console.error(`Caught AggregateError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else if (error instanceof TypeError) {
            console.error(`Caught TypeError\nName: "${error.name}"\nMessage: "${error.message}"`);
        } else {
            // throw new Error(error);
        }
        throw error
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
    makeButton(x, y, w, h, label) {
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

        if (label === undefined || typeof label !== "string") {
            throw Error(
                `You need to give a string for the label.\n` +
                    `You gave: ${label}:${typeof label}`
            );
        }
        return new Button(x, y, w, h, label, this);
    }
    /**
     * Creates a new Checkbox object for use in canvas.
     * @example
     * const checkbox = $.makeCheckbox(100, 200, 30);
     * checkbox.draw();
     * @param {number} x - The x-coordinate of the checkbox's position.
     * @param {number} y - The y-coordinate of the checkbox's position.
     * @param {number} w - The width of the checkbox.
     * @param {number} [h = w] - The height of the checkbox [optional]. Default is same as w.
     * @returns {Checkbox} The newly created Checkbox object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    makeCheckbox(x, y, w, h = w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
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
        return new Checkbox(x, y, w, h, this);
    }
    /**
     * Creates a new Slider object for use in canvas.
     * @example
     * const slider = $.makeSlider(100, 200, 30); //x, y, w
     * slider.draw();
     * @param {number} x - The x-coordinate of the slider's position.
     * @param {number} y - The y-coordinate of the slider's position.
     * @param {number} w - The width of the slider.
     * @returns {Slider} The newly created Slider object.
     * @throws {Error} If x, y, and w are not finite numbers.
     */
    makeSlider(x, y, w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        return new Slider(x, y, w, this);
    }
    /**
     * Creates a new Dropdown object.
     * @example
     * const dropdown = $.makeDropdown(200, 100, 100, ["Option 1", "Option 2", "Option 3"]);
     * dropdown.draw();
     * @param {number} x - The x-coordinate of the dropdown's position.
     * @param {number} y - The y-coordinate of the dropdown's position.
     * @param {number} w - The width of the dropdown.
     * @param {string[]} options - The list of options contained in the dropdown. Must be strings.
     * @returns {Dropdown} The newly created Dropdown object.
     * @throws {Error} If x, y, and w are not finite numbers or if options is not an array of strings.
     */
    makeDropdown(x, y, w, options) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        Dropdown.checkOptionsConditions(options);
        return new Dropdown(this, x, y, w, options);
    }
    /**
     * Creates a new TextArea object.
     * @example
     * const textArea = $.makeTextArea(400, 200, 300, 150);
     * textArea.draw();
     * @param {number} x - The x-coordinate of the text area's position.
     * @param {number} y - The y-coordinate of the text area's position.
     * @param {number} w - The width of the text area.
     * @returns {TextArea} The newly created TextArea object.
     * @throws {Error} If x, y, w, are not finite numbers.
     */
    makeTextArea(x, y, w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }

        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        return new TextArea(this, x, y, w);
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

export const $ = new Tad();
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