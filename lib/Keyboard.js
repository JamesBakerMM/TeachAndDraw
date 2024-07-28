import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";
export class Keyboard extends InputDevice {
    #pen;
    #active;
    constructor(pen) {
        super();
        this.#pen = pen;
        this.#active = false;
        this.keys = {};
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    
    /**
     * internal
     * private_internal
     */
    static processKey(key) {
        let nuKey = key.toLowerCase();
        switch (nuKey) {
            case "arrowup":
                nuKey = "uparrow";
                return nuKey;
            case "arrowdown":
                nuKey = "downarrow";
                return nuKey;
            case "arrowleft":
                nuKey = "leftarrow";
                return nuKey;
            case "arrowright":
                nuKey = "rightarrow";
                return nuKey;
            default:
                break;
        }
        return nuKey;
    }
    
    /**
     * internal
     * private_internal
     */
    initEventListeners() {
        document.addEventListener("keydown", (event) => {
            const key = Keyboard.processKey(event.key); 
            if (key === "alt") {
                return;
            }
            if (key === "tab") {
                return;
            }
            if (this.keys[key] === undefined) {
                this.keys[key] = new Key(key, true, true, 0);
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = Keyboard.processKey(event.key); 
            if (this.keys[key]) {
                this.keys[key].down = false;
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.clearKeys();
            }
        });
    }

    draw() {
        let debugY = 0;
        this.#active = false;
        for (let key in this.keys) {
            this.#active = true;
            key = key.toLowerCase();
            if (this.keys[key].down) {
                this.keys[key].frames++;
            } else {
                delete this.keys[key];
            }
            if (this.keys[key] && this.keys[key].up) {
                this.keys[key].up = false;
            }
            if (this.#pen.debug && this.keys[key]) {
                debugY -= 15;
                Debug.drawKeys(this.#pen, this, key, debugY);
            }
        }
    }
    
    /**
     * internal
     * private_internal
     */
    clearKeys() {
        const keys = Object.entries(this.keys);
        if (keys.length > 0) {
            this.keys = {};
        }
    }
    released(key) {
        key = key.toLowerCase();
        const keys = Object.entries(this.keys);
        if (keys.length < 1) {
            return false;
        }
        if (key === "any") {
            return keys.length > 0;
        }
        if (this.#pen.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object sorry");
        }
        if (this.#pen.debug && key === "tab") {
            console.warn("tab isn't tracked for the keys object sorry");
        }
        return this.keys[key] && this.keys[key].up;
    }

    down(key) {
        key = key.toLowerCase();
        const keys = Object.entries(this.keys);
        if (keys.length < 1) {
            return false;
        }
        if (key === "any") {
            return keys.length > 0;
        }
        if (this.#pen.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object sorry");
        }
        if (this.#pen.debug && key === "tab") {
            console.warn("tab isn't tracked for the keys object sorry");
        }
        if (!(this.keys[key] && this.keys[key].down)) {
            return false;
        }
        return this.keys[key] && this.keys[key].down;
    }
    howLongDown(key) {
        key = key.toLowerCase();
        const keys = Object.entries(this.keys);
        if (keys.length < 1) {
            // there are no keys being pressed
            return 0;
        }
        if (key === "any") {
            let longestKeyVal = keys[0][1].frames;
            for (const [key, value] of keys) {
                if (longestKeyVal < value.frames) {
                    longestKeyVal = value.frames;
                }
            }
            return longestKeyVal;
        }
        if (this.#pen.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object sorry");
        }

        if (this.keys[key]) {
            return this.keys[key].frames;
        } else {
            return 0;
        }
    }
}

class Key {
    constructor(value, down = false, up = false, frames = 0) {
        this.value = value;
        this.down = down;
        this.up = up;
        this.frames = frames;
    }
}
