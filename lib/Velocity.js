//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class Velocity {
    #x;
    #y;
    constructor(x = 0, y = 0) {
        this.previous={
            x:x,
            y:y
        }
        this.#x = x;
        this.#y = y;
        Object.preventExtensions(this); //protect against accidental assignment;
    }
    set _perfX(value) {
        this.previous.x=this.#x;
        this.#x = value;
        return this.#x;
    }
    set _perfY(value) {
        this.previous.y=this.#y;
        this.#y = value;
        return this.#y;
    }
    set x(value) {
        if (Number.isFinite(value)) {
            this.previous.x=this.#x;
            this.#x = value;
            return this.#x;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value,"x has to be a number!")
        );
    }
    get x() {
        return this.#x;
    }
    set y(value) {
        if (Number.isFinite(value)) {
            this.previous.y=this.#y;
            this.#y = value;
            return this.#y;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value,"y has to be a number!")
        );
    }
    get y() {
        return this.#y;
    }
}
    