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
        //wrapper currently assigned in pen.loadImage will fix later

        this.onload = () => {
            this.wrapper.w = this.naturalWidth;
            this.wrapper.h = this.naturalHeight;
            job.finish();
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
    constructor(x, y, img, pen) {
        const w = 0;
        const h = 0;
        super(x, y, w, h);
        this.id = ImgWrapper.getId();
        this.#pen = pen;
        this.#asset = img;
        this.rotation = 0;
    }
    draw() {
        if (this.#asset.complete === false) {
            return null;
        }

        if (this.#pen.debug) {
            Debug.drawImg(this.#pen, this);
            return "DEBUG MODE ACTIVE IN IMG";
        }
        
        //draw image to screen
        const halfWidth = this.w / 2;
        const halfHeight = this.h / 2;

        if (this.rotation > 359) {
            this.rotation = 0;
        }

        this.#pen.state.save();
        this.#pen.context.translate(this.x, this.y);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(this.rotation));
        this.#pen.context.drawImage(
            this.#asset,
            0 - halfWidth,
            0 - halfHeight,
            this.w,
            this.h
        );
        this.#pen.state.load();
    }
}
