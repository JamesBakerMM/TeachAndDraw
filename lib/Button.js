import {Entity} from "./Entity.js"

export class Button extends Entity{
    constructor(x,y,w,h,pen){
        super();
        this.pen=pen;
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;

        this.context=pen.context;

        this.fill="green";
        this.stroke="rgba(0,0,0,0)";
        this.text=`E:${this.id}`;
        this.font=null;
        this.textSize=12;
        this.wordwrap=false;
    }
    draw() {
        let strokeColour=this.stroke;
        let fillColour=this.fill;
        if(this.pen.debug){
            strokeColour="rgb(0,255,0)";
            fillColour="rgba(0,0,0,0)";
        }
        this.pen.colour.fill=fillColour;
        this.pen.colour.stroke=strokeColour;
        if(this.pen.debug){
            //size
            //text btnId : entityId
        }
        this.pen.shape.rectangle(this.x,this.y,this.w,this.h);
    }
}