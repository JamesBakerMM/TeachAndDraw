import { Entity } from "./Entity.js";
import { Debug } from "./Debug.js";

export class Button extends Entity {
    #pen;
    #up;
    #down;
    #lastFrameDrawn;
    constructor(x, y, w, h, label = `E:${this.id}`, pen) {
        if (
            Number.isFinite(x) === false ||
            Number.isFinite(y) === false ||
            Number.isFinite(w) === false ||
            Number.isFinite(h) === false
        ) {
            throw Error(
                `You need to give numbers for x, y, w, and h.\n` +
                    `You gave: \n` +
                    `x: ${x}:${typeof x}\n` +
                    `y: ${y}:${typeof y}\n` +
                    `w: ${w}:${typeof w}\n` +
                    `h: ${h}:${typeof h}\n`
            );
        }
        super(pen, x, y);
        this.#pen = pen;
        this.w = w;
        this.h = h;
        //state managment properties
        this.#up = false;
        this.#down = false;
        this.#lastFrameDrawn = 0;

        //appearance properties
        this.label = label;
        this.style = "default";
        this.background = "grey";
        this.border = "black";
        this.textColour = "white";
        this.accentColour = "yellow";
    }
    get down() {
        if(this.exists===false){
            return false
        }
        const buttonWasVisible=this.#lastFrameDrawn===this.#pen.frameCount-1;
        // console.log("buttonWasVisible",buttonWasVisible);
        if(buttonWasVisible>2){
            return false
        }
        if(this.isHovered()){
            this.#down = this.#pen.mouse.leftDown
        } else {
            this.#down = false;
        }
        
        return this.#down;
    }
    set down(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }
    get up() {
        if(this.exists === false) {
            return false;
        }
        const buttonWasVisible = this.#lastFrameDrawn === this.#pen.frameCount - 1;
        if(buttonWasVisible > 2) {
            return false;
        }
        if(this.isHovered()) {
            this.#up = this.#pen.mouse.leftUp;
        } else {
            this.#up = false;
        }
        
        return this.#up;
    }
    set up(value) {
        throw Error(
            "Sorry this is a read only property, you can't set this to a new value."
        );
    }
    drawIdle() {
        this.#pen.colour.fill = this.background;
        this.#pen.colour.stroke = this.border;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = this.textColour;
        this.#pen.text.print(this.x, this.y, this.label);
    }
    drawHover() {
        this.#pen.text.bold=true;
        this.#pen.colour.fill = this.accentColour;
        this.#pen.colour.stroke = this.border;
        this.#pen.shape.rectangle(this.x, this.y, this.w, this.h);
        this.#pen.colour.fill = this.background;
        this.#pen.text.print(this.x, this.y, this.label);
    }
    isHovered() {
        return Button.isInRect(
            this.#pen.mouse.x,
            this.#pen.mouse.y,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
    draw() {
        this.#pen.state.save();
        this.#pen.state.reset();
        this.#lastFrameDrawn = this.#pen.frameCount;
        
        if (this.isHovered()) {
            this.drawHover();
        } else {
            this.drawIdle();
        }
        this.#pen.state.load();
    }
    static isInRect(x, y, centerX, centerY, width, height) {
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;
        return (
            x >= leftX && x <= leftX + width && y >= topY && y <= topY + height
        );
    }
}