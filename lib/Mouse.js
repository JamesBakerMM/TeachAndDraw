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
        this.leftReleased = false;
        this.rightReleased = false;

        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * private_internal
     */
    initEventListeners(){
        const body = document.querySelector("body");

        body.addEventListener("mousemove",(event)=>{
            event.isBody=true;
            this.#updateMousePosition(event)
        });
        this.pen.canvas.addEventListener("mousemove",(event)=>{
            event.isCanvas=true;
            this.#updateMousePosition(event)
        });
        
        //mouse pressing
        this.pen.canvas.addEventListener("mousedown",(event)=>{
            event.isCanvas=true;
            this.#updateMousePosition(event)
        });

        this.pen.canvas.addEventListener("mouseup",(event)=>{
            event.isCanvas=true;
            this.#updateMousePosition(event)
        });

        //mouse wheel
        this.pen.canvas.addEventListener("wheel",(event)=>{
            event.isCanvas=true;
            this.#updateMousePosition(event)
        });

        //stop default context menu
        this.pen.canvas.addEventListener("contextmenu",(event)=>{
            event.isCanvas=true;
            event.preventDefault();
        });

        //Not currently using the same logic as other mouse event listeners
        this.pen.canvas.addEventListener("wheel", (event) => { 
            event.isCanvas=true;
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
    

    /**
     * private_internal
     */
    endOfFrame() {
        super.endOfFrame();
        this.previous.x=this.#position.x;
        this.previous.y=this.#position.y;
        if(this.leftReleased) {
            this.leftDown = false;
        }
        if (this.rightReleased) {
            this.rightDown = false;
        }
        this.leftReleased = false;
        this.rightReleased = false;
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
                            this.leftReleased = true;
                            break;
                        case 2:
                            this.rightReleased = true;
                            break;
                    }
                    break;
                case "wheel":
                    break;
            }
            this.#position.x = EVENT.adjustedX;
            this.#position.y = EVENT.adjustedY;
        }
        
    }
    /**
     * 
     * @param {Event} event 
     */
    #updateMousePosition(event) {
        const rect = this.pen.canvas.getBoundingClientRect();
        const adjustedX = event.clientX - rect.left;
        const adjustedY = event.clientY - rect.top;
 
        event.adjustedX = adjustedX;
        event.adjustedY = adjustedY;
        event.adjusted=true;
        // Create a new custom event object with adjusted coordinates
        this.store(event);
    }
    get x() {
        return this.#position.x;
    }
    get y() {
        return this.#position.y;
    }
}