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
    //get the current offset for x and y from pen each cycle of draw eventually
}