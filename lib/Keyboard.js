
import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

export class Keyboard extends InputDevice {
    #tad;
    #active;
    /**
     * 
     * @param {Tad} tad 
     */
    constructor(tad) {
        super(tad);
        this.#tad = tad;
        this.#active = false;
        this.keys = {};
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * private_internal
     */
    endOfFrame() {
        super.endOfFrame();
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
            if (this.#tad.debug && this.keys[key]) {
                debugY -= 15;
                Debug.drawKeys(this.#tad, this, key, debugY);
            }
        }
    }

    /**
     * internal
     * private_internal
     * @param {string} key 
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
                this.store(event);
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = Keyboard.processKey(event.key);
            if (this.keys[key]) {
                this.keys[key].down = false;
                this.store(event);
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.clearKeys();
            }
        });
    }

    draw() {

        this.endOfFrame();
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
        if (this.#tad.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object because it causes unpredictable behaviour");
        }
        if (this.#tad.debug && key === "tab") {
            console.warn("tab isn't tracked for the keys object because it causes unpredictable behaviour");
        }
        return this.keys[key] && this.keys[key].up;
    }

    /**
     * 
     * @param {string} key 
     * @returns 
     */
    down(key) {
        key = key.toLowerCase();
        const keys = Object.entries(this.keys);
        if (keys.length < 1) {
            return false;
        }
        if (key === "any") {
            return keys.length > 0;
        }
        if (this.#tad.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object sorry");
        }
        if (this.#tad.debug && key === "tab") {
            console.warn("tab isn't tracked for the keys object sorry");
        }
        if (!(this.keys[key] && this.keys[key].down)) {
            return false;
        }
        return this.keys[key] && this.keys[key].down;
    }
    /**
     * @param {string} key 
     * @returns {number}
     */
    durationDown(key) {
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
        if (this.#tad.debug && key === "alt") {
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
    /**
     * @param {string} value 
     * @param {boolean} down 
     * @param {boolean} up 
     * @param {number} frames 
     */
    constructor(value, down = false, up = false, frames = 0) {
        this.value = value;
        this.down = down;
        this.up = up;
        this.frames = frames;
    }
}
