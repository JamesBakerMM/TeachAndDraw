import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

export class Mouse extends InputDevice {
    #cursor;
    #validValues
    #position
    #wheelDelta
    constructor(pen) {
        super(pen);
        this.pen=pen;        
        this.#position = pen.makePoint(0, 0);
        this.previous = pen.makePoint(0, 0);
        this.#cursor="default";
        this.isPressed = false;
        this.left=false; //TODO REPLACE THESE IN OTHER FILES WITH REFERENCES TO leftDown, rightDown, leftClicked, rightClicked as needed
        this.right=false; //TODO REPLACE THESE IN OTHER FILES WITH REFERENCES TO leftDown, rightDown, leftClicked, rightClicked as needed
        this.wheel={
            up:false,
            down:false
        }
        this.#wheelDelta=0;
        this.#validValues=new Set();
        this.#validValues.add("default");
        this.#validValues.add("hidden");
        this.#validValues.add("pointer");

        this.leftDown = false;
        this.rightDown = false;
        this.leftClicked = false;
        this.rightClicked = false;


        // Setup event listeners
        console.log(pen);
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    set cursor(value) {
        if (this.#validValues.has(value)) {
            this.#cursor=value;
        }
        return this.#cursor
    }

    get cursor(){
        return this.#cursor
    }

    initEventListeners(){
        this.pen.canvas.addEventListener("mousemove",(event)=>{
            this.store(event)
        });
        
        //mouse pressing
        this.pen.canvas.addEventListener("mousedown",(event)=>{this.store(event)});

        this.pen.canvas.addEventListener("mouseup",(event)=>{this.store(event)});

        //mouse wheel
        this.pen.canvas.addEventListener("wheel",(event)=>{this.store(event)});

        //stop default context menu
        //eventually add own custom menu 
        this.pen.canvas.addEventListener("contextmenu",(event)=>{
            //console.log("context menu!")
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

    store(event) {
        this.storageBuffer.push(event);
        if (event.type != "mousemove") console.log(event);
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
        if(this.leftClicked) {
            this.leftDown = false;
        }
        if (this.rightClicked) {
            this.rightDown = false;
        }
        this.leftClicked = false;
        this.rightClicked = false;
        //this.wasDown = false;
        for (let i = 0; i < this.activeBuffer.length; i++) {
            const EVENT = this.activeBuffer[i];
            switch (EVENT.type) {
                case "mousemove":
                    //update state variables: type of event, x and y
                    break;
                case "mousedown":
                    console.log(EVENT.button);
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
                            this.leftClicked = true;
                            break;
                        case 2:
                            this.rightClicked = true;
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