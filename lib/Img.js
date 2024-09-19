import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Flip } from "./Flip.js";
import { Debug } from "./Debug.js";
import { AssetJob } from "./AssetManager.js";
import { Id } from "./Id.js";
import { Pen } from "./Pen.js";

/**
 * A class that represents an image on the canvas.
 */
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
        //wrapper currently assigned in pen.loadImage will fix later

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
    #pen;
    #asset;
    /**
     * Creates an instance of Stamp.
     * @param {number} x - The x-coordinate of the image.
     * @param {number} y - The y-coordinate of the image.
     * @param {Img} img - The image object itself.
     * @param {Pen} pen - The pen object that draws the image.
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
    #type
    constructor(pen, x, y, img) {
        // if(pen !== Pen){
        //     throw new Error(`NOT A PEN,${pen},${x},${y},${img}`);
        // }
        //type checks are done in makeImage
        const w = 1;
        const h = 1;
        super(pen, x, y, w, h);
        this.id = Id.getId();
        this.#pen = pen;
        this.#asset = img;
        this.rotation = 0;
        this.#type = "image";
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
     * @returns {Stamp} A clone of the image wrapper.
     */
    clone() {
        const nuWrapper = new Stamp(
            this.#pen,
            this.x,
            this.y,
            this.#asset
        );
        this.#asset.wrapper.push(nuWrapper);
        return nuWrapper;
    }

    /**
     * Draws the image to the canvas.
     * @param {number} x - The x-coordinate of the image.
     * @param {number} y - The y-coordinate of the image.
     * @param {number} rotation - The rotation of the image.
     * @private
     */
    _draw(x = this.x, y = this.y, rotation = this.rotation) {
        //internal lib draw
        if (this.#asset.complete === false) {
            return;
        }

        const halfWidth = this.w / 2;
        const halfHeight = this.h / 2;

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
        this.#pen.context.translate(x, y);
        this.#pen.context.scale(scaleX, scaleY);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(rotation));
        this.#pen.context.drawImage(
            this.#asset,
            0 - halfWidth,
            0 - halfHeight,
            this.w,
            this.h
        );
        if (this.#pen.debug) {
            // Debug.drawImg(this.#pen, this);
        }
        this.#pen.state.load();
    }

    /**
     * Draws the image to the canvas.
     */
    draw() {
        const x = this.x;
        const y = this.y;
        const rotation = this.rotation;
        if (this.#asset.complete === false) {
            return;
        }
        this._draw(x, y, rotation);
    }
}
