import {InputDevice} from "./InputDevice.js";
import {Debug} from "./Debug.js";
export class Keyboard extends InputDevice { 
    #pen
    constructor(pen) {
        super();
        this.#pen=pen;
        this.keys = {};
        this.initEvents();
    }

    initEvents() {
        document.addEventListener('keydown', (event) => {
            const key=event.key.toLowerCase();
            if (this.keys[key]===undefined) {
                this.keys[key] = new Key(key,true,true,0);
            }
        });

        document.addEventListener('keyup', (event) => {
            const key=event.key.toLowerCase();
            if (this.keys[key]) {
                this.keys[key].down = false;
            }
        });
    }

    draw() {
        let debugY=0;
        for (let key in this.keys) {
            key=key.toLowerCase()
            if (this.keys[key].down) {
                this.keys[key].frames++;
            } else {
                delete this.keys[key];
            }
            if (this.keys[key] && this.keys[key].pressed) {
                this.keys[key].pressed = false; // Reset pressed state after first check
            }
            if(this.#pen.debug && this.keys[key]){
                debugY-=15;
                Debug.drawKeys(pen,this,key,debugY);
            }
        }
    }

    pressed(key) {
        key=key.toLowerCase()
        return this.keys[key] && this.keys[key].pressed;
    }

    down(key) {
        key=key.toLowerCase()
        return this.keys[key] && this.keys[key].down;
    }

    howLongDown(key) {
        key=key.toLowerCase()
        return this.keys[key] ? this.keys[key].frames : 0;
    }
}

class Key {
    constructor(value,down=false,pressed=false,frames=0){
        this.value=value;
        this.down=down;
        this.pressed=pressed;
        this.frames=frames;
    }
}