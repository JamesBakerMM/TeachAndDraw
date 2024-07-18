/**
 * used as a parent class for all input related code
 */

import {Pen} from "./Pen.js";

/**
 * @class
 */
export class InputDevice {
    /**
     * @type {Event[]} Buffer to store eveents before processing
     */
    storageBuffer;
    /**
     * @type {Event[]} Buffer containing events being processed for the frame
     */
    activeBuffer;
    /**
     * 
     * @param {Pen} pen 
     */
    constructor(pen) {
        this.pen = pen;
        this.initEventListeners();
        this.storageBuffer = [];
        this.activeBuffer = [];
    } 
    initEventListeners() {}
    draw(){}
    /**
     * 
     * @param {Event} event 
     */
    store(event){
        this.storageBuffer.push(event);
    }

    endOfFrame() {
        this.activeBuffer = this.storageBuffer;
        this.storageBuffer = [];
    }

}

