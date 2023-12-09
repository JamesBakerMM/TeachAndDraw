export class ImageManager {
    constructor(context) {
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