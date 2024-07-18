import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Flip } from "./Flip.js";
import { Debug } from "./Debug.js";
import {AssetJob} from "./AssetManager.js";
import { Pen } from "./Pen.js";

export class Img extends Image {
    static id = 0;
    static getId() {
        Img.id += 1;
        return Img.id;
    }
    /**
     * 
     * @param {string} filepath 
     * @param {AssetJob} job 
     */
    constructor(filepath, job) {
        super();
        this.id = Img.getId();
        this.src = filepath;
        /**
         * @type {ImgWrapper[]}
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

export class ImgWrapper extends ShapedAssetEntity {
    static id = 0;
    static getId() {
        ImgWrapper.id += 1;
        return ImgWrapper.id;
    }
    #pen;
    #asset;
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Img} img 
     * @param {Pen} pen 
     */
    constructor(x, y, img, pen) {
        //type checks are done in makeImage
        const w = 1;
        const h = 1;
        super(pen, x, y, w, h);
        this.id = ImgWrapper.getId();
        this.#pen = pen;
        this.#asset = img;
        this.rotation = 0;
        this.type = "image";
        this.flip = new Flip();
        Object.seal(this); //protect against accidental assignment and makes existing properties non configurable;
    }
    clone() {
        const nuWrapper = new ImgWrapper(this.x, this.y, this.#asset, this.#pen);
        this.#asset.wrapper.push(nuWrapper);
        return nuWrapper;
    }
    _draw(x = this.x, y = this.y, rotation = this.rotation){ //internal lib draw
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
    draw() {
        const x = this.x; 
        const y = this.y;
        const rotation = this.rotation
        if (this.#asset.complete === false) {
            return;
        }
        this._draw(x,y,rotation)
    }
}
