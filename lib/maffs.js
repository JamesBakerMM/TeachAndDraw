export class Maffs {
    constructor(context) {
        this.context = context;
    }
    isNum(value){
        if(Number.isFinite(value)===false){
            throw Error("given value is not a finite number!");
        }
    }
    degreeToRadian(value) {
        return value * (Math.PI / 180);
    }
    radianToDegree(value) {
        this.isNum(value);
        return value * (180 / Math.PI);
    }
    //set up of sin,cos, tan etc using degrees

    sin(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.sin(angle);
    }

    cos(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.cos(angle);
    }

    tan(value) {
        this.isNum(value);
        let angle = this.degreeToRadian(value);
        return Math.tan(angle);
    }
    atan(value) {
        this.isNum(value);
        let angleRadians = Math.atan(value);
        return this.radianToDegree(angleRadians);
    }
    atan2(x,y) {
        this.isNum(x);
        this.isNum(y);
        let angleRadians = Math.atan2(y, x);
        return this.radianToDegree(angleRadians);
    }
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

        // 
    }
}