import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Debug } from "./Debug.js";

export class Img extends Image {
    static id = 0;
    static getId() {
        Img.id += 1;
        return Img.id;
    }
    constructor(filepath, job) {
        super();
        this.id = Img.getId();
        this.src = filepath;
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
    asset;
    constructor(x, y, img, pen) {
        //type checks are done in makeImage
        const w = 1;
        const h = 1;
        super(pen, x, y, w, h);
        this.id = ImgWrapper.getId();
        this.#pen = pen;
        this.asset = img;
        this.rotation = 0;
        this.type = "image";
        Object.seal(this); //protect against accidental assignment and makes existing properties non configurable;
    }
    clone() {
        const nuWrapper = new ImgWrapper(this.x, this.y, this.asset, this.#pen);
        this.asset.wrapper.push(nuWrapper);
        return nuWrapper;
    }
    draw(x = this.x, y = this.y, rotation = this.rotation) {
        
        if (this.asset.complete === false) {
            return null;
        }

        if (this.#pen.debug) {
            Debug.drawImg(this.#pen, this);
            return "DEBUG MODE ACTIVE IN IMG";
        }

        const halfWidth = this.w / 2;
        const halfHeight = this.h / 2;

        if (rotation > 359) {
            rotation = 0;
        }

        this.#pen.state.save();

        this.#pen.context.translate(x, y);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(rotation));
        this.#pen.context.drawImage(
            this.asset,
            0 - halfWidth,
            0 - halfHeight,
            this.w,
            this.h
        );
        this.#pen.state.load();
    }
}
