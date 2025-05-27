import { InputDevice } from "./InputDevice.js";
import { Tad } from "./TeachAndDraw.js";
import { Vector } from "./Vector.js";


const MIN_SWIPE_DIST = 150;


export class Touch extends InputDevice {

    startX = 0;
    startY = 0;
    prevX  = 0;
    prevY  = 0;
    currX  = 0;
    currY  = 0;
    motionX = 0;
    motionY = 0;

    dragged     = false;
    swipedLeft  = false;
    swipedRight = false;
    swipedUp    = false;
    swipedDown  = false;

    /**
     *
     * @param {Tad} tad
     */
    constructor(tad) {
        super(tad);
        this.tad = tad;
        this.down = false;
        this.released = false;
        this.dragged = false;

        Object.preventExtensions(this); //protect against accidental assignment;
    }

    initEventListeners() {
        this.tad.canvas.addEventListener(
            "touchstart",
            (/** @type {TouchEvent} */ event) => {
                event.preventDefault();
                this.down = true;
                this.released = false;
            
                const tmp = Vector.temp(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                // const tmp = this.tad.camera.screenToWorld(
                //     event.touches[0].clientX, event.touches[0].clientY
                // );

                this.startX = tmp.x;
                this.startY = tmp.y;
                this.prevX = tmp.x;
                this.prevY = tmp.y;
                this.currX = tmp.x;
                this.currY = tmp.y;
            }
        );

        this.tad.canvas.addEventListener(
            "touchmove",
            (/** @type {TouchEvent} */ event) => {
                event.preventDefault();
                this.down = true;

                const tmp = Vector.temp(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = tmp.x;
                this.currY = tmp.y;
                this.motionX = this.currX - this.prevX;
                this.motionY = this.currY - this.prevY;

                if (event.touches.length == 2) {

                }
            }
        );

        this.tad.canvas.addEventListener(
            "touchend",
            (/** @type {TouchEvent} */ event) => {
                event.preventDefault();
                this.down = false;
                this.released = true;
                this.dragged = false;
            
                const dist = this.tad.math.distance(this.startX, this.startY, this.currX, this.currY);
                if (dist > MIN_SWIPE_DIST) {
                    const dx = Math.abs(this.currX - this.startX);
                    const dy = Math.abs(this.currY - this.startY);
                    this.swipedLeft  = (dx > 2*dy) && (this.currX < this.startX);
                    this.swipedRight = (dx > 2*dy) && (this.startX < this.currX);
                    this.swipedUp    = (dy > 2*dx) && (this.currY < this.startY);
                    this.swipedDown  = (dy > 2*dx) && (this.startY < this.currY);
                }

                this.prevX = this.currX;
                this.prevY = this.currY;
                this.startX = this.currX;
                this.startY = this.currY;
            }
        );
    }

    draw() {
        if (this.tad.debug) {
            //Debug.drawMouse(this.tad,this);
        }
        this.endOfFrame();
    }

    endOfFrame() {
        super.endOfFrame();
        this.motionX = 0;
        this.motionY = 0;
        this.swipedLeft  = false;
        this.swipedRight = false;
        this.swipedUp    = false;
        this.swipedDown  = false;
    }

    get x() {
        return this.currX;
    }
    get y() {
        return this.currY;
    }
}

