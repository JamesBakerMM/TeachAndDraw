import { Debug } from "./Debug.js";
import { Flip } from "./Flip.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Group, makeGroup } from "./Group.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Mouse } from "./Mouse.js";
import { Vector } from "./Vector.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

export class Collider extends ShapedAssetEntity {
    /**
     * A group holding every {@link Group} that exists.
     * @type { null | Group}
     */
    static all = null;
    #tad;
    #mass;

    /** @type {number} */
    #bounciness;

    /** @type {number} */
    #friction;

    /**
     * @type {number}
     */
    #x1;
    /**
     * @type {number}
     */
    #x2;
    /**
     * @type {number}
     */
    #y1;
    /**
     * @type {number}
     */
    #y2;

    #assetOffset = {
        x: 0,
        y: 0,
    };

    /**
     *
     * @param {Tad} pen
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {"circle"|"box"} type
     */
    constructor(pen, x, y, w, h = w, type = "circle") {
        //type checks are in the make function
        //id is set in Entity class
        super(pen, x, y, w, h);
        this.#tad = pen;
        this.#mass = 1;
        this.inverseMass = 1 / this.#mass;
        this.mass = 1;
        this.bounciness = 100;
        this.#friction = 1;
        this.#assetOffset;
        /**
         * Indicates whether a {@link Collider} should be affected by the physics of other {@link Collider}s
         */
        this.static = false;
        /**
         * Controls whether a {@link Collider}s assets (see {@link Image} and {@link Animation}) should be flipped visually on the x and/or y axis.
         */
        this.flip = new Flip();

        this.overlays = new Set();
        this.collisions = new Set();

        this.validOverlapsIds = new Set();
        this.validCollisionIds = new Set();

        this.previousPosition = { x: this.x, y: this.y };

        /**
         * @type {"circle"|"box"}
         */
        this.shape = type;
        this.vertices = new Array();

        this.updateCollision();

        if (!Collider.all) {
            //this is for circumvention of hoisting order issue
            Collider.all = makeGroup(this.#tad);
            Collider.all.name = "Collider.all";
        }
        Collider.all.push(this);
    }

    get bounciness() {
        return this.#bounciness;
    }

    set bounciness(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "bounciness must be a number above or equal to 0."
                )
            );
        }
        const MIN_BOUNCE = 0;
        if (value < MIN_BOUNCE) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Bounciness must be a number between 0 and 200 inclusive."
                )
            );
        }
        const MAX_BOUNCE = 200; //allows for it being super bouncy
        if (value > MAX_BOUNCE) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Bounciness must be a number between 0 and 200 inclusive."
                )
            );
        }
        this.#bounciness = value;
    }

    get friction() {
        return this.#friction;
    }

    set friction(value) {
        if (!Number.isFinite(value)) {
            throw new Error("friction has to be a number");
        }
        const MIN_FRICTION = 0;
        const MAX_FRICTION = 100;
        if (value < MIN_FRICTION || value > MAX_FRICTION) {
            throw new Error("friction has to be between 0 and 100");
        }
        this.#friction = value;
    }

    /**
     * @private
     * @param {Vector} start
     * @param {Vector} end
     */
    distSquared(start, end) {
        const lineX = end.x - start.x;
        const lineY = end.y - start.y;
        return lineX * lineX + lineY * lineY;
    }

    /**
     * @private
     * Force the number to only ever be 0 or 1.
     * @param {Number} num
     */
    clampTo01(num) {
        if (num < 0) {
            return 0;
        }
        if (num > 1) {
            return 1;
        }
        return num;
    }

    /**
     * Closest fraction t along segment start→end to a target point.
     * 0=start, 1=end, unclamped (caller can clamp).
     * @param {Vector} start
     * @param {Vector} end
     * @param {Vector} target
     */
    closestPointOnLine(start, end, target) {
        const line = Vector.temp(end.x - start.x, end.y - start.y);
        const linelenSq = line.x * line.x + line.y * line.y;

        if (linelenSq === 0) {
            return 0;
        }

        const targetToStart = Vector.temp(
            target.x - start.x,
            target.y - start.y
        );

        //some divide by 0 edgecase involving whatever an episilon is?
        const EPSILON = 1e-12;
        if (linelenSq <= EPSILON) {
            return 0;
        }

        return this.clampTo01(targetToStart.dot(line) / linelenSq);
    }

    /**
     * @todo this should be moved into the collision manager as a static method
     * @private
     * @param {Vector} start
     * @param {Vector} end
     * @param {Vector} center   circle center
     * @param {number} radius   circle radius
     * @returns {boolean}
     */
    lineIntersectsCircle(start, end, center, radius) {
        if (!Number.isFinite(radius) || radius < 0) {
            return false;
        }

        //We get the squared len of the line, also I'm calling it a line not a segment.
        const lineLenSq = this.distSquared(start, end);

        // If there is no length, the line is a point, we use episolon for float reasons.
        const EPSILON = 1e-12;
        if (lineLenSq <= EPSILON) {
            return this.distSquared(start, center) <= radius * radius;
        }

        /** @type {number} a clamped number in the range of 0 to 1. */
        const locationOnLine = this.closestPointOnLine(start, end, center);

        const lineDirection = Vector.temp(end.x - start.x, end.y - start.y);

        const closestPoint = Vector.temp(
            start.x + locationOnLine * lineDirection.x,
            start.y + locationOnLine * lineDirection.y
        );

        /**
         * Get the distance for how far the closest point is from the center.
         */
        const distanceToCenter = Vector.temp(
            closestPoint.x - center.x,
            closestPoint.y - center.y
        );

        return distanceToCenter.dot(distanceToCenter) <= radius * radius;
    }

    /**
     * Checks if the {@link Collider} is between 2 pairs of x,y coordinates.
     *
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} endX
     * @param {Number} endY
     */
    between(startX, startY, endX, endY) {
        if (!Number.isFinite(startX)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    startX,
                    "startX has to be a number!"
                )
            );
        }
        if (!Number.isFinite(startY)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    startY,
                    "startY has to be a number!"
                )
            );
        }
        if (!Number.isFinite(endX)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    endX,
                    "endX has to be a number!"
                )
            );
        }
        if (!Number.isFinite(endY)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    endY,
                    "endY has to be a number!"
                )
            );
        }
        if (this.shape === "circle") {
            if (
                !Number.isFinite(this.x) ||
                !Number.isFinite(this.y) ||
                !Number.isFinite(this.w)
            ) {
                throw new Error(
                    "Circlde collider requires finite x, y, and w."
                );
            }
            const start = new Vector(startX, startY);
            const end = new Vector(endX, endY);
            const center = new Vector(this.x, this.y);
            const radius = this.w / 2;

            return this.lineIntersectsCircle(start, end, center, radius);
            //do the detection check for a line circle overlapping
        }
        if (this.shape === "box") {
            if (
                !Number.isFinite(this.x) ||
                !Number.isFinite(this.y) ||
                !Number.isFinite(this.w) ||
                !Number.isFinite(this.h)
            ) {
                throw new Error("Box collider requires finite x, y, w, and h.");
            }
            //do the detect check for a box intersecting a line
        }
    }

    /**
     * Checks if the {@link Collider} is overlapping another {@link Collider}, the {@link Mouse} or {@link Group} of {@link Collider}s and returns true or false accordingly.
     * @param {Collider | Mouse | Group} otherCollider
     * @returns {boolean}
     */
    overlaps(otherCollider) {
        if (otherCollider instanceof Mouse) {
            otherCollider = otherCollider.collider;
        }
        if (otherCollider instanceof Group) {
            return otherCollider.overlaps(this);
        }
        if (otherCollider instanceof Collider === false) {
            throw Error(
                `you gave not a collider ${otherCollider}:${typeof otherCollider}`
            );
        }
        return this.#tad
            .getCollisionManager()
            .collidesOrOverlapsColliderToCollider(this, otherCollider, true);
    }

    /**
     *
     * @param {Collider | Mouse | Group} otherCollider
     * @returns {boolean}
     */
    collides(otherCollider) {
        if (otherCollider === this) {
            throw new Error(`Don't collide with yourself.`);
        }
        if (otherCollider instanceof Mouse) {
            otherCollider = otherCollider.collider;
        }
        if (otherCollider instanceof Collider) {
            return this.#tad
                .getCollisionManager()
                .collidesOrOverlapsColliderToCollider(
                    this,
                    otherCollider,
                    false
                );
        }
        if (otherCollider instanceof Group) {
            return this.#tad
                .getCollisionManager()
                .collidesOrOverlapsGroupToCollider(
                    otherCollider,
                    this,
                    otherCollider.id,
                    false
                );
        }
        throw new Error(
            `Unsupported! ${otherCollider}:${typeof otherCollider}`
        );
    }

    move() {
        if (this.exists === false) {
            return;
        }

        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
        //do friction. replace / 1000 with time based system
        let vectorN = CollisionUtilities.normalize(
            this.velocity.x,
            this.velocity.y
        );
        let amplitude =
            CollisionUtilities.distance(this.velocity.x, this.velocity.y) *
            ((100 - this.friction) / 100); // * this.#pen.time.timeMultiplier;

        this.velocity.x = vectorN.x * amplitude;
        this.velocity.y = vectorN.y * amplitude;

        this.rotationalVelocity =
            this.rotationalVelocity * ((100 - this.friction) / 100);

        super.move();
    }

    update() {
        this.validOverlapsIds = new Set();
        this.validCollisionIds = new Set();
        this.previousPosition = { x: this.x, y: this.y };
        super.update();
        this.updateCollision();
    }
    draw() {
        if (this.exists === false) {
            return;
        }

        if (this.asset) {
            this.asset.x = this.x;
            this.asset.y = this.y;
            this.asset.flip.x = this.flip.x;
            this.asset.flip.y = this.flip.y;
        }

        this.sync();

        if (this.hasAsset()) {
            this.drawAssets();
        } else {
            this.drawCollider();
        }

        if (this.#tad.debug) {
            Debug.drawCollider(this.#tad, this);
        }
    }

    drawCollider() {
        this.#tad.state.save();
        this.#tad.shape.movedByCamera = this.movedByCamera;
        this.#tad.shape.alignment.x = "center";
        this.#tad.shape.alignment.y = "center";
        this.#tad.shape.strokeWidth = 0;
        this.#tad.shape.colour = this.colour;
        this.#tad.shape.border = "rgba(0,0,0,0)";
        if (this.shape == "circle") {
            this.#tad.shape.oval(this.x, this.y, this.radius, this.radius);
        } else if (this.shape == "box") {
            this.#tad.shape.polygon(
                this.vertices[0].x,
                this.vertices[0].y,
                this.vertices[1].x,
                this.vertices[1].y,
                this.vertices[3].x,
                this.vertices[3].y,
                this.vertices[2].x,
                this.vertices[2].y
            );
        }
        this.#tad.state.load();
    }
    sync() {
        if (this.hasAsset()) {
            this.asset.x = this.x;
            this.asset.y = this.y;
        }
    }
    set mass(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "mass has to be a number!"
                )
            );
        }
        if (value === 0) {
            this.#mass = 0;
            this.inverseMass = 0;
            return;
        }
        this.#mass = value;
        this.inverseMass = -value;
        return;
    }

    get mass() {
        return this.#mass;
    }

    updateCollision() {
        this.updateRadius(this.w, this.h);
        this.#x1 = this.x - this.radius;
        this.#x2 = this.x + this.radius;
        this.#y1 = this.y - this.radius;
        this.#y2 = this.y + this.radius;

        if (this.shape === "box") {
            const half_width = this.w / 2;
            const half_height = this.h / 2;
            this.vertices = new Array();
            let p1 = { x: this.x - half_width, y: this.y - half_height };
            let p2 = { x: this.x + half_width, y: this.y - half_height };
            let p3 = { x: this.x - half_width, y: this.y + half_height };
            let p4 = { x: this.x + half_width, y: this.y + half_height };

            p1 = CollisionUtilities.rotatePointAroundPoint(
                p1.x,
                p1.y,
                this.x,
                this.y,
                this.rotation
            );
            p2 = CollisionUtilities.rotatePointAroundPoint(
                p2.x,
                p2.y,
                this.x,
                this.y,
                this.rotation
            );
            p3 = CollisionUtilities.rotatePointAroundPoint(
                p3.x,
                p3.y,
                this.x,
                this.y,
                this.rotation
            );
            p4 = CollisionUtilities.rotatePointAroundPoint(
                p4.x,
                p4.y,
                this.x,
                this.y,
                this.rotation
            );
            this.vertices.push(p1);
            this.vertices.push(p2);
            this.vertices.push(p3);
            this.vertices.push(p4);
        }
    }
    /**
     *
     * @param {number} width
     * @param {number} height
     * @returns {number}
     */
    updateRadius(width, height) {
        if (this.shape === "box") {
            this.radius = Math.sqrt(
                Math.pow(width / 2, 2) + Math.pow(height / 2, 2)
            );
        } else {
            this.radius = width / 2;
        }
        return this.radius;
    }
    get x1() {
        return this.#x1;
    }
    get x2() {
        return this.#x2;
    }
    get y1() {
        return this.#y1;
    }
    get y2() {
        return this.#y2;
    }
}
