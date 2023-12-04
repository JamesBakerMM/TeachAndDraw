import{AssetType} from "./Assets.js";

export class ImageManager extends AssetType {
    constructor(context) {
        super();
        this.context = context;
    }

    draw(img, x, y, width, height) {
        if (width && height) {
            this.context.drawImage(img, x, y, width, height);
        } else {
            this.context.drawImage(img, x, y);
        }
    }
}