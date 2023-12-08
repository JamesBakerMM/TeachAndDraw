import { Point } from "./Point.js";

export class Img extends Image {
    static id = 0;
    static getId() {
        Img.id += 1;
        return Img.id;
    }
    #w
    #h
    #pen
    constructor(x = 0, y = 0, pen, filepath) {
        super();
        this.id = Img.getId();
        this.position = new Point(x, y);
        this.#w = 0;
        this.#h = 0;
        this.src = filepath;
        this.#pen = pen;
        this.rotation=0;

        this.onload = () => {
            this.#w = this.naturalWidth;
            this.#h = this.naturalHeight;

            console.log(filepath, `loaded`, `coords set at X${this.x} Y${this.y}`);
        };
    }
    drawDebug(sizes){
        this.#pen.context.save();
        this.#pen.context.translate(this.x, this.y);
        this.#pen.context.rotate(this.#pen.math.degreeToRadian(this.rotation));
        
        const halfWidth=this.w/2;
        const halfHeight=this.h/2;

        const prevStroke = this.#pen.colour.stroke;
        const prevFill = this.#pen.colour.fill;
        this.#pen.colour.fill = "rgba(0,0,0,0.5)";
        this.#pen.shape.rectangle(
            0,
            0,
            this.w,
            this.h
        );
        this.#pen.colour.stroke = "#ffb900";
        this.#pen.colour.fill = "rgba(0,0,0,0)";
        this.#pen.shape.rectangle(
            0,
            0,
            this.w,
            this.h
        );
        //x lines
        this.#pen.shape.line(
            halfWidth,
            -halfHeight,
            -halfWidth,
            halfHeight
        );
        this.#pen.shape.line(
            -halfWidth,
            -halfHeight,
            halfWidth,
            halfHeight
        );
        this.#pen.colour.fill = "#ffb900";
        this.#pen.shape.oval(0, 0, 10);
        this.#pen.colour.fill = "black";
        this.#pen.context.rotate(-this.#pen.math.degreeToRadian(this.rotation));
        this.#pen.text.draw(0 - 8, 0 + 3, `id:${this.id}`);
        this.#pen.context.rotate(this.#pen.math.degreeToRadian(this.rotation));
        this.#pen.colour.fill = "#ffb900";

        
        this.#pen.text.draw(
            0-36,
            0 - this.h/2-5,
            `x:${parseInt(this.x)}, y:${parseInt(this.y)}`
        );
        this.#pen.colour.fill = "black";
        this.#pen.shape.rectangle(
            0,
            0 - this.h/2+15,
            this.w,
            15
        );
        this.#pen.colour.fill = "#ffb900";
        this.#pen.text.draw(0-36, 0 - this.h/2+18, `🎨 Type:Image`);
        this.#pen.colour.fill = prevFill;
        this.#pen.colour.stroke = prevStroke;
        this.#pen.context.restore();
    }
    draw() {
        if (!this.complete) {
            return null;
        }

        const halfWidth=this.w/2;
        const halfHeight=this.h/2;
        const topRight={ x:this.x+halfWidth, y:this.y-halfHeight }
        const topLeft={ x:this.x-halfWidth, y:this.y-halfHeight }
        const bottomLeft={ x:this.x-halfWidth, y:this.y+halfHeight } 
        const bottomRight={ x:this.x+halfWidth, y:this.y+halfHeight } 


        if (this.#pen.debug) {
            const sizes={
                halfWidth:halfWidth,
                halfHeight:halfHeight,
                topRight:topRight,
                topLeft:topLeft,
                bottomLeft:bottomLeft,
                bottomRight:bottomRight
            }
            this.drawDebug(sizes);
            return "DEBUG MODE ACTIVE IN IMG";
        } else {

        this.#pen.context.save();
        this.#pen.context.translate(this.x, this.y);

        this.#pen.context.rotate(this.#pen.math.degreeToRadian(this.rotation));
        this.#pen.context.drawImage(this, 0-halfWidth, 0-halfHeight, this.w, this.h);

        this.#pen.context.restore();
        }
    }
    set x(value) {
        if (Number.isFinite(value)) {
            this.position.x = value;
            return this.position.x;
        }
    }
    set y(value) {
        if (Number.isFinite(value)) {
            this.position.y = value;
            return this.position.y;
        }
    }
    set w(value){
        if (Number.isFinite(value)) {
            this.#w=value;
            return this.#w
        }
        throw Error(`soz, w can only be set as a number, you gave me ${value}:${typeof value}`)
    }
    get w(){
        return this.#w
    }
    set h(value){
        if (Number.isFinite(value)) {
            this.#h=value;
            return this.#h
        }
        throw Error(`soz, h can only be set as a number, you gave me: ${value} of type ${typeof value}`)
    }
    get h(){
        return this.#h
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
}
