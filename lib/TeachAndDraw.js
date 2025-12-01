import { Shape } from "./Shape.js";
import { Colour } from "./Colour.js";
import { Text } from "./Text.js";
import { ClipBoard } from "./Clipboard.js";
import { Maffs } from "./maffs.js";
import { Mouse } from "./Mouse.js";
import { Touch } from "./Touch.js";
import { Keyboard } from "./Keyboard.js";
import { Debug } from "./Debug.js";
import { Gui } from "./Gui.js";
import { Sound } from "./Sound.js";

import { Video } from "./Video.js";

import { PerformanceMetrics } from "./PerformanceMetrics.js";
import { TimeManager } from "./TimeManager.js";

import { Make } from "./Make.js";
import { Load } from "./Load.js";

//data structures
import { Entity } from "./Entity.js";
import { Group, makeGroup } from "./Group.js";
import { MovingStamp } from "./Animation.js";

//game stuff
import { Collider } from "./Collider.js";
import { CollisionManager } from "./CollisionManager.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

import { DrawStateManager } from "./DrawStateManager.js";

import { _storage } from "./Storage.js";
import { Camera } from "./Camera.js";

/**
 * @class Tad
 */
export class Tad {
    /**
     * @type {boolean}
     */
    static debug = false;

    #collisionManager;
    /** @type {{update:(function|null)}} */
    #userFuncs = { update: null };
    #isTabActive;
    #muteButton;
    #paused;
    /** @type {number[]} */
    #frameTimes;

    camera = new Camera(this);

    constructor(
        //launch static checker eventually.
        draw = () => {
            console.warn("no user made function for draw given!");
        }
    ) {
        /**
         * @type {HTMLCanvasElement | undefined}
         */
        this.canvas = /** @type {HTMLCanvasElement | null} */ (
            document.getElementById("myCanvas")
        );
        // @ts-ignore
        if (this.canvas) {
            this.context = this.canvas.getContext("2d");
        }
        this.width = 800;
        this.height = 600;
        this.storage = _storage;

        this.dialog = /** @type {HTMLDialogElement} */ (
            document.querySelector("#tad_dialog")
        );
        if (!this.dialog) {
            const nuDialog = document.createElement("dialog");
            nuDialog.id = "tad_dialog";
            console.warn("dialog missing! creating dialog!");
            const body = document.querySelector("body");
            if (body) {
                body.appendChild(nuDialog);
            }
            this.dialog = nuDialog;
        }

        this.debug_aside = document.querySelector("#debug");
        if (!this.debug_aside) {
            const nuDebugAside = document.createElement("aside");
            nuDebugAside.id = "debug";
            console.warn("debug panel missing! creating debug panel!");
            const body = document.querySelector("body");
            if (body) {
                body.appendChild(nuDebugAside);
            }
            this.debug_aside = nuDebugAside;
        }
        this.make = new Make(this);
        this.load = new Load(this);
        //instruction set
        this.math = new Maffs(this);
        /** @hidden */
        this.colour = new Colour(this);
        this.shape = new Shape(this);
        this.text = new Text(this);
        this.clipboard = new ClipBoard();
        this.mouse = new Mouse(this);
        this.touch = new Touch(this);
        this.keys = new Keyboard(this);
        // this.camera = new Camera(this);

        this.gui = new Gui(this);
        this.sound = new Sound(this);

        //internal state managers
        this.state = new DrawStateManager(this);

        //physics
        this.#collisionManager = new CollisionManager(this);

        this.performanceMetrics = new PerformanceMetrics(this);

        this.time = new TimeManager();
        //fps controls
        this.averageFps = 0; // Stores the average frames per second.

        this.#frameTimes = []; // Stores the timestamps of the last N frames.
        this.lastFrameTimestamp = window.performance.now();

        this.#muteButton = this.make.button(0, 0, 100, 100, "");
        this.#paused = false;

        //collections
        this.#userFuncs = {
            update: draw,
        };

        this.#isTabActive = true;

        //tunnelling code
        this.fractionOfMovement = 0.1;
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
            // @ts-expect-error
            if (this.load._jobsDone === false) {
                // @ts-expect-error
                this.load.drawLoadingScreen();
            } else {
                this.upkeep();

                try {
                    this.#userFuncs.update();

                    //@ts-expect-error
                    if (this.load.soundsLoaded > 0) {
                        this.sound.draw();
                    }
                } catch (error) {
                    this.#handleError(error);
                }

                this.downkeep();
            }
        }

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }

    /**
     * Called before the user function every frame. Responsible for resetting the {@link DrawStateManager} as well updating the {@link TimeManager} and every entities update method.
     *
     */
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

    /**
     * Runs after the user function every frame.
     */
    downkeep() {
        // Delete removed entities
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

        //move all non-colliders
        for (const entity of Entity.all) {
            if (entity.exists && !(entity instanceof Collider)) {
                entity.move();
                entity.moveX();
                entity.moveY();
            }
        }
        if (!Collider.all) {
            //this is for circumvention of hoisting order issue
            Collider.all = makeGroup(this);
            Collider.all.name = "Collider.all";
        }
        this.#collisionManager.startCollisions();
        //for now, do rotations normally
        for (const collider of Collider.all) {
            if (collider.exists) {
                collider.move();
            }
        }

        for (const collider of Collider.all) {
            if (collider.exists) {
                collider.moveX();
            }
        }

        this.#collisionManager.handleCollisions();
        for (const collider of Collider.all) {
            if (collider.exists) {
                if (collider.collisions.size > 0) {
                    if (collider.exists && collider.collisions.size > 0 && collider.exists && collider.collisionShape != null) {
                        collider.x += collider.collisionShape.newX;
                        collider.y += collider.collisionShape.newY;
                        collider.velocity.x += collider.collisionShape.newVelocityX;
                        collider.velocity.y += collider.collisionShape.newVelocityY;
                        collider.rotationalVelocity += collider.collisionShape.newVelocityRot;
                        collider.collisionShape.newX = 0;
                        collider.collisionShape.newY = 0;
                        collider.collisionShape.newVelocityX = 0;
                        collider.collisionShape.newVelocityY = 0;
                        collider.collisionShape.newVelocityRot = 0;
                    }
                }
            }
        }
        for (const collider of Collider.all) {
            if (collider.exists) {
                collider.moveY();
            }
        }

        this.#collisionManager.handleCollisions();
        for (const collider of Collider.all) {
            if (collider.exists) {
                if (collider.collisions.size > 0) {
                    if (collider.exists && collider.collisionShape != null) {
                        collider.x += collider.collisionShape.newX;
                        collider.y += collider.collisionShape.newY;
                        collider.velocity.x += collider.collisionShape.newVelocityX;
                        collider.velocity.y += collider.collisionShape.newVelocityY;
                        collider.rotationalVelocity += collider.collisionShape.newVelocityRot;
                        collider.collisionShape.newX = 0;
                        collider.collisionShape.newY = 0;
                        collider.collisionShape.newVelocityX = 0;
                        collider.collisionShape.newVelocityY = 0;
                        collider.collisionShape.newVelocityRot = 0;
                    }
                }
            }
        }

        this.#collisionManager.finishCollisions();

        this.camera.draw();
        Group.cleanup();
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
     * @param {boolean} value
     */
    set debug(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                `.debug can only be set to a boolean value you gave ${value}:${typeof value}`
            );
        }
        let prevVal = Tad.debug;
        Tad.debug = value;
        if (Tad.debug && prevVal === false) {
            Debug.applyDebugGrid(this);
        }
        if (Tad.debug === false && prevVal) {
            Debug.removeDebugGrid(this);
        }
    }
    get debug() {
        return Tad.debug;
    }
    /**
     * Sets and returns the width of the canvas
     * @param {number} value
     */
    set w(value) {
        this.width = value;
    }
    get w() {
        return this.width;
    }
    /**
     * Sets and returns the height of the canvas
     * @param {number} value
     */
    set h(value) {
        this.height = value;
    }
    get h() {
        return this.height;
    }

    /**
     * Sets and returns the width of the canvas
     * @param {number} value
     */
    set width(value) {
        this.canvas.width = value;
        this.camera.x = value / 2;
    }
    get width() {
        return this.canvas.width;
    }
    /**
     * Sets and returns the height of the canvas
     * @param {number} value
     */
    set height(value) {
        this.canvas.height = value;
        this.camera.y = value / 2;
    }
    get height() {
        return this.canvas.height;
    }

    /**
     * Replaced with time.frames
     * @deprecated
     * @private
     */
    get frameCount() {
        return this.time.frames;
    }
    /**
     * Replaced with time.fps
     * @deprecated
     * @private
     */
    set fps(value) {
        this.time.fps = value;
    }

    /**
     * Replaced with time.fps
     * @deprecated
     * @private
     */
    get fps() {
        return this.time.fps;
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
    //set up the entity all group done here due to hoisting issues
    setupCanvas() {
        if (!Entity.all) {
            Entity.all = this.make.group(this);
            Entity.all.name = "Entity.all";
        }

        this.setupTabSwitchListener();

        window.requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }

    /** @private */
    clearCanvas() {
        // @ts-ignore
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * * quality of life method to draw all entities.
     * private_internal
     * @private
     */
    drawEntities() {
        for (let entity of Entity.all) {
            entity.draw();
        }
    }

    /**
     * quality of life method to draw all colliders.
     * private_internal
     * @private
     */
    drawColliders() {
        if (Collider.all) {
            for (let i = 0; i < Collider.all.length; i++) {
                Collider.all[i].draw();
            }
        }
    }
    /**
     *
     * @param {Array<Number>} array
     * private_internal
     * @returns
     */
    #calculateAverage(array) {
        let sum = 0;
        if (array.length === 0) {
            //prevent NaN
            return 0;
        }
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length;
    }

    /**
     * This method eventually will supplement commonly found error types with educational videos from {@link Video} about what an error could mean.
     * It should ideally check if the error message already mentions a video so we don't double up and supply too many videos.
     * @param {Error} error
     */
    #handleError(error) {
        if (error instanceof EvalError) {
            console.error(
                "We really do not recommend you use eval for any reason. 'Eval is Evil' is a old school saying in the js community for a reason :)"
            );
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
        } else if (error instanceof RangeError) {
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
        } else if (error instanceof ReferenceError) {
            const handler = ErrorMsgManager.handleTadReferenceError(error);
            if (handler.isTad) {
                error.message = handler.message;
                error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
                throw error;
            }
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
            // console.error(
            //     `Caught ReferenceError\nName: "${error.name}"\nMessage: "${error.message}"`
            // );
        } else if (error instanceof SyntaxError) {
            throw error;
        } else if (error instanceof TypeError) {
            const handler = ErrorMsgManager.handleTadTypeError(error);
            if (handler.isTad) {
                error.message = handler.message;

                error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
                throw error;
            }
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
        } else if (error instanceof URIError) {
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
        } else if (error instanceof AggregateError) {
            error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
            throw error;
        } else {
            //check if the error is a uniquely tad specific error
            // throw new Error(error);
        }
        error.stack = ErrorMsgManager.cleanErrorStack(error.stack);
        throw error;
    }
    /**
     *
     * @param {Function} updateFunction
     * @param {any} canvas
     */
    use(updateFunction, canvas = document.getElementById("myCanvas")) {
        this.#userFuncs.update = updateFunction;
        this.setupCanvas();

        //later change it so this is the only place canvas is acquired
        this.canvas = canvas;

        if (!this.canvas) {
            throw new Error("no canvas found with id of myCanvas in the html!");
        }
        /** @type {CanvasRenderingContext2D} context */
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

export const shape = $.shape;

export const mouse = $.mouse;

export const math = $.math;

export const load = $.load;

export const touch = $.touch;

export const keys = $.keys;

export const text = $.text;

export const make = $.make;

export const camera = $.camera;

export const time = $.time;

export const storage = $.storage;

export const state = $.state;

// @ts-ignore
window.$ = $;
export const tad = $;
