export class Text {
    #leftAlign
    #rightAlign
    #centerAlign
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(context, colour) {
        this.context = context;
        this.colour = colour;
        this.#leftAlign=false;
        this.#centerAlign=false;
        this.#rightAlign=false;
    }
    set leftAlign(value){
        //if val is NOT boolean throw an error
        //if setting true, set centerAlign and rightAlign false
        //if setting false check if other alignments are active, if not set left
    }
    set centerAlign(value){
        //if val is NOT boolean throw an error
        //if setting true, set leftAlign and rightAlign false
        //if setting false check if other alignments are active, if not set left

    }
    set rightAlign(value){
        //if val is NOT boolean throw an error
        //if setting true, set centerAlign and leftAlign false
        //if setting false check if other alignments are active, if not set left

    }
    set state(newState) {
        if(newState===undefined){
            throw Error("undefined state given!");
        }
        //if newState is valid
        this.size=newState.size;
        this.w=newState.w;    
        this.h=newState.h;    
        this.font=newState.font;
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