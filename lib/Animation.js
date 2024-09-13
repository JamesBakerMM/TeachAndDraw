//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Pen } from "./Pen.js";
import { Stamp } from "./Img.js";

export class MovingStamp extends Stamp {
    #pen;
    #frames;
    #delay;
    #delayTimer;
    #currentFrame;
    #previousFrame;
    #looping;
    #playing;
    #type;
    constructor(pen, x, y, ...stamps) {
        if (stamps.length < 1) {
            throw new Error("Animation requires 1 or more stamps.");
        }
        super(pen, x, y, stamps[0]);
        this.#currentFrame = 0;
        this.#pen = pen;
        this.delay = 4;
        this.#delayTimer = 0;
        this.#looping = true;
        this.#playing = true;
        this.#currentFrame = 0;
        this.#previousFrame = 0;

        this.frames = [...stamps];
        this.#type = "animation";
        Object.seal(this);
    }
    clone(pen, x, y, asset) {
        const nuMovingStamp = new MovingStamp(pen,x,y,...asset);
        return nuMovingStamp;
    }
    _draw(x = this.x, y = this.y, rotation = this.rotation) {
        if (this.frames[this.#currentFrame].complete === false) {
            return;
        }
        const w = this.frames[this.#currentFrame].raw.width;
        //get the current frames width
        const h = this.frames[this.#currentFrame].raw.height;
        //get the current frames height

        const halfWidth = w / 2;
        const halfHeight = h / 2;

        if (rotation > 359) {
            rotation = 0;
        }

        this.#pen.state.save();

        let scaleX = 1;
        let scaleY = 1;

        if (this.flip.x) {
            scaleX = -1;
        }

        if (this.flip.y) {
            scaleY = -1;
        }

        if (this.#delayTimer < this.delay) {
            this.#delayTimer++;
        } else {
            this.#delayTimer = 0;
            this.progressFrame();
        }

        this.#pen.context.translate(x, y);
        this.#pen.context.scale(scaleX, scaleY);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(rotation));
        this.#pen.context.drawImage(
            this.frames[this.#currentFrame].raw,
            0 - halfWidth,
            0 - halfHeight,
            w,
            h
        );
        if (this.#pen.debug) {
            // Debug.drawImg(this.#pen, this);
        }
        this.#pen.state.load();
    }
    /**
     * Delay the animation by a specified amount of frames before playing.
     * @param {number} value - The delay in frames.
     * @returns {number} The delay before an animation starts (in frames).
     * @throws {Error} If the provided value is not a finite number.
     */
    set delay(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "The delay for this animation needs to be a number!"
                )
            );
        }
        this.#delay = value;
        return;
    }

    /**
     * Gets the delay before the animation starts.
     * @returns {number} The delay before an animation starts (in frames).
     */
    get delay() {
        return this.#delay;
    }

    /**
     * Gets the type of the animation.
     * @returns {string} The value of the type property (normally "animation").
     */
    get type() {
        return this.#type;
    }

    /**
     * Sets the current frame of the animation.
     * @param {number} value - The frame number to set.
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
        } else if (value > this.frames.length - 1) {
            console.warn(
                `Frame value too high (${value}), setting to final frame (${
                    this.frames.length - 1
                }).`
            );
            this.#currentFrame = this.frames.length - 1;
        } else {
            this.#currentFrame = value;
        }
        return;
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
     * @throws {Error} If the provided value is not a boolean.
     */
    set looping(value) {
        if ((typeof value === "boolean") === false) {
            throw Error(
                `looping needs to be given a boolean but you gave ${value}:${typeof value}`
            );
        }
        this.#looping = value;
        return;
    }

    /**
     * Gets the looping status of the animation.
     * @returns {boolean} The current looping status.
     */
    get looping() {
        return this.#looping;
    }

    /**
     * Sets the playing status of the animation.
     * @param {boolean} value - The desired playing status.
     * @throws {Error} If the provided value is not a boolean.
     */
    set playing(value) {
        if (typeof value === "boolean") {
            this.#playing = value;
            return;
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
     * Advances the animation to the next frame. If the current frame is the last frame
     * and the animation is set to loop, it resets to the first frame.
     *
     * @returns {number} The updated frame index after progression.
     */
    progressFrame() {
        const FINAL_FRAME_INDEX = this.frames.length - 1;
        if (this.#currentFrame < FINAL_FRAME_INDEX) {
            this.#currentFrame += 1;
        }
        if (this.#currentFrame === FINAL_FRAME_INDEX && this.#looping) {
            this.#currentFrame = 0;
        }
        return this.#currentFrame;
    }
}

/**
 * Currently a HEAVY WIP and not fully implemented. Idea is to create a class that can handle
 * the loading of multiple images and then display them in sequence to create an animation.
 * Please see https://github.com/JamesBakerMM/TeachAndDraw/issues/75 for more details.
 */
export class Animation extends Array {
    constructor(x, y, pen, ...imgs) {
        throw new Error("remove this if it sbeing used, we now use movingstamp");
    }
}
