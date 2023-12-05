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
    multiline(...coords) {
        if (coords.length < 4 || coords.length % 2 !== 0) {
            console.error("not enough coords");
            return false; // Need pairs of coordinates
        }
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

    shape(...coords) {
        if (coords.length < 6 || coords.length % 2 !== 0) {
            console.error("not enough coords");
            return false; // Need at least three pairs of coordinates
        }
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

    arc(x, y, w, h, startAngle, endAngle) {
        // Calculate the radius as the average of width and height
        const radius = Math.sqrt(w * w + h * h) / 2;
        this.context.beginPath();
        const xAdjusted = this.context.space.x(x);
        const yAdjusted = this.context.space.y(y);
        this.context.arc(xAdjusted, yAdjusted, radius, startAngle, endAngle);
        this.context.stroke();
    }
    loadImageFile(filepath) {}
    image(x, y, img, size = 100) {}
    loadTextFile(filepath) {}
}