import { InputDevice } from "./InputDevice.js";
import { Tad } from "./TeachAndDraw.js";
import { Vector } from "./Vector.js";


const MIN_SWIPE_DIST = 150;


export class Touch extends InputDevice {

    startX = 0;
    startY = 0;
    prevX  = 0;
    prevY  = 0;
    endX  = 0;
    endY  = 0;
    dragX = 0;
    dragY = 0;

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
                this.endX = tmp.x;
                this.endY = tmp.y;
            }
        );

        this.tad.canvas.addEventListener(
            "touchmove",
            (/** @type {TouchEvent} */ event) => {
                event.preventDefault();
                this.down = true;

                const tmp = Vector.temp(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

                this.prevX = this.endX;
                this.prevY = this.endY;
                this.endX = tmp.x;
                this.endY = tmp.y;
                this.dragX = this.endX - this.prevX;
                this.dragY = this.endY - this.prevY;

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
            
                const dist = this.tad.math.distance(this.startX, this.startY, this.endX, this.endY);
                if (dist > MIN_SWIPE_DIST) {
                    const dx = Math.abs(this.endX - this.startX);
                    const dy = Math.abs(this.endY - this.startY);
                    this.swipedLeft  = (dx > dy) && (this.endX < this.startX);
                    this.swipedRight = (dx > dy) && (this.startX < this.endX);
                    this.swipedUp    = (dy > dx) && (this.endY < this.startY);
                    this.swipedDown  = (dy > dx) && (this.startY < this.endY);
                }

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
        this.dragX = 0;
        this.dragY = 0;
        this.swipedLeft  = false;
        this.swipedRight = false;
        this.swipedUp    = false;
        this.swipedDown  = false;
    
        if (this.released)
        {

                this.prevX = this.endX;
                this.prevY = this.endY;
                this.startX = this.endX;
                this.startY = this.endY;
        }
    }

    get x() {
        return this.endX;
    }
    get y() {
        return this.endY;
    }
}

