export class Maffs {
    constructor(context) {
        this.context = context;
    }
    /**
     * 
     * @param {number} value 
     */
    isNum(value){
        if(Number.isFinite(value)===false){
            throw Error("given value is not a finite number!");
        }
    }
    /**
     * 
     * @param {number} value 
     * @returns 
     */
    degreeToRadian(value) {
        return value * (Math.PI / 180);
    }
    /**
     * 
     * @param {number} value 
     * @returns 
     */
    radianToDegree(value) {
        this.isNum(value);
        return value * (180 / Math.PI);
    }
    //set up of sin,cos, tan etc using degrees

    /**
     * 
     * @param {number} value 
     * @returns 
     */
    sin(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.sin(angle);
    }

    /**
     * 
     * @param {number} value 
     * @returns 
     */
    cos(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.cos(angle);
    }

    /**
     * 
     * @param {number} value 
     * @returns 
     */
    tan(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.tan(angle);
    }
    /**
     * 
     * @param {number} value 
     * @returns 
     */
    atan(value) {
        this.isNum(value);
        let angleRadians = Math.atan(value);
        return this.radianToDegree(angleRadians);
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    atan2(x,y) {
        this.isNum(x);
        this.isNum(y);
        let angleRadians = Math.atan2(y, x);
        return this.radianToDegree(angleRadians);
    }
    /**
     * 
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @returns 
     */
    dist(x1,y1,x2,y2){
        this.isNum(x1);
        this.isNum(y1);
        this.isNum(x2);
        this.isNum(y2);
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    random(firstVal, secondVal) {
        // Guard clauses for input validation
        this.isNum(firstVal);
    
        if (secondVal === undefined) {
            // If secondVal is not provided, return a random number from 0 to firstVal
            return Math.random() * firstVal;
        }
    
        this.isNum(secondVal);
    
        if (firstVal > secondVal) {
            throw Error("firstVal must be less than or equal to secondVal");
        }
       return Math.random() * (secondVal - firstVal) + firstVal;
    }/**
    * Re-maps a number from one range to another.
    *
    * @param {number} num - The number to re-map.
    * @param {number} in_min - The lower bound of the number's current range.
    * @param {number} in_max - The upper bound of the number's current range.
    * @param {number} out_min - The lower bound of the number's target range.
    * @param {number} out_max - The upper bound of the number's target range.
    * @returns {number} The re-mapped number.
    */
    rescaleNumber(num, in_min, in_max, out_min, out_max) {
        this.isNum(num);
        this.isNum(in_min);
        this.isNum(in_max);
        this.isNum(out_min);
        this.isNum(out_max);

        if (in_max - in_min === 0) {
            throw new Error("Input range cannot be zero.");
        }

        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    
}