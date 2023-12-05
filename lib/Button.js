import {Entity} from "./Entity.js"

export class Button extends Entity{
    constructor(x,y,w,h,label=`E:${this.id}`,pen){
        super();
        this.pen=pen;
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.func=()=>{
            console.log(`you clicked entity #${this.id}!`)
        }

        this.context=pen.context;

        this.fill="green";
        this.stroke="rgba(0,0,0,1)";
        this.label=label;
        this.font=null;
        this.textSize=12;
        this.wordwrap=false;
    } 
    drawHover(){
        const prevFill=this.fill;
        const prevStroke=this.stroke;
        
        let strokeColour=this.fill;
        let fillColour=this.stroke;

        fillColour=this.stroke 
        strokeColour=this.fill;       //if debug
        this.pen.colour.fill=fillColour;
        this.pen.colour.stroke=strokeColour;
        this.pen.shape.rectangle(this.x,this.y,this.w,this.h);
        this.pen.colour.fill=strokeColour;
        this.pen.text.draw(this.x-this.w/4,this.y,this.label)
        this.pen.colour.stroke=prevStroke;
        this.pen.colour.fill=prevFill;

    }
    drawClick(){
        //if debug

    }
    drawIdle(){
        //if debug
        this.pen.shape.rectangle(this.x,this.y,this.w,this.h);
        this.pen.colour.fill="black";
        this.pen.text.draw(this.x-this.w/4,this.y,this.label)

    }
    isHovered(){
        return this.pen.mouse.position.isInRect(this.x,this.y,this.w,this.h)
    }
    draw() {
        const prevFill=this.fill;
        const prevStroke=this.stroke;
        
        let strokeColour=this.stroke;
        let fillColour=this.fill;
        if(this.isHovered()){
            fillColour=this.stroke;
            strokeColour=this.fill;       //if debug
            this.drawHover();

            if(this.pen.mouse.isPressed){
                this.func();
            }
            return "HOVERED"
        }

        if(this.pen.debug){
            strokeColour="rgb(0,255,0)";
            fillColour="rgba(0,155,0,0.2)";
            this.pen.colour.fill=fillColour;
            this.pen.colour.stroke=strokeColour;

            this.pen.shape.rectangle(this.x,this.y,this.w,this.h);
            this.pen.colour.fill=strokeColour;
            this.pen.text.draw(this.x-this.w/4,this.y+this.h/2,this.label)

            this.pen.shape.oval(this.x,this.y,10)
            this.pen.colour.fill=prevFill;
            this.pen.colour.stroke=prevStroke;
            return `Debug:${this.pen.debug}`
        }
        this.pen.colour.fill=fillColour;
        this.pen.colour.stroke=strokeColour;
        this.drawIdle();
        this.pen.colour.stroke=prevStroke;
        this.pen.colour.fill=prevFill;
    }
}