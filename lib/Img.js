import { Point } from "./Point.js";

export class Img extends Image {
    constructor(x=0,y=0,pen){
        super()
        this.position=new Point(x,y)
        this.w=0;
        this.h=0;
        this.pen=pen;

        this.onload = () => {
            this.w = this.naturalWidth;
            this.h = this.naturalHeight;
        };
    }
    draw(){
        if(this.complete){            
            this.pen.context.drawImage(this, this.x, this.y,this.w,this.h);
        }
    }
    resize(){

    }
    set x(value) {
        if (Number.isFinite(value)) {
            this.position.x = value;
            return this.position.x;
        }
    }
    set y(value) {
        if (Number.isFinite(value)) {
            this.position.y = value;
            return this.position.y;
        }
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
}