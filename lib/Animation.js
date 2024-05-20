//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class Animation extends Array {
    #pen;
    #delay;
    #delayTimer;
    #currentFrame;
    #previousFrame;
    #rotation;
    #looping;
    #playing;
    #x;
    #y;
    // #h;
    // #w;
    #type;

    /**
     * Creates an instance of Animation.
     * @param {number} x - The initial x-coordinate for the animation.
     * @param {number} y - The initial y-coordinate for the animation.
     * @param {object} pen - The drawing tool used for rendering the animation.
     * @param {...object} imgs - An array of image objects for the animation frames.
     * @throws {Error} If no images are provided.
     */
    constructor(x, y, pen, ...imgs) {
        //type check for animation are conducted in makeAnimation
        super(...imgs);
        this.#pen = pen;

        this.#x = x;
        this.#y = y;

        this.#rotation=0;

        //frame control flags
        this.#looping = true;
        this.#playing = true;
        this.#currentFrame = 0;
        this.#previousFrame = 0;

        //delay
        this.#delay = 4;
        this.#delayTimer = 0;

        this.#type="animation";
    }
    set delay(value){
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value,"The delay for this animation needs to be a number!"));
        }
        this.#delay=value;
        return this.#delay
    }
    get delay(){
        return this.#delay
    }

    get type(){
        return this.#type
    }
    /**
     * Draws the current frame of the animation.
     * @returns {boolean} The playing status of the animation.
     */
    draw(x=this.x,y=this.y,rotation=this.rotation) {

        if (this.#playing === false) {
            //pass x,y and rotation
            this[this.frame].draw(x,y,rotation);
            return this.#playing;
        }
        if (this.#delayTimer < this.delay) {
            this.#delayTimer++;
        } else {
            this.#delayTimer = 0;
            this.progressFrame();
        }
        this[this.frame].draw(x,y,rotation);
        return this.#playing;
    }
    /**
     * Advances the animation to the next frame. If the current frame is the last frame
     * and the animation is set to loop, it resets to the first frame.
     *
     * @returns {number} The updated frame index after progression.
     */
    progressFrame() {
        const FINAL_FRAME_INDEX = this.length - 1;
        if (this.#currentFrame < FINAL_FRAME_INDEX) {
            this.#currentFrame += 1;
        }
        if (this.#currentFrame === FINAL_FRAME_INDEX && this.#looping) {
            this.#currentFrame = 0;
        }
        return this.#currentFrame;
    }
    /**
     * Sets the current frame of the animation.
     * @param {number} value - The frame number to set.
     * @returns {number} The updated frame number.
     * @throws {Error} If the provided value is not a finite number.
     */
    set frame(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                `Frame needs to be a number but you gave ${value}:${typeof value}`
            );
        }
        if (value < 0) {
            console.warn(
                `Frame value too low (${value}), setting to firstFrame (0).`
            );
            this.#currentFrame = 0;
        } else if (value > this.length - 1) {
            console.warn(
                `Frame value too high (${value}), setting to final frame (${
                    this.length - 1
                }).`
            );
            this.#currentFrame = this.length - 1;
        } else {
            this.#currentFrame = value;
        }
        return this.#currentFrame;
    }

    /**
     * Gets the current frame of the animation.
     * @returns {number} The current frame number.
     */
    get frame() {
        return this.#currentFrame;
    }

    /**
     * Sets whether the animation should loop.
     * @param {boolean} value - The looping status.
     * @returns {boolean} The updated looping status.
     * @throws {Error} If the provided value is not a boolean.
     */
    set looping(value) {
        if ((typeof value === "boolean") === false) {
            throw Error(
                `looping needs to be given a boolean but you gave ${value}:${typeof value}`
            );
        }
        this.#looping = value;
        return this.#looping;
    }
    /**
     * Gets the looping status of the animation.
     * @returns {boolean} The current looping status.
     */
    get looping() {
        return this.#looping;
    }

    /**
     * Sets the x-coordinate for the animation.
     * @param {number} value - The x-coordinate.
     * @returns {number} The updated x-coordinate.
     * @throws {Error} If the provided value is not a finite number.
     */
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x needs to be a number but you gave ${value}:${typeof value}`
            );
        }
        for (let img of this) {
            img.x = value;
        }
        this.#x = value;
        return this.#x;
    }
    /**
     * Gets the x-coordinate of the animation.
     * @returns {number} The current x-coordinate.
     */
    get x() {
        return this.#x;
    }

    /**
     * Sets the y-coordinate for the animation.
     * @param {number} value - The y-coordinate.
     * @returns {number} The updated y-coordinate.
     * @throws {Error} If the provided value is not a finite number.
     */
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `y needs to be a number but you gave ${value}:${typeof value}`
            );
        }
        for (let img of this) {
            img.y = value;
        }
        this.#y = value;
        return this.#y;
    }
    /**
     * Gets the y-coordinate of the animation.
     * @returns {number} The current y-coordinate.
     */
    get y() {
        return this.#y;
    }

    /**
     * Sets the playing status of the animation.
     * @param {boolean} value - The desired playing status.
     * @returns {boolean} The updated playing status.
     * @throws {Error} If the provided value is not a boolean.
     */
    set playing(value) {
        if (typeof value === "boolean") {
            this.#playing = value;
            return this.#playing;
        }
        throw Error(
            `playing needs to be given a boolean but you gave ${value}:${typeof value}`
        );
    }

    /**
     * Gets the playing status of the animation.
     * @returns {boolean} The current playing status.
     */
    get playing() {
        return this.#playing;
    }
    /**
     * Sets the rotation of the animation in degrees.
     * @param {number} value - The rotation angle.
     * @throws {Error} If the value is not a finite number.
     */
    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `rotation needs to be a number but you gave ${value}:${typeof value}`
            );
        }
        this.#rotation = value;
        for (let item of this) {
            item.rotation = this.#rotation;
        }
        return this.#rotation;
    }

    /**
     * Gets the rotation of the animation.
     * @returns {number} The current rotation.
     */
    get rotation() {
        return this.#rotation;
    }

}