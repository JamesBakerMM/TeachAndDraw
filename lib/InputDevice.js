/**
 * used as a parent class for all input related code
 */
export class InputDevice {
    constructor(pen) {
        this.pen = pen;
        this.initEventListeners();
        this.storageBuffer = [];
        this.activeBuffer = [];
    } 
    initEventListeners() {}
    draw(){}
    store(event){
        this.storageBuffer.push(event);
    }

    endOfFrame() {
        this.activeBuffer = this.storageBuffer;
        this.storageBuffer = [];
    }

}

