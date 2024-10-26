import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Point } from "./Point.js";
import { Velocity } from "./Velocity.js";
import { Id } from "./Id.js";
import { Paint } from "./Paint.js";
import { Flip } from "./Flip.js";
import { Pen } from "./Pen.js";
import { Collider } from "./Collider.js";
/**
 * Represents an entity on the canvas that can be drawn and interacted with.
 */
export class Entity {
    static all = [];
    #assets;
    #acceleration;
    #rotation;
    #assetOffset;
    #direction;
    #speed;
    #collider;
    #pen;
    #fill;
    exists;
    /**
     * Creates an entity.
     * @param {Pen} pen
     * @param {number} x
     * @param {number} y
     * @throws {Error} If the pen is not a Pen object.
     * @throws {Error} If the x or y values are not numbers.
     * @property {Point} position - The current position of the entity.
     * @property {Velocity} velocity - The current velocity of the entity.
     * @property {boolean} movedByCamera - True if the entity is moved by the camera.
     * @property {number} rotationalVelocity - The rotational velocity of the entity.
     * @property {Collider} collider - The collider of the entity.
     * @property {Entity[]} groupsOwnedBy - The groups owned by the entity.
     * @property {string} fill - The fill colour of the entity.
     * @property {number} speed - The speed of the entity.
     * @property {number} direction - The direction of the entity.
     * @property {number} rotation - The rotation of the entity.
     * @property {number} x - The x-coordinate of the centre of the entity.
     * @property {number} y - The y-coordinate of the centre of the entity.
     * @constructor
     */
    constructor(pen, x, y) {
        if(Number.isFinite(pen)){
            throw new Error("sjkhdfs")
        }
        this.id = Id.getId();
        this.#pen = pen;
        this.exists = true;
        this.position = new Point(pen, x, y);
        this.#assetOffset = {
            x:0,
            y:0
        };
        this.velocity = new Velocity(0, 0);
        this.movedByCamera = true;
        this.#acceleration = 1; //change how this works
        this.#direction = this.#pen.math.adjustDegressSoTopIsZero(0);
        this.#speed = 0;
        this.#rotation = this.#pen.math.adjustDegressSoTopIsZero(0);
        this.rotationalVelocity = 0;
        this.#collider = null;
        this.#assets = [];
        this.groupsOwnedBy = [];
        //entity.all is initiated in setup, this is a backup that fires for situations with no canvas
        if (!Entity.all) {
            //this is for circumvention of hoisting order issue
            Entity.all = makeGroup();
            Entity.all.name = "Entity.all";
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
        this.#fill =
            approvedColors[Math.floor(Math.random() * approvedColors.length)];
    }

    set xOffset(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "xOffset must be a number"
                )
            );
        }
        this.#assetOffset.x=value;
    }
    get xOffset() {
        return this.#assetOffset.x;
    }
    
    set yOffset(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "yOffset must be a number"
                )
            );
        }
        this.#assetOffset.y=value;
    }
    get yOffset() {
        return this.#assetOffset.y;
    }
    /**
     * Fill colour of the entity.
     * internal
     * @param {string} value
     * @throws {Error} If the value is not a valid colour.
     */
    set _fillWithoutTrackingAssignment(value) {
        if (!this.#pen.colour.isValid(value)) {
            throw Error("meant to be a colour buddy");
        }
        this.#fill = value;
    }

    /**
     * Fill colour of the entity.
     * @param {string} value
     * @throws {Error} If the value is not a valid colour.
     */
    set fill(value) {
        if (!this.#pen.colour.isValid(value)) {
            throw Error(ErrorMsgManager.colourCheckFailed(value));
        }
        this.hadColourAssigned = true;
        this.#fill = value;
    }

    /**
     * Returns the colour that the entity has been filled with.
     * @returns {string} The fill colour of the entity.
     */
    get fill() {
        return this.#fill;
    }

    /**
     * Sets the speed of an entity.
     * @param {number} value - The speed of the entity.
     * @throws {Error} If the value is not a number.
     */
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
    }

    /**
     * Returns the current speed of the entity.
     * @returns {number} The speed of the entity.
     */
    get speed() {
        // calculate the speed back from the current velocity x and y
        this.#speed = Math.hypot(this.velocity.x, this.velocity.y);
        return Math.hypot(this.velocity.x, this.velocity.y);
    }

    /**
     * Sets the direction of the entity.
     * @param {number} value - The direction of the entity.
     * @throws {Error} If the value is not a number.
     */
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
    }

    /**
     * Returns the current direction of the entity.
     * @returns {number} The direction of the entity.
     */
    get direction() {
        const degreeReadjustedValue = this.#pen.math.unadjustDegreesFromZero(
            this.#direction
        );
        return degreeReadjustedValue;
    }

    /**
     * Finds the angle between the entity and a given point.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {number} The angle between the entity and the point.
     */
    getAngleToPoint(x, y) {
        return $.math.adjustDegressSoTopIsZero(
            $.math.atan2(this.y - y, this.x - x)
        );
    }

    /**
     * internal
     * private_internal
     */
    hasAsset() {
        return this.#assets.length > 0;
    }

    /**
     * internal
     * private_internal
     */
    drawAssets() {
        for (let i = 0; i < this.#assets.length; i++) {
            this.#assets[i].x = this.x;
            this.#assets[i].y = this.y;
            this.#assets[i]._draw(this.x+this.xOffset, this.y+this.yOffset, this.rotation);
        }
    }

    /**
     * internal
     * private_internal
     */
    _draw(x = 0, y = 0, rotation = 0) {
        this.draw();
    }

    /**
     * Draws the entity to the screen using its current .x and .y properties
     *
     */
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

    /**
     * Attach a given image as an asset of this collider.
     * @param {Stamp} value - The image to attach.
     */
    set asset(value) {
        if (value === undefined) {
            throw Error(
                `You need to provide an Image or an Animation! You provided undefined :(`
            );
        }
        for (let asset of this.#assets) {
            //remove the cloned asset wrappers currently attached
            asset.remove();
        }
        //check if its a group as that'd be a common brainfart
        this.#assets = []; //clear old assets, since only one right now

        if (value.type === "animation") {
            //change this over to a .clone method in animation so its consistent with imgWrapper
            const nuAnimWrapper = value.clone(
                this.#pen,
                this.x,
                this.y,
                value.frames
            );
            this.#assets.push(nuAnimWrapper);
            // nuAnimWrapper.delay = value.delay;
            // nuAnimWrapper.looping = value.looping;
            // nuAnimWrapper.playing = value.playing;
            // nuAnimWrapper.rotation = value.rotation;
            // nuAnimWrapper.frame = value.frame;
            //update all the props to match, do this manually to avoid silly behaviours
            // this.#assets.push(nuAnimWrapper);
        }
        if (value.type === "image") {
            //added clone method to circumvent hoisting issue
            const nuImgWrapper = value.clone(
                this.#pen,
                value.x,
                value.y,
                value.data
            );
            nuImgWrapper.w = value.w;
            nuImgWrapper.h = value.h;
            this.#assets.push(nuImgWrapper);
        }
    }

    /**
     * Returns the asset of the entity.
     * @returns {Stamp} The asset of the entity.
     */
    get asset() {
        return this.#assets[0]; //currently hardcoded using an array for future extensibility
    }

    /**
     * Sets the rotation of the entity.
     * @param {number} value - The rotation of the entity.
     * @throws {Error} If the value is not a number.
     */
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
    }

    /**
     * returns the internal rotation of the entity.
     * @returns {number} The current width.
     */
    get rotation() {
        const degreeReadjustedValue = this.#pen.math.unadjustDegreesFromZero(
            this.#rotation
        );
        return degreeReadjustedValue;
    }

    /**
     * Removes the entity from the canvas.
     */
    remove() {
        this.exists = false;
        this.position.x = 0;
        this.position.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.rotationalVelocity = 0;
    }

    /**
     * internal
     * private_internal
     */
    set _trueX(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.position.x = value;
    }

    /**
     * internal
     * private_internal
     */
    get _trueX() {
        return this.position.x;
    }

    /**
     * internal
     * private_internal
     */
    set _trueY(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        this.position.y = value;
        return;
    }

    /**
     * internal
     * private_internal
     */
    get _trueY() {
        return this.position.y;
    }

    /**
     * Sets the x-coordinate of the entity.
     * @param {number} value - The x-coordinate of the entity.
     * @throws {Error} If the value is not a number.
     */
    set x(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `x has to be a number! you gave ${value}:${typeof value}`
            );
        }
        if (this.movedByCamera) {
            this.position.x = value - this.#pen.camera.xOffset;
            return;
        }
        this.position.x = value;
        return;
    }

    /**
     * Returns the x-coordinate of the centre of the entity.
     * @returns {number} The x-coordinate of the centre of the entity.
     */
    get x() {
        if (this.movedByCamera) {
            return this.position.x + this.#pen.camera.xOffset;
        }
        return this.position.x;
    }

    /**
     * Sets the y-coordinate of the entity.
     * @param {number} value - The y-coordinate of the entity.
     * @throws {Error} If the value is not a number.
     */
    set y(value) {
        if (Number.isFinite(value) === false) {
            throw Error(
                `y has to be a number! you gave ${value}:${typeof value}`
            );
        }
        if (this.movedByCamera) {
            this.position.y = value - this.#pen.camera.yOffset;
            //remove the camera offset from the value so it's cleaned up for setting
            return;
        }
        this.position.y = value;
        return;
    }

    /**
     * Returns the y-coordinate of the centre of the entity.
     * @returns {number} The y-coordinate of the centre of the entity.
     */
    get y() {
        if (this.movedByCamera) {
            return this.position.y + this.#pen.camera.yOffset;
        }
        return this.position.y;
    }

    /**
     * internal
     * private_internal
     */
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
        if (this.rotationalVelocity != 0) {
            this.rotation +=
                this.rotationalVelocity *
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

    /**
     * @param {number} num
     * private_internal
     * @returns {number}
     */
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
    /**
     * Creates an instance of ShapedAssetEntity.
     * @param {Pen} pen
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @constructor
     */
    constructor(pen, x, y, w, h) {
        super(pen, x, y);
        this.radius = 0;
        this.#w = w;
        this.#h = h;
        this.updateRadius(this.#w, this.#h);
        this.#assets = [];
    }

    /**
     * Sets the width of the entity.
     * @param {number} value - The width of the entity.
     * @throws {Error} If the value is not a number or is less than or equal to 0.
     */
    set w(value) {
        if (Number.isFinite(value) && value > 0) {
            this.#w = value;
            this.updateRadius(this.#w, this.#h);
            if (this.#assets) {
                this.#assets.w = value;
            }
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(
                value,
                "w has to be a number and above 0"
            )
        );
    }

    /**
     * Returns the width of the entity.
     * @returns {number} The width of the entity.
     */
    get w() {
        return this.#w;
    }

    /**
     * Sets the height of the entity.
     * @param {number} value - The height of the entity.
     * @throws {Error} If the value is not a number or is less than or equal to 0.
     * @returns {number} The height of the entity.
     */
    set h(value) {
        if (Number.isFinite(value) && value > 0) {
            this.#h = value;
            this.#radius = this.updateRadius(this.#w, this.#h);
            if (this.#assets) {
                this.#assets.h = value;
            }
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(
                value,
                "h has to be a number and above 0"
            )
        );
    }

    /**
     * Returns the height of the entity.
     * @returns {number} The height of the entity.
     */
    get h() {
        return this.#h;
    }

    /**
     * Return the top-most y-coordinate of the entity.
     * @returns {number} The top-most y-coordinate of the entity.
     */
    get top() {
        return this.y - this.#h / 2;
    }

    /**
     * Returns the bottom-most y-coordinate of the entity.
     * @returns {number} The bottom-most y-coordinate of the entity.
     */
    get bottom() {
        return this.y + this.#h / 2;
    }

    /**
     * Returns the left-most x-coordinate of the entity.
     * @returns {number} The left-most x-coordinate of the entity.
     */
    get left() {
        return this.x - this.#w / 2;
    }

    /**
     * Returns the right-most x-coordinate of the entity.
     * @returns {number} The right-most x-coordinate of the entity.
     */
    get right() {
        return this.x + this.#w / 2;
    }

    /**
     * Updates the radius of the entity.
     * @param {number} width
     * @param {number} height
     * private_internal
     * @returns {number}
     */
    updateRadius(width, height) {
        this.#radius = this.w / 2;
        return this.#radius;
    }

    /**
     * internal
     * private_internal
     */
    remove() {
        super.remove();
        for (let asset of this.#assets) {
            if (asset) {
                asset.remove();
            }
        }
        this.#w = 1;
        this.#h = 1;
    }
}
