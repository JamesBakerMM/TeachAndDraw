export class Text {
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(context, colour) {
        this.context = context;
        this.colour = colour;
    }
    /**
     *
     * @param {*} x
     * @param {*} y
     * @param {*} content
     * @param {*} w
     * @param {*} h
     */
    draw(x, y, content) {
        this.context.fillText(content, x, y);
    }
    constrainX(){}
    constrainY(){}
    /**
     *
     * @param {*} size
     */
    size(size) {
        //return false if can't find the file

        return true; //
    }
    /**
     *
     * @param {*} font
     */
    font(font) {}
    /**
     *
     * @param {*} filepath
     */
    loadFont(filepath) {
        return file;
    }
}