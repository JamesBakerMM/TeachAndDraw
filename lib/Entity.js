import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { makeExtra } from "./Extra.js";
import { Point } from "./Point.js";
import { Velocity } from "./Velocity.js";
import { Id } from "./Id.js";
import { Paint } from "./Paint.js";

// import times for ts

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

/**
 * @typedef {import("./Group.js").Group} Group
 */

/**
 * @typedef {import("./Img.js").Stamp} Stamp
 */

/**
 * @typedef {import("./Animation.js").MovingStamp} MovingStamp
 */

/**
 * Represents an entity on the canvas that can be drawn and interacted with.
 */
export class Entity {
    /**
     * @static
     * @type {Entity[] | Group} all
     */
    static all = [];

    /**
     * @type {(Stamp | MovingStamp)[]}
     */
    #assets;
    #rotation;
    #assetOffset;
    #extra;
    #direction;
    // #collider;
    #tad;
    #colour;
    #frameLastUpdated;
    /** @type {(number|null)} */
    #lifespan;
    #maxSpeed;

    exists;
    /**
     * Creates an entity.
     * @param {Tad} tad
     * @param {number} x
     * @param {number} y
     * @throws {Error} If tad is not a Tad object.
     * @throws {Error} If the x or y values are not numbers.
     * @property {Point} position - The current position of the entity.
     * @property {Velocity} velocity - The current velocity of the entity.
     * @property {boolean} movedByCamera - True if the entity is moved by the camera.
     * @property {Object} extra - a object for you to assign any unique extra key value pairs you'd like to attach to the entity.
     * @property {number} rotationalVelocity - The rotational velocity of the entity.
     * @property {Collider} collider - The collider of the entity.
     * @property {Group[]} groupsOwnedBy - The groups owned by the entity.
     * @property {string} fill - The fill colour of the entity.
     * @property {number} speed - The speed of the entity.
     * @property {number} direction - The direction of the entity.
     * @property {number} rotation - The rotation of the entity.
     * @property {number} x - The x-coordinate of the centre of the entity.
     * @property {number} y - The y-coordinate of the centre of the entity.
     * @property {number} lifespan - Lifespan of the entity. null by default.
     * @constructor
     */
    constructor(tad, x, y) {
        if(Number.isFinite(tad)){
            throw new Error("sjkhdfs")
        }
        this.id = Id.getId();
        this.#tad = tad;
        this.#frameLastUpdated = 0;
        this.#lifespan = null;
        this.exists = true;
        this.position = new Point(tad, x, y);
        this.#assetOffset = {
            x:0,
            y:0
        };
        this.#extra = makeExtra();
        this.velocity = new Velocity(0, 0);
        this.movedByCamera = true;
        this.#direction = this.#tad.math.adjustDegressSoTopIsZero(0);
        this.#rotation = this.#tad.math.adjustDegressSoTopIsZero(0);
        this.rotationalVelocity = 0;
        this.#maxSpeed = 1000;
        // this.#collider = null;
        this.#assets = [];
        /**
         * @type {Group[]}
         */
        this.groupsOwnedBy = [];
        //entity.all is initiated in setup, this is a backup that fires for situations with no canvas
        if (!Entity.all) {
            //this is for circumvention of hoisting order issue
            // Entity.all = makeGroup();
            // Entity.all.name = "Entity.all";
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
        this.#colour =
            approvedColors[Math.floor(Math.random() * approvedColors.length)];
    }

    get extra() {
        return this.#extra;
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
        if (!this.#tad.colour.isValid(value)) {
            throw Error("meant to be a colour buddy");
        }
        this.#colour = value;
    }

    /**
     * Fill colour of the entity.
     * @param {string} value
     * @throws {Error} If the value is not a valid colour.
     */
    set colour(value) {
        if (!this.#tad.colour.isValid(value)) {
            throw Error(ErrorMsgManager.colourCheckFailed(value));
        }
        this.hadColourAssigned = true;
        this.#colour = value;
    }

    /**
     * Returns the colour that the entity has been filled with.
     * @returns {string} The fill colour of the entity.
     */
    get colour() {
        return this.#colour;
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
        this.velocity.x = this.#tad.math.cos(this.#direction) * value;
        this.velocity.y = this.#tad.math.sin(this.#direction) * value;
    }

    /**
     * Returns the current speed of the entity.
     * @returns {number} The speed of the entity.
     */
    get speed() {
        // calculate the speed back from the current velocity x and y
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
        this.#direction = this.#tad.math.adjustDegressSoTopIsZero(value);

        const adjustedDegree = this.#direction;
        const speed = this.speed;
        this.velocity.x = this.#tad.math.cos(adjustedDegree) * speed;
        this.velocity.y = this.#tad.math.sin(adjustedDegree) * speed;
    }

    /**
     * Returns the current direction of the entity.
     * @returns {number} The direction of the entity.
     */
    get direction() {
        return this.#tad.math.unadjustDegreesFromZero(this.#direction);
    }

    get lifespan() {
        return this.#lifespan;
    }

    /**
     * @param {(number | null)} value
     */
    set lifespan(value) {
        if (value === null) {
            this.#lifespan = null;
            return;
        }
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "lifespan must be a finite positive number!"
                )
            );
        }
        this.#lifespan = value;
    }

    /**
     * Finds the angle between the entity and a given point.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {number} The angle between the entity and the point.
     */
    getAngleToPoint(x, y) {
        const angle = this.#tad.math.atan2(this.y - y, this.x - x);
        return this.#tad.math.adjustDegressSoTopIsZero(angle);
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
     * Update the entity. Called once each frame.
     */
    update() {
        this.#frameLastUpdated=this.#tad.frameCount;
        if (this.exists === false) {
            return;
        }
        this.#updateLifespan();
        this.#enforceMaxSpeed();
    }

    #updateLifespan(){
        if (this.lifespan === null) {
            return;
        }
        if (this.lifespan > 0) {
            this.lifespan -= (this.#tad.time.msElapsed / 1000.0);
        } else if(this.lifespan<=0) {
            this.remove();
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
        this.#tad.state.save();

        this.#tad.shape.colour = this.colour;
        this.#tad.shape.border = "white";
        this.#tad.shape.strokeDash = 3;
        this.#tad.shape.oval(this.x, this.y, 10);

        if (this.hasAsset()) {
            this.drawAssets();
        }
        this.#tad.state.load();
    }
    /**
     * Attach a given image as an asset of this collider.
     * @param {Stamp | MovingStamp} value - The image to attach.
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

        if (value.type === "image" || value.type === "animation") {
            this.#assets.push(value.clone());
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
            this.#tad.math.adjustDegressSoTopIsZero(value);
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
        const degreeReadjustedValue = this.#tad.math.unadjustDegreesFromZero(
            this.#rotation
        );
        return degreeReadjustedValue;
    }

    /**
     * Removes the entity from the canvas.
     */
    remove() {
        this.exists = false;
        this.lifespan = 0;
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
        this.position.x = value;
    }

    /**
     * Returns the x-coordinate of the centre of the entity.
     * @returns {number} The x-coordinate of the centre of the entity.
     */
    get x() {
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
        this.position.y = value;
    }

    /**
     * Returns the y-coordinate of the centre of the entity.
     * @returns {number} The y-coordinate of the centre of the entity.
     */
    get y() {
        return this.position.y;
    }

    /**
     * @param {number} value 
     */
    set maxSpeed(value) {
        if (Number.isFinite(value)) {
            this.#maxSpeed = value;
            return;
        }
        throw new Error(
            ErrorMsgManager.numberCheckFailed(value, "max has to be a number!")
        );
    }

    /**
     * @returns {number}
     */
    get maxSpeed() {
        return this.#maxSpeed;
    }

    #enforceMaxSpeed() {
        this.velocity.x = this.#tad.math.clamp(this.velocity.x, -this.#maxSpeed, this.#maxSpeed);
        this.velocity.y = this.#tad.math.clamp(this.velocity.y, -this.#maxSpeed, this.#maxSpeed);
    }

    /**
     * internal
     * private_internal
     */
    move() {
        if (this.rotationalVelocity != 0) {
            this.rotation += this.rotationalVelocity * this.#tad.time.timeMultiplier
        }
    }

    moveX() {
        if (this.velocity.x != 0) {
            this.x += this.velocity.x * this.#tad.time.timeMultiplier
        }
    }

    moveY() {
        if (this.velocity.y != 0) {
            this.y += this.velocity.y * this.#tad.time.timeMultiplier
        }
    }
}

export class ShapedAssetEntity extends Entity {
    #w;
    #h;
    /**
     * @type {number}
     */
    #radius;

    /**
     * @type {(Stamp | MovingStamp)[]}
     */
    #assets;
    /**
     * Creates an instance of ShapedAssetEntity.
     * @param {Tad} tad
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @constructor
     */
    constructor(tad, x, y, w, h) {
        super(tad, x, y);
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
                //@ts-expect-error 
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
                //@ts-expect-error 
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

    update() {
        super.update();
    }

    draw() {

    }

}
