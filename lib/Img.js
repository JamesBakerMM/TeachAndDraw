import { Point } from "./Point.js";

export class Img extends Image {
    static id=0;
    static getId(){
        Img.id+=1;
        return Img.id
    }
    constructor(x=0,y=0,pen,filepath){
        super()
        this.id=Img.getId();
        this.position=new Point(x,y)
        this.w=0;
        this.h=0;
        this.src=filepath;
        this.pen=pen;

        this.onload = () => {
            this.w = this.naturalWidth;
            this.h = this.naturalHeight;
            console.log(filepath, "loaded")
        };
    }
    draw(){
        if(!this.complete) {            
            return null
        }
        if(this.pen.debug) {
            const prevStroke=this.pen.colour.stroke;      
            const prevFill=this.pen.colour.fill;      
            this.pen.colour.fill="rgba(0,0,0,0.5)";
            this.pen.shape.rectangle(this.x+this.w/2,this.y,this.w,this.h);
            this.pen.colour.stroke="rgb(0,255,0)";
            this.pen.colour.fill="rgba(0,0,0,0)";
            this.pen.shape.rectangle(this.x+this.w/2,this.y,this.w,this.h);
            this.pen.shape.line(
                this.x-this.w,this.y+this.h*2,
                this.x+this.w,this.y
                )
                this.pen.shape.line(
                    this.x, this.y ,
                    this.x + this.w*2, this.y+ this.h * 2
                    );      
                    this.pen.colour.fill="rgb(0,255,0)";
                    this.pen.shape.oval(this.x,this.y,10); 
                    this.pen.colour.fill="black";
                    this.pen.text.draw(this.x-8,this.y+3,`id:${this.id}`)
                    this.pen.colour.fill="rgb(0,255,0)";
                    this.pen.text.draw(this.x+13,this.y-5,`x:${this.x}, y:${this.y}`);
                    this.pen.colour.fill="black";
                    this.pen.shape.rectangle(this.x+this.w/2,this.y+14,this.w,15);
                    this.pen.colour.fill="rgb(0,255,0)";
                    this.pen.text.draw(this.x+13,this.y+25,`Type:Image`);
                    this.pen.colour.fill=prevFill;
                    this.pen.colour.stroke=prevStroke;
            return "DEBUG MODE ACTIVE IN IMG"
        }
        this.pen.context.drawImage(this, this.x, this.y,this.w,this.h);
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