import {Entity} from "./Entity.js"

export class Button extends Entity{ 
    #pen
    constructor(x,y,w,h,label=`E:${this.id}`,pen){
        super();
        this.#pen=pen;
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.func=()=>{
            console.log(`you clicked entity #${this.id}!`)
        }
        this.onPress=()=>{
            console.log(`you pressed entity #${this.id}!`)
        }        
        this.onClick=()=>{
            console.log(`you clicked entity #${this.id}!`)
        }       
        this.onReleased=()=>{
            console.log(`you released on this entity #${this.id}!`)
        }

        this.context=pen.context;

        this.fill="grey";
        this.stroke="black";
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
        this.#pen.colour.fill=fillColour;
        this.#pen.colour.stroke=strokeColour;
        this.#pen.shape.rectangle(this.x,this.y,this.w,this.h);
        this.#pen.colour.fill=strokeColour;
        this.#pen.text.draw(this.x-this.w/4,this.y,this.label)
        this.#pen.colour.stroke=prevStroke;
        this.#pen.colour.fill=prevFill;
    }
    drawDebug(){
        this.#pen.state.save();
            const strokeColour="rgb(0,255,0)";
            const fillColour="rgba(0,155,0,0.5)";
            this.#pen.colour.fill=fillColour;
            this.#pen.colour.stroke=strokeColour;

            this.#pen.shape.rectangle(this.x,this.y,this.w,this.h);
            this.#pen.colour.fill=strokeColour;
            this.#pen.text.draw(this.x-this.w/4,this.y+this.h/2,this.label)
            for(let i=0; i<this.w/10; i++){
                let x1=this.x-this.w/2+i*10+20
                let y1=this.y-this.h/2;
                let x2=this.x-this.w/2+i*10
                let y2=this.y+this.h/2;

                if(x1>this.x+this.w/2===false){  
                    this.#pen.shape.line(
                        x1,y1,
                        x2,y2
                    )
                }
            }

            this.#pen.shape.oval(this.x,this.y,10)
            this.#pen.colour.fill="rgb(0,0,0)";
            this.#pen.text.draw(this.x-3,this.y+3,`${this.id}`);
            
            this.#pen.colour.fill = "black";
            this.#pen.shape.rectangle(
                this.x,
                this.y - this.h/2+7,
                this.w,
                15
            );
            this.#pen.colour.fill = "rgb(0,255,0)";
            this.#pen.text.draw(this.x-36, this.y - this.h/2+10, `👆 Type:Btn`);
            this.#pen.state.load();

    }
    drawHoveredDebug(){        
        this.#pen.state.save();
        let strokeColour=this.stroke;
        let fillColour=this.fill;
            strokeColour="rgba(0,155,0,0.5)";
            fillColour="rgba(0,255,0)";
            this.#pen.colour.fill=fillColour;
            this.#pen.colour.stroke="black"

            this.#pen.shape.rectangle(this.x,this.y,this.w,this.h);
            this.#pen.colour.fill="black"
            this.#pen.text.draw(this.x-this.w/4,this.y+this.h/2,this.label)
            for(let i=0; i<this.w/10; i++){
                let x1=this.x-this.w/2+i*10+20
                let y1=this.y-this.h/2;
                let x2=this.x-this.w/2+i*10
                let y2=this.y+this.h/2;

                if(x1>this.x+this.w/2===false){  
                    this.#pen.shape.line(
                        x1,y1,
                        x2,y2
                    )
                }
            }

            
            this.#pen.shape.oval(this.x,this.y,10)
            this.#pen.colour.fill="rgb(0,255,0)";
            this.#pen.text.draw(this.x-3,this.y+3,`${this.id}`);

            this.#pen.colour.fill = "black";
            this.#pen.shape.rectangle(
                this.x,
                this.y - this.h/2+7,
                this.w,
                15
            );
            this.#pen.colour.fill = "rgb(0,255,0)";
            this.#pen.text.draw(this.x-36, this.y - this.h/2+10, `👆 Type:Btn`);
            this.#pen.state.load();
    }
    drawClick(){
        //if debug

    }
    drawIdle(){
        this.#pen.state.save();
        this.#pen.shape.rectangle(this.x,this.y,this.w,this.h);
        this.#pen.colour.fill="black";
        this.#pen.text.draw(this.x-this.w/4,this.y,this.label)
        this.#pen.state.load();

    }
    isHovered(){
        return this.#pen.mouse.position.isInRect(this.x,this.y,this.w,this.h)
    }
    draw() {
        const prevFill=this.fill;
        const prevStroke=this.stroke;
        
        let strokeColour=this.stroke;
        let fillColour=this.fill;
        if(this.isHovered()){
            fillColour=this.stroke;
            strokeColour=this.fill;       //if debug
            if(this.#pen.debug) {
                this.drawHoveredDebug();
            } else {
                this.drawHover();
            }

            if(this.#pen.mouse.isPressed){
                this.onPress();
            }
            return "HOVERED"
        }

        if(this.#pen.debug){
            this.drawDebug();

            return `Debug:${this.#pen.debug}`
        }
        this.#pen.colour.fill=fillColour;
        this.#pen.colour.stroke=strokeColour;
        this.drawIdle();
        this.#pen.colour.stroke=prevStroke;
        this.#pen.colour.fill=prevFill;
    }
}