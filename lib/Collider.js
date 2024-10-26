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
    #bounciness;
    #friction;
    #lifespan;
    #lastFrameLifespanDecremented
    #x1;
    #x2;
    #y1;
    #y2;

    #assetOffset

    constructor(pen, x, y, w, h = w, type = "circle") {
        //type checks are in the make function
        //id is set in Entity class
        super(pen, x, y, w, h);
        this.#pen = pen;
        this.#mass = 1;
        this.inverseMass = 1 / this.#mass;
        this.mass = 1;
        this.bounciness = 100;
        this.#friction = 1;
        this.#assetOffset = {
            x:0,
            y:0
        };
        this.static = false;
        this.#acceleration = 1; //change how this works
        this.hasOverlapped = false;
        this.flip = new Flip();
        this.#lifespan="ageless";
        this.#lastFrameLifespanDecremented=-2; //this is to ensure if someone calls .draw() multiple times in one frame it does not decrement the lifespan that many times

        this.overlays = new Set();
        this.collisions = new Set();
        
        this.validOverlapsIds = new Set();
        this.validCollisionIds = new Set();

        this.shape = type;
        this.vertices = new Array();

        if (!Collider.all) { //this is for circumvention of hoisting order issue
            Collider.all = makeGroup();
            Collider.all.name="Collider.all";
        }
        Collider.all.push(this);
        this.updateBounds();
    }

    get bounciness(){
        return this.#bounciness;
    }
    
    set bounciness(value){
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "bounciness must be a number above or equal to 0."
                )
            );
        }
        const MIN_BOUNCE = 0;
        if(value<MIN_BOUNCE){
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Bounciness must be a number between 0 and 200 inclusive."
                )
            );
        }
        const MAX_BOUNCE = 200; //allows for it being super bouncy
        if(value>MAX_BOUNCE){
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Bounciness must be a number between 0 and 200 inclusive."
                )
            );
        }
        this.#bounciness = value;
    }

    get friction(){
        return this.#friction;
    }

    set friction(value){
        if (!Number.isFinite(value)) {
            throw new Error("friction has to be a number");
        }
        const MIN_FRICTION=0;
        const MAX_FRICTION=100;
        if(value<MIN_FRICTION || value>MAX_FRICTION) {
            throw new Error("friction has to be between 0 and 100")
        }
        this.#friction = value;
    }

    /**
     * 
     * @param {Collider} otherCollider 
     * @returns {boolean}
     */
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
    
    /**
     * 
     * @param {Collider} otherCollider 
     * @returns {boolean}
     */
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
            return this.#pen.getCollisionManager().collidesOrOverlapsGroupToCollider(otherCollider, this, otherCollider.id);
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

        this.rotationalVelocity = this.rotationalVelocity * ((100-this.friction) / 100)

        super.move();

        this.updateBounds();
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
    get lifespan() {
        return this.#lifespan;
    }
    set lifespan(value) {
        if (!Number.isFinite(value)) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "lifespan must be a number above or equal to 0."
                )
            );
        }
        if(value<0){
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "lifespan must be a number above or equal to 0."
                )
            );
        }
        if(this.#pen.frameCount !== this.#lastFrameLifespanDecremented){
            this.#lifespan=value;
        }
        this.#lastFrameLifespanDecremented=this.#pen.frameCount;
    } 
    draw() {
        if(this.lifespan===0){
            this.remove();
        }
        if(this.lifespan>0){
            this.lifespan-=1;
        }

        if (this.exists === false) {
            return;
        }
        if (this.asset) {
            this.asset.x = this.x;
            this.asset.y = this.y;
            this.asset.flip.x=this.flip.x;
            this.asset.flip.y=this.flip.y;
        }

        this.sync();

        if (this.hasAsset()) {
            this.drawAssets();
        } else {
            this.drawCollider();
        }

        if (this.#pen.debug) {
            Debug.drawCollider(this.#pen, this);
        }

    }
    drawCollider() {
        this.#pen.state.save();
        this.#pen.shape.alignment.x = "center";
        this.#pen.shape.alignment.y = "center";
        this.#pen.shape.strokeWidth = 0;
        this.#pen.colour.stroke = "rgba(0,0,0,0)";
        this.#pen.colour.fill = this.fill;
        if (this.shape == "circle") {
            this.#pen.shape.oval(this.x, this.y, this.radius, this.radius);
        } else if (this.shape == "box") {
            this.#pen.shape.polygon(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, this.vertices[3].x, this.vertices[3].y, this.vertices[2].x, this.vertices[2].y);
        }
        this.#pen.state.load();
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

    updateBounds() {
        this.updateRadius(this.w, this.h);
        this.#x1 = this.x - this.radius;
        this.#x2 = this.x + this.radius;
        this.#y1 = this.y - this.radius;
        this.#y2 = this.y + this.radius;

        if (this.shape === "box") {
            const half_width = this.w/2;
            const half_height = this.h/2;
            this.vertices = new Array();
            let p1 = {x: this.x - half_width, y: this.y - half_height};
            let p2 = {x: this.x + half_width, y: this.y - half_height};
            let p3 = {x: this.x - half_width, y: this.y + half_height};
            let p4 = {x: this.x + half_width, y: this.y + half_height};

            p1 = CollisionUtilities.rotatePointAroundPoint(p1.x, p1.y, this.x, this.y, this.rotation);
            p2 = CollisionUtilities.rotatePointAroundPoint(p2.x, p2.y, this.x, this.y, this.rotation);
            p3 = CollisionUtilities.rotatePointAroundPoint(p3.x, p3.y, this.x, this.y, this.rotation);
            p4 = CollisionUtilities.rotatePointAroundPoint(p4.x, p4.y, this.x, this.y, this.rotation);
            this.vertices.push(p1);
            this.vertices.push(p2);
            this.vertices.push(p3);
            this.vertices.push(p4);
        }
    }
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
