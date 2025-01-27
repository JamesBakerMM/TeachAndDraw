import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Flip } from "./Flip.js";
import { Debug } from "./Debug.js";
import { AssetJob } from "./AssetManager.js";
import { Id } from "./Id.js";
import { Tad } from "./TeachAndDraw.js";
import { Offset } from "./Offset.js";

/**
 * A class that represents an image on the canvas.
 */
// @ts-ignore
export class Img extends Image {
    static id = 0;

    /**
     * Creates an instance of Img.
     * @param {string} filepath
     * @param {AssetJob} job
     * @property {number} id - The unique id of the image.
     * @property {string} src - The file path of the image.
     * @property {Stamp[]} wrapper - The wrapper of the image.
     * @property {number} w - The width of the image.
     * @property {number} h - The height of the image.
     * @property {function} onload - The function that is called when the image is loaded.
     * @property {function} onerror - The function that is called when the image fails to load.
     * @constructor
     */
    constructor(filepath, job) {
        super();
        this.id = Id.getId();
        this.src = filepath;
        /**
         * @type {Stamp[]}
         */
        this.wrapper = [];
        //wrapper currently assigned in tad.loadImage will fix later

        this.onload = () => {
            for (let i = 0; i < this.wrapper.length; i++) {
                this.w = this.naturalWidth;
                this.h = this.naturalHeight;
                this.wrapper[i].w = this.naturalWidth;
                this.wrapper[i].h = this.naturalHeight;
            }
            job.finish();
            Object.freeze(this);
        };

        this.onerror = () => {
            const errorMessage = ErrorMsgManager.loadFileFailed(
                filepath,
                "img"
            );
            const error = new Error("Loading Image:" + errorMessage);
            job.error = error;
            console.error(error);
        };
    }
}

/**
 * A wrapper class for images, turning them in to entities.
 */
export class Stamp extends ShapedAssetEntity {
    #tad;
    #asset;
    /**
     * Creates an instance of Stamp.
     * @param {number} x - The x-coordinate of the image.
     * @param {number} y - The y-coordinate of the image.
     * @param {Img} img - The image object itself.
     * @param {Tad} tad - The tad object that draws the image.
     * @property {number} id - The unique id of the image wrapper.
     * @property {Img} asset - The image object itself.
     * @property {number} rotation - The rotation of the image.
     * @property {Flip} flip - The flip of the image.
     * @property {string} type - The type of the image.
     * @property {number} x - The x-coordinate of the image.
     * @property {number} y - The y-coordinate of the image.
     * @property {number} w - The width of the image.
     * @property {number} h - The height of the image.
     * @constructor
     */
    #type;
    #scale;
    offset;

    /**
     * 
     * @param {Tad} tad 
     * @param {number} x 
     * @param {number} y 
     * @param {Img} img 
     */
    constructor(tad, x, y, img) {
        //type checks are done in makeImage
        const w = 1;
        const h = 1;
        super(tad, x, y, w, h);
        this.id = Id.getId();
        this.#tad = tad;
        this.#asset = img;
        this.rotation = 0;
        this.#type = "image";
        this.#scale = 100;
        this.offset = new Offset();
        this.flip = new Flip(); //protect against accidental assignment and makes existing properties non configurable;
    }

    get raw(){
        return this.#asset;
    }

    get type(){
        return this.#type;
    }

    /**
     * Clones the image wrapper.
     * internal.
     * @returns {Stamp} A clone of the image wrapper.
     */
    clone() {
        const nuWrapper = new Stamp(this.#tad, this.x, this.y, this.#asset);

        nuWrapper.scale    = this.scale;
        nuWrapper.rotation = this.rotation;
        nuWrapper.flip.x   = this.flip.x;
        nuWrapper.flip.y   = this.flip.y;
        nuWrapper.w        = this.w;
        nuWrapper.h        = this.h;

        this.#asset.wrapper.push(nuWrapper);
        return nuWrapper;
    }

    /**
     * Sets the scale of the image.
     * @param {number} value - The scale of the image.
     * @throws {Error} If the value is not a number.
     */
    set scale(value){
        //number check stuff
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Direction must be a valid number."
                )
            );
        }
        if(value < 1){
            throw new Error(
                `Hey frien, scale must be 1 or greater!. You have set it as '${value}'`
            );
        }
        this.#scale = value;
    }

    /**
     * Returns the current scale of the image.
     * @returns {number} The scale of the image.
     */
    get scale(){
        return this.#scale
    }

    /**
     * Draws the image to the canvas.
     * @param {number} x - The x-coordinate of the image.
     * @param {number} y - The y-coordinate of the image.
     * @param {number} rotation - The rotation of the image.
     * private_internal
     */
    _draw(x = this.x, y = this.y, rotation = this.rotation) {
        //internal lib draw
        if (this.#asset.complete === false) {
            return;
        }

        const xOffset = this.w / 2  * (this.scale/100);
        const yOffset = this.h / 2  * (this.scale/100);

        if (rotation > 359) {
            rotation = 0;
        }

        this.#tad.state.save();


        let scaleX = this.scale / 100;
        let scaleY = this.scale / 100;

        if (this.flip.x) {
            scaleX *= -1;
        }

        if (this.flip.y) {
            scaleY *= -1;
        }

        this.#tad.context.translate(x, y);
        this.#tad.context.rotate(this.#tad.math.degreeToRadian(rotation));
        this.#tad.context.translate(this.offset.x, this.offset.y);
        this.#tad.context.scale(scaleX, scaleY);

        this.#tad.context.drawImage(
            // @ts-ignore
            this.#asset,
            0 - xOffset,
            0 - yOffset,
            this.w,
            this.h
        );
        if (this.#tad.debug) {
            // Debug.drawImg(this.#tad, this);
        }
        this.#tad.state.load();
    }

    update() {
        super.update();
        
    }

    /**
     * Draws the image to the canvas.
     */
    draw() {
        if (this.exists === false) {
            return;
        }

        const x = this.x;
        const y = this.y;
        const rotation = this.rotation;
        if (this.#asset.complete === false) {
            return;
        } 
        this._draw(x, y, rotation);
    }
}
