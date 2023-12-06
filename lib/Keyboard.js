import {InputDevice} from "./InputDevice.js";

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
            if (this.keys[event.key]===undefined) {
                this.keys[event.key] = new Key(event.key,true,true,0);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.keys[event.key]) {
                this.keys[event.key].down = false;
            }
        });
    }

    draw() {
        let debugY=0;
        for (const key in this.keys) {
            if (this.keys[key].down) {
                this.keys[key].frames++;
            } else {
                delete this.keys[key];
            }
            if (this.keys[key] && this.keys[key].pressed) {
                this.keys[key].pressed = false; // Reset pressed state after first check
            }
            if(this.#pen.debug && this.keys[key]){
                if (this.keys[key].down) {
                    const boxWidth = 80;
                    const boxHeight = 30;
                    const boxX = this.#pen.canvas.width - boxWidth/2;
                    const boxY = this.#pen.canvas.height - boxHeight/2;
            
                    this.#pen.colour.fill = "green";
                    debugY-=10;
                    this.#pen.text.draw(boxX-35, boxY+debugY, `⌨️ ${key}: ${this.keys[key].frames} frames`);
                }
            }
        }


    }

    pressed(key) {
        return this.keys[key] && this.keys[key].pressed;
    }

    down(key) {
        return this.keys[key] && this.keys[key].down;
    }

    howLongDown(key) {
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