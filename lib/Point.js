export class Point {
    #x
    #y
    constructor(x,y,pen){
        this.#x=x;
        this.#y=y;
        this.pen=pen;
    }
    get x(){
        return this.#x
    }
    get y(){
        return this.#y
    }
    set x(value){
        this.#x=value;
    }
    set y(value){
        this.#y=value;
    }    
    static isInRect(x,y,centerX, centerY, width, height) {
        // Calculate the top-left corner of the rectangle
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;

        // Check if the point is within the rectangle
        return (
            x >= leftX &&
            x <= leftX + width &&
            y >= topY &&
            y <= topY + height
        );
    }
    //get the current offset for x and y from pen each cycle of draw eventually
}