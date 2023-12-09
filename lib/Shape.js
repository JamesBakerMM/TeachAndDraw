export class Shape {
    /**
     *
     * @param {Object} context
     * @param {Colour} colour
     */
    constructor(context, colour) {
        this.context = context;
        this.colour = colour;
    }
    /**
     * @param {number} value 
     */
    set strokeWidth(value){
        if(Number.isFinite(value)){
            this.context.lineWidth=value;
            return this.context.lineWidth;
        }
        throw Error(`${value},type:${typeof value}`)
    } 
    /**
     * @param {Object} shape draw state
     */
    set state(newState) {
        if(newState===undefined){
            throw Error("undefined state given!");
        }
        //if newState is valid
        this.strokeWidth=newState.strokeWidth
        this.leftAlign=newState.leftAlign
        this.rightAlign=newState.rightAlign
        this.centerAlign=newState.centerAlign
    }
    get strokeWidth(){
        return this.context.lineWidth
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
        if(
            Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w)
        ) {
            if(h===undefined){
                //if nothing passed for h, use width
                h=w;
            }
            this.context.beginPath();
            const xAdjusted = this.context.space.x(x);
            const yAdjusted = this.context.space.y(y);
            this.context.rect(xAdjusted - w / 2, yAdjusted-h/2, w, h);
            this.context.fill();
            this.context.stroke();
            return true 
        }
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
        if(
            Number.isFinite(x) &&             
            Number.isFinite(y) &&
            Number.isFinite(w)
        ) {
            if(h===undefined){
                //if nothing passed for h, use width
                h=w;
            }
            this.context.beginPath();
            const xAdjusted = this.context.space.x(x);
            const yAdjusted = this.context.space.y(y);
            this.context.ellipse(xAdjusted, yAdjusted, w, h, 0, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke();
            return true
        }
        throw Error(`hey x:${x},y:${y} or w:${w} isn't a number`)
    }
    /**
     * 
     * @param {number} xStart 
     * @param {number} yStart 
     * @param {number} xEnd 
     * @param {number} yEnd 
     */
    line(xStart, yStart, xEnd, yEnd) {
        const xStartAdjusted = this.context.space.x(xStart);
        const yStartAdjusted = this.context.space.y(yStart);
        const xEndAdjusted = this.context.space.x(xEnd);
        const yEndAdjusted = this.context.space.y(yEnd);
 
        this.context.beginPath();
        this.context.moveTo(xStartAdjusted, yStartAdjusted);
        this.context.lineTo(xEndAdjusted, yEndAdjusted);
        this.context.stroke();
    }
    /**
     * 
     * @param  {...number} coords 
     * @returns 
     */
    multiline(...coords) {
        if (coords.length < 4 || coords.length % 2 !== 0) {
            throw Error("not enough coords");
            return false; // Need pairs of coordinates
        }
        //check all coords are numbers
        this.context.beginPath();
        let adjustedX = this.context.space.x(coords[0]);
        let adjustedY = this.context.space.y(coords[1]);
        this.context.moveTo(adjustedX,adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = this.context.space.x(coords[i]);
            let adjustedY = this.context.space.y(coords[i+1]);
            this.context.lineTo(adjustedX, adjustedY);
        }
        this.context.stroke();
    }
    /**
     * 
     * @param  {...number} coords 
     * @returns {boolean}
     */
    shape(...coords) {
        if (coords.length < 6 || coords.length % 2 !== 0) {
            console.error("not enough coords");
            return false; // Need at least three pairs of coordinates
        }
        //check if all coords are numbers
        this.context.beginPath();
        let adjustedX = this.context.space.x(coords[0]);
        let adjustedY = this.context.space.y(coords[1]);
        this.context.moveTo(adjustedX,adjustedY);
        for (let i = 2; i < coords.length; i += 2) {
            let adjustedX = this.context.space.x(coords[i]);
            let adjustedY = this.context.space.y(coords[i+1]);
            this.context.lineTo(adjustedX, adjustedY);
        }
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
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
        const angleOffset=0;
        const startAngleRadians =(startAngle-angleOffset) * (Math.PI / 180);
        const endAngleRadians =(endAngle-angleOffset) * (Math.PI / 180);
    
        this.context.beginPath();
    
        // Move to the center of the arc
        const xAdjusted = this.context.space.x(x);
        const yAdjusted = this.context.space.y(y);
        this.context.moveTo(xAdjusted, yAdjusted);
    
        // Draw arc
        this.context.arc(xAdjusted, yAdjusted, radius, startAngleRadians, endAngleRadians);
    
        // Draw line back to the center
        this.context.lineTo(xAdjusted, yAdjusted);
    
        this.context.stroke();
        this.context.fill();
    }
}