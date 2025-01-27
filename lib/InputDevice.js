/**
 * used as a parent class for all input related code
 */

import { Tad } from "./TeachAndDraw.js";

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
     * @param {Tad} tad
     */
    constructor(tad) {
        this.tad = tad;
        this.initEventListeners();
        this.storageBuffer = [];
        this.activeBuffer = [];
    }

    /**
     * internal
     * private_internal
     */
    initEventListeners() {}

    draw() {}
    /**
     *
     * @param {Event} event
     * private_internal
     */
    store(event) {
        this.storageBuffer.push(event);
    }

    /**
     * internal
     * private_internal
     */
    endOfFrame() {
        this.activeBuffer = this.storageBuffer;
        this.storageBuffer = [];
    }
}
