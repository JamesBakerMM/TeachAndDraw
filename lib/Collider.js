import { Debug } from "./Debug.js";
import { Flip } from "./Flip.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Group, makeGroup } from "./Group.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

export class Collider extends ShapedAssetEntity {
    static all = null;
    #pen;
    #acceleration;
    #mass;

    #x1;
    #x2;
    #y1;
    #y2;

    constructor(pen, x, y, w, h = w) {
        //type checks are in the make function
        //id is set in Entity class
        super(pen, x, y, w, h);
        this.#pen = pen;
        this.#mass = 1;
        this.inverseMass = 1 / this.#mass;
        this.mass = 1;
        this.bounciness = 0.5;
        this.friction = 1;
        this.static = false;
        this.#acceleration = 1; //change how this works
        this.hasOverlapped = false;
        this.flip = new Flip();

        this.overlays = new Set();
        this.collisions = new Set();
        
        this.validOverlapsIds = new Set();
        this.validCollisionIds = new Set();

        if (!Collider.all) {
            //this is for circumvention of hoisting order issue
            Collider.all = makeGroup();
            Collider.all.name="Collider.all";
        }
        Collider.all.push(this);
        this.#updateBounds();
    }

    overlaps(otherCollider) {
        if (otherCollider instanceof Group) {
            return otherCollider.overlaps(this);
        }
        if (otherCollider instanceof Collider === false) {
            throw Error(
                `you gave not a collider ${otherCollider}:${typeof otherCollider}`
            );
        }
        return this.#pen.getCollisionManager().collidesOrOverlapsColliderToCollider(this, otherCollider, true);
    }
    collides(otherCollider) {
        if (otherCollider instanceof Collider) {
            return this.#pen.getCollisionManager().collidesOrOverlapsColliderToCollider(this, otherCollider, false);
        }
        if (otherCollider === this) {
            throw new Error(
                `Don't collide with yourself.`
            );
        }
        if (otherCollider instanceof Group) {
            return this.#pen.getCollisionManager().collidesOrOverlapsGroupToCollider(otherCollider, this, false);
        }
        throw new Error(
            `Unsupported! ${otherCollider}:${typeof otherCollider}`
        );
        return 
    }

    move() {
        if (this.exists === false) {
            return;
        }
        //do friction. replace / 1000 with time based system
        let vectorN = CollisionUtilities.normalize(this.velocity.x, this.velocity.y);
        let amplitude = CollisionUtilities.distance(this.velocity.x, this.velocity.y) * ((100-this.friction) / 100);// * this.#pen.time.timeMultiplier;
        
        this.velocity.x = vectorN.x * amplitude;
        this.velocity.y = vectorN.y * amplitude;

        super.move();

        this.#updateBounds();
    }
    set acceleration(value) {
        //check types
        if (Number.isFinite(value)) {
            this.#acceleration = value;
            return this.#acceleration;
        }
        throw Error(
            `acceleration has to be a number but you gave ${value}:${typeof value}`
        );
    }
    get acceleration() {
        return this.#acceleration;
    }
    draw() {
        if (this.exists === false) {
            return;
        }
        this.#pen.state.save();
        if (this.asset) {
            this.asset.x = this.x;
            this.asset.y = this.y;
            this.asset.flip.x=this.flip.x;
            this.asset.flip.y=this.flip.y;
        }
        this.#pen.state.load();
        // this.#pen.state.save();
        // this.move(); now handled in movement manager

        this.sync();

        if (this.hasAsset()) {
            this.drawAssets();
        } else {
            this.drawCollider();
        }

        if (this.#pen.debug) {
            Debug.drawCollider(this.#pen, this);
            // this.#pen.state.load();
        }

    }
    drawCollider() {
        this.#pen.shape.alignment.x = "center";
        this.#pen.shape.alignment.y = "center";
        this.#pen.shape.strokeWidth = 0;
        this.#pen.colour.stroke = "rgba(0,0,0,0)";
        this.#pen.colour.fill = this.fill;
        this.#pen.shape.oval(this.x, this.y, this.radius, this.radius);
    }
    sync() {
        if (this.hasAsset()) {
            this.asset.x = this.x;
            this.asset.y = this.y;
        }
        this.hasOverlapped = false;
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
            return this.#mass;
        }
        this.#mass = value;
        this.inverseMass = -value;
        return this.#mass;
    }

    get mass() {
        return this.#mass;
    }

    #updateBounds() {
        this.#x1 = this.x - this.radius;
        this.#x2 = this.x + this.radius;
        this.#y1 = this.y - this.radius;
        this.#y2 = this.y + this.radius;
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
