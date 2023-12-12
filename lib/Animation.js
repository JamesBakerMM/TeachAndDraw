import { Group } from "./Group.js";

export class Animation extends Array {
    constructor(x,y,pen,...imgs) {
        super(...imgs);
        console.log(x,y,pen,imgs)
        this.x=x;
        this.y=y;
        this.pen=pen;
        this.currentFrame=0;
        if(imgs.length===0){
            throw new Error("no images provided! animations need photos! photos of spiderman!")
        }
    }
    draw() {
        this[this.currentFrame].draw();
    }
    previous() {}
    next() {}

    set x(value){
        for(let img of this){
            img.x=value;
        }
    }
    get x(){}

    set y(value){
        for(let img of this){
            img.y=value;
        }
    }
    get y(){}
}
