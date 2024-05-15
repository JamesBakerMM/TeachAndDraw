import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Mouse extends InputDevice {
    #validValues
    #position
    #wheelDelta
    constructor(pen) {
        super(pen);
        this.pen=pen;        
        this.#position = pen.makePoint(0, 0);
        this.previous = pen.makePoint(0, 0);
        this.wheel={
            up:false,
            down:false
        }
        this.#wheelDelta=0;

        this.leftDown = false;
        this.rightDown = false;
        this.leftUp = false;
        this.rightUp = false;

        Object.preventExtensions(this); //protect against accidental assignment;
    }

    initEventListeners(){
        this.pen.canvas.addEventListener("mousemove",(event)=>{this.store(event)});
        
        //mouse pressing
        this.pen.canvas.addEventListener("mousedown",(event)=>{this.store(event)});

        this.pen.canvas.addEventListener("mouseup",(event)=>{this.store(event)});

        //mouse wheel
        this.pen.canvas.addEventListener("wheel",(event)=>{this.store(event)});

        //stop default context menu
        this.pen.canvas.addEventListener("contextmenu",(event)=>{
            event.preventDefault();
        });

        //Not currently using the same logic as other mouse event listeners
        this.pen.canvas.addEventListener("wheel", (event) => { 
            this.#wheelDelta += event.wheelDeltaY;
            if (event.wheelDeltaY < 0) {
                this.wheel.up = false;
                this.wheel.down = true;
            } else if (event.wheelDeltaY > 0) {
                this.wheel.up = true;
                this.wheel.down = false;
            }
        });
    }

    draw() {
        if(this.pen.frameCount%10===0){
            this.wheel.up = false;
            this.wheel.down = false;
        }
        if (this.pen.debug) {
            Debug.drawMouse(this.pen,this);
        }
        this.endOfFrame();
    }

    endOfFrame() {
        super.endOfFrame();
        this.previous.x=this.#position.x;
        this.previous.y=this.#position.y;
        if(this.leftUp) {
            this.leftDown = false;
        }
        if (this.rightUp) {
            this.rightDown = false;
        }
        this.leftUp = false;
        this.rightUp = false;
        for (let i = 0; i < this.activeBuffer.length; i++) {
            const EVENT = this.activeBuffer[i];
            switch (EVENT.type) {
                case "mousemove":
                    //update state variables: type of event, x and y
                    break;
                case "mousedown":
                    switch (EVENT.button) {
                        case 0:
                            this.leftDown = true;
                            break;
                        case 2:
                            this.rightDown = true;
                            break;
                    }
                    break;
                case "mouseup":
                    switch (EVENT.button) {
                        case 0:
                            this.leftUp = true;
                            break;
                        case 2:
                            this.rightUp = true;
                            break;
                    }
                    break;
                case "wheel":
                    break;
            }
            this.#position.x = EVENT.clientX;
            this.#position.y = EVENT.clientY;
        }
        
    }
    get x() {
        return this.#position.x;
    }
    get y() {
        return this.#position.y;
    }
}