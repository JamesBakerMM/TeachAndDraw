const DEFAULT_ALIGNMENT = "center";

export class Shape {
    #xAlignment;
    #yAlignment;
    #pen;
    /**
     *
     * @param {Object} pen
     * @param {Colour} colour
     */
    
    constructor(pen) {
        this.xAlignOptions = new Set();
            this.xAlignOptions.add("center");
            this.xAlignOptions.add("left");
            this.xAlignOptions.add("right");
        this.yAlignOptions = new Set();
            this.yAlignOptions.add("center");
            this.yAlignOptions.add("top");
            this.yAlignOptions.add("bottom");
        this.#pen = pen;
        this.colour = pen.colour;
        this.#xAlignment = DEFAULT_ALIGNMENT;
        this.#yAlignment = DEFAULT_ALIGNMENT;
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    set alignment(value){
        throw Error("Shit");
    }

    /**
     * @param {String} value
     */
    set xAlignment(value){
        if (this.xAlignOptions.has(value)===false) {
            throw new Error(
                `Invalid value for alignment. You provided "${value}". Valid values are: ${[...this.xAlignOptions].join(", ")}`
            );
        }
        this.#xAlignment=value;
        return this.#xAlignment
    }

    get xAlignment(){
        return this.#xAlignment
    }

    /**
     * @param {String} value
     */
    set yAlignment(value){
        if (this.yAlignOptions.has(value)===false) {
            throw new Error(
                `Invalid value for alignment. You provided "${value}". Valid values are: ${[...this.yAlignOptions].join(", ")}`
            );
        }
        this.#yAlignment=value;
        return this.#yAlignment
    }

    get yAlignment(){
        return this.#yAlignment
    }


    /**
     * @param {number} value
     */
    set strokeWidth(value) {
        if (Number.isFinite(value)===false) {
            throw Error(`${value},type:${typeof value}`);
        }
        this.#pen.context.lineWidth = value;
        return this.#pen.context.lineWidth;
    }
    alignX(x,w){
        if(this.#xAlignment==="center"){  
            x=x-w/2;
        }
        if(this.#xAlignment==="right"){  
            x=x-w;
        }
        return x;
    }
    alignY(y,h){ 
        if(this.#yAlignment==="center"){
            y=y-h/2;
        }
        if(this.#yAlignment==="bottom"){
            y=y-h;
        }
        return y;
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @description draws a rectangle to the canvas at the given coords, default is x and y as the center of the rectange. H is an optional parameter.
     * @returns {boolean}
     */
    rectangle(x, y, w, h) {
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w) && Number.isFinite(h)) {
            if (h === undefined) { //if nothing passed for h, use width
                h = w;
            }

            x=this.alignX(x,w);
            y=this.alignY(y,h);
                    
            this.#pen.context.beginPath();
            this.#pen.context.rect(x, y, w, h);
            
            this.#pen.context.fill();
            this.#pen.context.stroke();
            return true;
        }
        //throw error
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {boolean}
     */
    oval(x, y, w, h) {
        if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w)) {
            if (h === undefined) {
                //if nothing passed for h, use width
                h = w;
            }
            this.#pen.context.beginPath();
            this.#pen.context.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
            this.#pen.context.fill();
            this.#pen.context.stroke();
            return true;
        }
        throw Error(`hey x:${x},y:${y} or w:${w} isn't a number`);
    }
    /**
     *
     * @param {number} xStart
     * @param {number} yStart
     * @param {number} xEnd
     * @param {number} yEnd
     */
    line(xStart, yStart, xEnd, yEnd) {
        this.#pen.context.beginPath();
        this.#pen.context.moveTo(xStart, yStart);
        this.#pen.context.lineTo(xEnd, yEnd);
        this.#pen.context.stroke();
    }
    /**
     *
     * @param  {...number} coords
     * @returns
     */
    multiline(...coords) {
        if (coords.length < 4 || coords.length % 2 !== 0) {
            throw Error("not enough coords");
        }
        //check all coords are numbers
        this.#pen.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#pen.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#pen.context.lineTo(adjustedX, adjustedY);
        }
        this.#pen.context.stroke();
    }
    /**
     *
     * @param  {...number} coords
     * @returns {boolean}
     */
    shape(...coords) {
        //confirm its an array at all

        if (coords.length < 6 || coords.length % 2 !== 0) {
            throw new Error(`incorrect number of coords, need to be at least 6 coords and pairs you gave: ${coords.length} coords, ${coords}`)
        }
        //check if all coords are numbers
        this.#pen.context.beginPath();
        let adjustedX = coords[0];
        let adjustedY = coords[1];
        this.#pen.context.moveTo(adjustedX, adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = coords[i];
            let adjustedY = coords[i + 1];
            this.#pen.context.lineTo(adjustedX, adjustedY);
        }
        this.#pen.context.closePath();
        this.#pen.context.fill();
        this.#pen.context.stroke();
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} startAngle
     * @param {number} endAngle
     */
    arc(x, y, w, h, startAngle, endAngle) {
        // Calculate the radius as the average of width and height
        const radius = Math.sqrt(w * w + h * h) / 2;
        const angleOffset = 90;
        const startAngleRadians = (startAngle - angleOffset) * (Math.PI / 180);
        const endAngleRadians = (endAngle - angleOffset) * (Math.PI / 180);

        this.#pen.context.beginPath();

        // Move to the center of the arc
        const xAdjusted = x;
        const yAdjusted = y;
        this.#pen.context.moveTo(xAdjusted, yAdjusted);

        // Draw arc
        this.#pen.context.arc(
            xAdjusted,
            yAdjusted,
            radius,
            startAngleRadians,
            endAngleRadians
        );

        // Draw line back to the center
        this.#pen.context.lineTo(xAdjusted, yAdjusted);

        this.#pen.context.stroke();
        this.#pen.context.fill();
    }
    
    isValidState(newState){
        //validates newState has the 4 parameters required and they they are valid
        // console.warn("isValidState not yet impelemtened")
        return true
    }
    set state(newState) {
        if (newState === undefined) {
            throw Error("undefined state given!");
        }
        if(this.isValidState(newState)===false){
            throw Error("invalid properties on given state!",newState)
        } 
        this.xAlignment = newState.xAlignment;
        this.yAlignment = newState.yAlignment;
    }
    get strokeWidth() {
        return this.#pen.context.lineWidth;
    }

}
