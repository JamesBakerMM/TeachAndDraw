import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class CollisionManager {

    #pen

    //overlaps and collides to be run next management
    #pendingCollision;

    //ids to be use for collides and overlaps
    #pendingCollisionArray;

    //stores any overlaps or collides that were detected last collision management
    #collisionSet;
    
    #collisionCounter;

    #loopsRequired;
    
    constructor(pen){
        this.#pen=pen;
        
        this.#pendingCollision = new Set();
        this.#pendingCollisionArray = new Array(2000);
        this.#collisionSet = new Set();

        this.#collisionCounter = 0;
        Object.preventExtensions(this);
    }

    overlaps(collider1, collider2) {

        let id = this.getSetId(collider1, collider2, 0);
        if (!this.#pendingCollision.has(id)) {
            this.addCollision(collider1, collider2, 0);
            this.#pendingCollision.add(id);
        }
        return this.#collisionSet.has(id);
    }

    collides(collider1, collider2) {    
        let id = this.getSetId(collider1, collider2, 1);
        if (!this.#pendingCollision.has(id)) {
            this.addCollision(collider1, collider2, 1);
            this.#pendingCollision.add(id);
        }
        return this.#collisionSet.has(id);
    }

    collidersOverlap(collider1, collider2) {
        //for now we are just doing spheretests
        return CollisionUtilities.sphereTest(collider1.x, collider1.y, collider1.radius, collider2.x, collider2.y, collider2.radius);
    }

    addCollision(collider1, collider2, isOverlap) {
        this.#pendingCollisionArray[this.#collisionCounter] = collider1;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = collider2;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = isOverlap;
        this.#collisionCounter += 1;
    }

    getSetId(collider1, collider2, collide) {
        let id = "";
        if (collide == 1) {
            id += ":";
        }
        
        if (collider1.id < collider2.id) {
            return id + collider1.id + ":" + collider2.id;
        } else {
            return id + collider2.id + ":" + collider1.id;
        }
    }

    doCollide(collider1, collider2) {

        let dist = CollisionUtilities.distanceBetweenpoints(collider1, collider2);
        let minimumDist = collider1.radius + collider2.radius;
        let difference = minimumDist - dist;

        let vectorN = CollisionUtilities.normalize(collider1.x - collider2.x, collider1.y - collider2.y);

        let v1 = {
            x: collider1._trueX - collider1.positionPrevious.x,
            y: collider1._trueY - collider1.positionPrevious.y
        };
        let v2 = {
            x: collider2._trueX - collider2.positionPrevious.x,
            y: collider2._trueY - collider2.positionPrevious.y
        };

        let vectorV = {x: v1.x - v2.x, y: v1.y - v2.y};

        let vectorSeparate = CollisionUtilities.dotProduct(vectorV, vectorN);
        let new_sepVel = -vectorSeparate * (collider1.bounciness * collider2.bounciness); 
    
        //the difference between the new and the original sep.velocity value
        let vsep_diff = new_sepVel - vectorSeparate;

        if (collider1.static == false && collider2.static == false) {

            let m1 = 1/collider1.mass;
            let m2 = 1/collider2.mass;

            //dividing the impulse value in the ration of the inverse masses
            //and adding the impulse vector to the original vel. vectors
            //according to their inverse mass
            let impulse = vsep_diff / (m1 + m2);
            let impulseVec = {x: vectorN.x * impulse, y: vectorN.y * impulse};

            collider1.velocity.modify(impulseVec.x * m1, impulseVec.y * m1);
            collider2.velocity.modify(-impulseVec.x * m2, -impulseVec.y * m2);

            //normalise the masses so we can use them as multiplier in the position fix
            let n = 1 / (m1 + m2)
            m1 = m1 * n;
            m2 = m2 * n;

            //move objects apart to prevent collision over multiple frames
            if (dist < minimumDist) {
                collider1.x += vectorN.x * difference * m1;
                collider1.y += vectorN.y * difference * m1;
                collider2.x -= vectorN.x * difference * m2;
                collider2.y -= vectorN.y * difference * m2;
            }

        } else {
            let staticCollider;
            let otherCollider;
            if (collider1.static == true) {
                staticCollider = collider1;
                otherCollider = collider2;
            } else {
                staticCollider = collider2;
                otherCollider = collider1;
            }

            otherCollider.velocity.modify(-vectorN.x, -vectorN.y);

            //move objects apart to prevent collision over multiple frames
            if (dist < minimumDist) {
                otherCollider.x -= vectorN.x * difference;
                otherCollider.y -= vectorN.y * difference;
            }
        }
    }

    setupCollisions() {
        this.#collisionSet = new Set();
    }

    handleCollisions() {
        for (let j = 0; j < this.#collisionCounter; j += 3) {

            const c1 = this.#pendingCollisionArray[j];
            const c2 = this.#pendingCollisionArray[j+1];

            const overlaps = this.collidersOverlap(c1, c2);

            if (overlaps) {
                const type = this.#pendingCollisionArray[j+2];
                const id = this.getSetId(c1, c2, type);
                if (!this.#collisionSet.has(id)) {
                    this.#collisionSet.add(id)
                }
                if (type == 1) {
                    this.doCollide(c1, c2);
                }
            }
        }
    }

    finishCollisions() {
        this.#pendingCollision = new Set();
        this.#collisionCounter = 0;
    }
}