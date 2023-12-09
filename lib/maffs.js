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
    random(firstVal,secondVal) {
        // if(firstVal is array) {
            //return random val from array
        // }
        // else if(firstVal is object) {}
            //return a random key value pair?
        // 
    }
}