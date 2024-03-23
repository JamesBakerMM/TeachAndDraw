//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class Velocity {
    #x;
    #y;
    #max;
    #negativeMax;
    constructor(x = 0, y = 0) {
        this.#x = x;
        this.#y = y;
        this.#max = 1000;
        this.#negativeMax = -this.#max;
        Object.preventExtensions(this); //protect against accidental assignment;
    }
    set _perfX(value) {
        this.#x = value;
        return this.#x;
    }
    get _perfX(){
        return this.#x;
    }
    set _perfY(value) {
        this.#y = value;
        return this.#y;
    }
    get _perfY(){
        return this.#y;
    }
    set x(value) {
        if (Number.isFinite(value)) {
            if (value > this.#negativeMax && value < this.#max) {
                this.#x = value;
            } else if (value > 0) {
                this.#x = this.#max;
            } else if (value < 0) {
                this.#x = this.#negativeMax;
            } else {
                this.#x = 0;
            }
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
            if (value > this.#negativeMax && value < this.#max) {
                this.#y = value;
            } else if (value > 0) {
                this.#y = this.#max;
            } else if (value < 0) {
                this.#y = this.#negativeMax;
            } else {
                this.#y = 0;
            }
            return this.#y;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value,"y has to be a number!")
        );
    }
    get y() {
        return this.#y;
    }
    set max(value) {
        if (Number.isFinite(value)) {
            this.#max = value;
            this.#negativeMax = -this.#max;
            return this.#y;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value,"max has to be a number!")
        );
    }
    get max() {
        return this.#max;
    }
    
    modify(mx, my) {
        this.x = this.#x + mx;
        this.y = this.#y + my;
        return;
    }
}

//Locks
Object.defineProperty(Velocity.prototype, 'modify', {
    value: Velocity.prototype.modify,
    writable: false,
    configurable: false
});