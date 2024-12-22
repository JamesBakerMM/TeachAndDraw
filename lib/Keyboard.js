import { InputDevice } from "./InputDevice.js";
import { Debug } from "./Debug.js";
import { EventEmitter } from "./Event.js";
export class Keyboard extends InputDevice {
    #pen;
    #active;
    #event;
    constructor(pen) {
        super();
        this.#pen = pen;
        this.#active = false;
        this.#event = new EventEmitter();
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

            const data = {key: key, msDown: this.durationDown(key)};
            if (this.keys[key].down) {
                this.#event.emit(`down-${key}`, data);
                this.#event.emit(`down`, data);
                this.keys[key].timer += this.#pen.time.msElapsed;
            } else {
                this.#event.emit(`release-${key}`, data);
                this.#event.emit(`release`, data);
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
     * @param {string} key
     * @param {Function} callback
     * @returns {EventCallbackID} Identifier.
     */
    onKeyDown( key, callback ) {
        key = key.toLowerCase();
        return this.#event.on(`down-${key}`, callback);
    }

    /**
     * @param {string} key
     * @param {Function} callback
     * @returns {EventCallbackID} Identifier.
     */
    onKeyRelease( key, callback ) {
        key = key.toLowerCase();
        return this.#event.on(`release-${key}`, callback);
    }

    /** @returns {EventCallbackID} Identifier. */
    onDown( callback ) {
        return this.#event.on("down", callback);
    }

    /** @returns {EventCallbackID} Identifier. */
    onRelease( callback ) {
        return this.#event.on("release", callback);
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
        if (this.#pen.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object because it causes unpredictable behaviour");
        }
        if (this.#pen.debug && key === "tab") {
            console.warn("tab isn't tracked for the keys object because it causes unpredictable behaviour");
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
                if (longestKeyVal < value.timer) {
                    longestKeyVal = value.timer;
                }
            }
            return longestKeyVal;
        }
        if (this.#pen.debug && key === "alt") {
            console.warn("alt isn't tracked for the keys object sorry");
        }

        if (this.keys[key]) {
            return this.keys[key].timer;
        } else {
            return 0;
        }
    }
}

class Key {
    constructor(value, down = false, up = false, timer = 0) {
        this.value = value;
        this.down = down;
        this.up = up;
        this.timer = timer;
    }
}
