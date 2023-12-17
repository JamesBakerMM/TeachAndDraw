import { Point } from "./Point.js"; 
import { Debug } from "./Debug.js";

export class Img extends Image {
    static id = 0;
    static getId() {
        Img.id += 1;
        return Img.id;
    }
    #pen
    constructor(pen, filepath,job) {
        super();
        this.id = Img.getId();
        this.src = filepath;
        this.#pen = pen;
        //wrapper currently assigned in pen.loadImage will fix later

        this.onload = () => {
            this.wrapper.w = this.naturalWidth;
            this.wrapper.h = this.naturalHeight;
            job.finish();
        };
    }
    
}

export class ImgWrapper {
    static id = 0;
    static getId() {
        ImgWrapper.id += 1;
        return ImgWrapper.id;
    }
    #w
    #h
    #pen
    #img
    #position
    constructor(x,y,img,pen){
        this.id = ImgWrapper.getId();
        this.#pen = pen;
        this.#w = 0;
        this.#h = 0;
        this.#img=img;
        this.#position=new Point(x,y);
        this.rotation=0;
    }

    set x(value){
        if(Number.isFinite(value)){
            this.#position.x=value;
            return this.#position.x
        }
        throw Error(`x has to be a number! you gave ${value}:${typeof value}`);
    }
    get x(){
        return this.#position.x
    }
    set y(value){
        if(Number.isFinite(value)){
            this.#position.y=value;
            return this.#position.y
        }
        throw Error(`y has to be a number! you gave ${value}:${typeof value}`);
    }
    get y(){
        return this.#position.y
    }
    set w(value){
        if (Number.isFinite(value)) {
            this.#w=value;
            this.#img.w=value;
            return this.#w
        }
        throw Error(`soz, w can only be set as a number, you gave me ${value}:${typeof value}`)
    }
    get w(){
        return this.#w
    }
    set h(value){
        if (Number.isFinite(value)) {
            this.#h=value;
            this.#img.h=value;
            return this.#h
        }
        throw Error(`soz, h can only be set as a number, you gave me: ${value} of type ${typeof value}`)
    }
    get h(){
        return this.#h
    }
    draw(){
        if (this.#img.complete===false) {
            return null;
        }
        
        this.#pen.state.save();

        const halfWidth=this.w/2;
        const halfHeight=this.h/2;
        const topRight={ x:this.x+halfWidth, y:this.y-halfHeight }
        const topLeft={ x:this.x-halfWidth, y:this.y-halfHeight }
        const bottomLeft={ x:this.x-halfWidth, y:this.y+halfHeight } 
        const bottomRight={ x:this.x+halfWidth, y:this.y+halfHeight }

        if(this.rotation>359){
            this.rotation=0;
        }

        if (this.#pen.debug) {
            const sizes={
                halfWidth:halfWidth,
                halfHeight:halfHeight,
                topRight:topRight,
                topLeft:topLeft,
                bottomLeft:bottomLeft,
                bottomRight:bottomRight
            }
            Debug.drawImg(this.#pen,this);
            
            this.#pen.state.load();
            return "DEBUG MODE ACTIVE IN IMG";
        } else {

        this.#pen.context.translate(this.x, this.y);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(this.rotation));
        this.#pen.context.drawImage(this.#img, 0-halfWidth, 0-halfHeight, this.w, this.h);

        this.#pen.state.load();
    }
}

}