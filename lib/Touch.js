import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Touch extends InputDevice {
    #position;

    constructor(pen) {
        super(pen);
        this.pen=pen;        
        this.#position = pen.makePoint(0, 0);
        this.previous = pen.makePoint(0, 0);

        this.down = false;
        this.up = false;

        Object.preventExtensions(this); //protect against accidental assignment;
    }

    initEventListeners(){
        this.pen.canvas.addEventListener("touchstart",(event)=>{this.store(event)});
        this.pen.canvas.addEventListener("touchmove",(event)=>{this.store(event)});
        this.pen.canvas.addEventListener("touchend",(event)=>{this.store(event)});
        
    }

    draw() {
        if (this.pen.debug) {
            //Debug.drawMouse(this.pen,this);
        }
        this.endOfFrame();
    }

    endOfFrame() {
        super.endOfFrame();
        this.previous.x=this.#position.x;
        this.previous.y=this.#position.y;
        if (this.up) {
            this.down = false;
        }
        this.up = false;
        
        for (let i = 0; i < this.activeBuffer.length; i++) {
            const EVENT = this.activeBuffer[i];
            switch (EVENT.type) {
                case "touchstart":
                    //update state variables: type of event, x and y
                    this.down = true;
                    this.#position.x = EVENT.touches[0].clientX;
                    this.#position.y = EVENT.touches[0].clientY;       
                    break;
                case "touchend":
                    this.up = true;
                    
                    break;
                case "touchmove":
                    this.#position.x = EVENT.touches[0].clientX;
                    this.#position.y = EVENT.touches[0].clientY;
        
        
                    break;
                
            }
        }
        
    }

    get x() {
        return this.#position.x;
    }
    get y() {
        return this.#position.y;
    }

}