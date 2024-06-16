import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Point } from "./Point.js";
import { Velocity } from "./Velocity.js";
import { Animation } from "./Animation.js";
import { Id } from "./Id.js";
import { Paint } from "./Paint.js";
import { Flip } from "./Flip.js";

export class Entity {
    static all = null;
    #assets;
    #acceleration;
    #rotation;
    #direction;
    #speed;
    #collider;
    #pen;
    #fill;
    constructor(pen, x, y) {
        this.id = Id.getId();
        this.#pen = pen;
        /**
         * @private
         */
        this.exists = true;
        this.position = new Point(pen, x, y);
        this.positionPrevious = new Point(
            pen,
            this.position.x,
            this.position.y
        );
        this.velocity = new Velocity(0, 0);
        this.movedByCamera = true;
        this.#acceleration = 1; //change how this works
        this.#direction = pen.math.adjustDegressSoTopIsZero(0);
        this.#speed = 0;
        this.#rotation = pen.math.adjustDegressSoTopIsZero(0);
        this.#collider = null;
        this.#assets = [];
        this.groupsOwnedBy = [];
        //entity.all is initiated in setup, this is a backup that fires for situations with no canvas
        if (!Entity.all) {
            //this is for circumvention of hoisting order issue
            Entity.all = [];
        }
        Entity.all.push(this);

        const approvedColors = [
            Paint.white,
            Paint.palegreen,
            Paint.green,
            Paint.darkgreen,
            Paint.paleblue,
            Paint.blue,
            Paint.darkblue,
            Paint.palered,
            Paint.red,
            Paint.darkred,
            Paint.palepurple,
            Paint.purple,
            Paint.darkpurple,
            Paint.paleaqua,
            Paint.aqua,
            Paint.darkaqua,
            Paint.palepink,
            Paint.pink,
            Paint.darkpink,
            Paint.paleyellow,
            Paint.yellow,
            Paint.darkyellow,
            Paint.palebrown,
            Paint.brown,
            Paint.darkbrown,
            Paint.paleorange,
            Paint.orange,
            Paint.darkorange,
        ];
        this.hadColourAssigned = false;
        this.#fill = approvedColors[Math.floor(Math.random() * approvedColors.length)];
    }
    set _fillWithoutTrackingAssignment(value){
        if(!this.#pen.colour.isValid(value)){
            throw Error("meant to be a colour buddy");
        }
        this.#fill = value;
    }
    set fill(value) {
        if(!this.#pen.colour.isValid(value)){
            throw Error("meant to be a colour buddy");
        }
        this.hadColourAssigned = true;
        this.#fill = value;
    }
    get fill() {
        return this.#fill
    }
    set speed(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Speed must be a valid number."
                )
            );
        }
        this.#speed = value;
        this.velocity.x = this.#pen.math.cos(this.#direction) * this.#speed;
        this.velocity.y = this.#pen.math.sin(this.#direction) * this.#speed;
        return this.#speed;
    }
    get speed() {
        return this.#speed;
    }
    set direction(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Direction must be a valid number."
                )
            );
        }
        this.#direction = this.#pen.math.adjustDegressSoTopIsZero(value);
        const adjustedDegree = this.#direction;
        this.velocity.x = this.#pen.math.cos(adjustedDegree) * this.#speed;
        this.velocity.y = this.#pen.math.sin(adjustedDegree) * this.#speed;
        return this.#direction;
    }
    get direction() {
        const degreeReadjustedValue = this.#pen.math.unadjustDegreesFromZero(
            this.#direction
        );
        return degreeReadjustedValue;
    }
    hasAsset() {
        return this.#assets.length > 0;
    }
    drawAssets() {
        for (let i = 0; i < this.#assets.length; i++) {
            this.#assets[i].x = this.x;
            this.#assets[i].y = this.y;
            this.#assets[i]._draw(this.x, this.y, this.rotation);
        }
    }
    draw() {
        if (this.exists === false) {
            return;
        }
        this.#pen.state.save();

        this.#pen.colour.fill = this.fill;
        this.#pen.colour.stroke = "white";
        this.#pen.shape.strokeDash = 3;
        this.#pen.shape.oval(this.x, this.y, 10);

        if (this.hasAsset()) {
            this.drawAssets();
        }
        this.#pen.state.load();
    }
    set asset(value) {
        if (value === undefined) {
            throw Error(
                `You need to provide an Image or an Animation! You provided undefined :(`
            );
        }
        //check if its a group as that'd be a common brainfart
        this.#assets = []; //clear old assets, since only one right now

        if (value.type === "animation") {
            //change this over to a .clone method in animation so its consistent with imgWrapper
            const nuAnimWrapper = new Animation(
                this.x,
                this.y,
                this.#pen,
                ...value
            );
            nuAnimWrapper.delay = value.delay;
            nuAnimWrapper.looping = value.looping;
            nuAnimWrapper.playing = value.playing;
            nuAnimWrapper.rotation = value.rotation;
            nuAnimWrapper.frame = value.frame;
            //update all the props to match, do this manually to avoid silly behaviours
            this.#assets.push(nuAnimWrapper);
        }
        if (value.type === "image") {
            //added clone method to circumvent hoisting issue
            const nuImgWrapper = value.clone(
                value.x,
                value.y,
                value.data,
                this.#pen
            );
            nuImgWrapper.w = value.w;
            nuImgWrapper.h = value.h;
            this.#assets.push(nuImgWrapper);
        }
    }
    get asset() {
        return this.#assets[0]; //currently hardcoded using an array for future extensibility
    }
    set rotation(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Rotation for entity needs to be a number!"
                )
            );
        }
        const degreeAdjustedValue =
            this.#pen.math.adjustDegressSoTopIsZero(value);
        this.#rotation = degreeAdjustedValue;
        for (let i = 0; i < this.#assets.length; i++) {
            this.#assets[i].rotation = degreeAdjustedValue;
        }
        return this.#rotation;
    }

    /**
     * returns the internal rotation
     *
     * @returns {number} The current width.
     */
    get rotation() {
        const degreeReadjustedValue = this.#pen.math.unadjustDegreesFromZero(
            this.#rotation
        );
        return degreeReadjustedValue;
    }
    remove() {
        this.exists = false;
        this.position.x = 0;
        this.position.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    set _trueX(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.positionPrevious.x = this.position.x;
        this.position.x = value;
        return this.position.x;
    }
    get _trueX() {
        return this.position.x;
    }
    set _trueY(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.positionPrevious.y = this.position.y;
        this.position.y = value;
        return this.position.y;
    }
    get _trueY() {
        return this.position.y;
    }
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        if (this.movedByCamera) {
            this.positionPrevious.x = this.position.x;
            this.position.x = value - this.#pen.camera.xOffset;
            return this.position.x;
        }
        this.positionPrevious.x = this.position.x;
        this.position.x = value;
        return this.position.x;
    }
    get x() {
        if (this.movedByCamera) {
            return this.position.x + this.#pen.camera.xOffset;
        }
        return this.position.x;
    }
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `y has to be a number! you gave ${value}:${typeof value}`
            );
        }
        if (this.movedByCamera) {
            this.positionPrevious.y = this.position.y;
            this.position.y = value - this.#pen.camera.yOffset;
            //remove the camera offset from the value so it's cleaned up for setting
            return this.position.y;
        }
        this.positionPrevious.y = this.position.y;
        this.position.y = value;
        return this.position.y;
    }
    get y() {
        if (this.movedByCamera) {
            return this.position.y + this.#pen.camera.yOffset;
        }
        return this.position.y;
    }
    move() {
        if (this.exists === false) {
            return;
        }

        if (this.velocity.x != 0) {
            this.x +=
                this.velocity.x *
                this.#pen.time.timeMultiplier *
                this.#pen.fractionOfMovement;
        }
        if (this.velocity.y != 0) {
            this.y +=
                this.velocity.y *
                this.#pen.time.timeMultiplier *
                this.#pen.fractionOfMovement;
        }

        if (this.#acceleration !== 1) {
            this.velocity._perfX = this.#formatNumber(
                this.#acceleration * this.velocity.x
            );
            this.velocity._perfY = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
        }
    }
    #formatNumber(num) {
        if (Math.abs(num) > 0.009) {
            return parseFloat(num.toFixed(3));
        } else {
            return 0;
        }
    }
}

export class ShapedAssetEntity extends Entity {
    #w;
    #h;
    #radius;
    #assets;
    constructor(pen, x, y, w, h) {
        super(pen, x, y);
        this.#w = w;
        this.#h = h;
        this.#updateRadius(this.#w, this.#h);
        this.#assets = [];
    }
    set w(value) {
        if (Number.isFinite(value) && value > 0) {
            this.#w = value;
            this.#updateRadius(this.#w, this.#h);
            if (this.#assets) {
                this.#assets.w = value;
            }
            return this.#w;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(
                value,
                "w has to be a number and above 0"
            )
        );
    }
    get w() {
        return this.#w;
    }
    set h(value) {
        if (Number.isFinite(value) && value > 0) {
            this.#h = value;
            this.#updateRadius(this.#w, this.#h);
            if (this.#assets) {
                this.#assets.h = value;
            }
            return this.#h;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(
                value,
                "h has to be a number and above 0"
            )
        );
    }
    get h() {
        return this.#h;
    }
    get radius() {
        return this.#radius;
    }
    get top() {
        return this.y - this.#h / 2;
    }

    get bottom() {
        return this.y + this.#h / 2;
    }

    get left() {
        return this.x - this.#w / 2;
    }

    get right() {
        return this.x + this.#w / 2;
    }
    #updateRadius(width, height) {
        this.#radius = Math.sqrt(
            Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
        );
        return this.#radius;
    }
    remove() {
        super.remove();
        for(let asset of this.#assets){
            if(asset){
                asset.remove();
            }
        }
        this.#w = 1;
        this.#h = 1;
    }
}
