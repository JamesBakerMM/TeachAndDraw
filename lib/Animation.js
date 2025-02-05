//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Stamp } from "./Img.js";
import { Offset } from "./Offset.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

export class MovingStamp extends Stamp {
    #tad;
    #frames;
    #duration; // Internally stored as milliseconds. User-facing set/get handles the value in seconds.
    #timer;
    #looping;
    #playing;
    #type;

    /**
     * 
     * @param {Tad} tad 
     * @param {number} x 
     * @param {number} y 
     * @param  {...Stamp} stamps 
     */
    constructor(tad, x, y, ...stamps) {
        if (stamps.length < 1) {
            throw new Error("Animation requires 1 or more stamps.");
        }
        super(tad, x, y, stamps[0].raw);
        this.#tad = tad;
        this.offset = new Offset(); // Inherited from Stamp
        this.#duration = (1000 / 30) * stamps.length; // Default 30 FPS
        this.#timer = 0;
        this.#looping = true;
        this.#playing = true;

        this.#frames = [...stamps];
        this.#type = "animation";
        Object.seal(this);
    }
    clone() {
        const nuMovingStamp = new MovingStamp(this.#tad, this.x, this.y, ...this.#frames);
        nuMovingStamp.#duration = this.#duration;
        nuMovingStamp.#timer    = this.#timer;
        nuMovingStamp.#looping  = this.#looping;
        nuMovingStamp.#playing  = this.#playing;
        nuMovingStamp.scale     = this.scale;
        nuMovingStamp.rotation  = this.rotation;
        nuMovingStamp.flip.x    = this.flip.x;
        nuMovingStamp.flip.y    = this.flip.y;
        return nuMovingStamp;
    }

    update() {
        super.update();
        this.#progressFrame();
    }

    _draw(x = this.x, y = this.y, rotation = this.rotation) {
        // if (this.playing == false) {
        //     return;
        // }

        let scaleX = this.scale / 100;
        let scaleY = this.scale / 100;

        if (this.flip.x) {
            scaleX *= -1;
        }

        if (this.flip.y) {
            scaleY *= -1;
        }

        this.#tad.state.save();
        this.#tad.context.translate(x, y);
        this.#tad.context.rotate(this.#tad.math.degreeToRadian(rotation % 360));
        this.#tad.context.translate(this.offset.x, this.offset.y);
        this.#tad.context.scale(scaleX, scaleY);

        const frame = this.#frames[this.frame];
        //@ts-expect-error
        this.#tad.context.drawImage(frame.raw, -frame.w/2, -frame.h/2, frame.w, frame.h);

        if (this.#tad.debug) {
            // Debug.drawImg(this.#pen, this);
        }
        this.#tad.state.load();
    }

    /**
     * Set the duration of the animation in seconds.
     * @param {number} value - The duration in seconds
     * @throws {Error} If the provided value is not a finite number or is less than zero.
     */
    set duration(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "The duration for this animation needs to be a number!"
                )
            );
        }

        if (value <= 0)
        {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "The duration for this animation must be greater than zero!"
                )
            );
        }

        this.#duration = 1000 * value;
    }

    /**
     * Gets the duration of the animation.
     * @returns {number} The duration of an animation (in seconds).
     */
    get duration() {
        return this.#duration / 1000;
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
        } else if (value > this.#frames.length - 1) {
            console.warn(
                `Frame value too high (${value}), setting to final frame (${
                    this.#frames.length - 1
                }).`
            );
        }

        // Clamp value to bounds (0, frames.length-1)
        value = Math.max(0, value);
        value = Math.min(value, this.#frames.length-1);

        // Compute the timer value needed to satisfy the given value
        this.#timer = this.#duration * (value / this.#frames.length);

        return;
    }

    /**
     * Gets the current frame of the animation.
     * @returns {number} The current frame number.
     */
    get frame() {
        let idx = Math.floor(this.#frames.length * (this.#timer / this.#duration));
        idx = Math.max(0, Math.min(idx, this.#frames.length-1));
        return idx;
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
     * Gets the array of images of the animation
     * @returns {Array<Stamp>} The image array.
     */
    get frames() {
        return this.#frames;
    }


    /**
     * Advances the animation timer. If the timer is greater than the animation duration
     * and the animation is not looping, playing will be set to false and the timer will
     * be set to 0.
     */
    #progressFrame() {
        if(!this.#playing) {
            return;
        }
        this.#timer += this.#tad.time.msElapsed;
    
        if (this.looping == false && this.#timer >= this.#duration) {
            this.#timer = 0;
            this.playing = false;
        }

        this.#timer %= this.#duration;
    }
}
