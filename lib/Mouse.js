import {InputDevice} from "./InputDevice.js";

export class Mouse extends InputDevice {
    #cursorVisible
    constructor(pen){
        super();
        this.pen=pen;
        this.canvas=pen.canvas;
        this.context=this.pen.context;
        this.position=this.pen.makePoint(0,0);
        this.previous=this.pen.makePoint(0,0);
        this.#cursorVisible=true;
        
        // Setup event listeners
        this.initializeMouseEvents();
    }

    set cursorVisible(value){
        if(typeof value === 'boolean'){
            this.#cursorVisible=value;
        }
        throw `cursorVisible requires a boolean, you passed it ${value}`
    }
    
    initializeMouseEvents() {
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width; 
            const scaleY = this.canvas.height / rect.height; 
 
            this.position.x = (event.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
            this.position.y = (event.clientY - rect.top) * scaleY;  // been adjusted to be relative to element
        });
    }
    get x(){
        //get bounding rect 
        //check mouse position within that
        return this.position.x
    }
    get y(){
        return this.position.y
    }
}