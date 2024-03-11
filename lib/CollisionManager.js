import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class CollisionManager {

    #pen
    #collidesList
    #collidesMap
    #overlapsList

    #collisionCounter;

    //stores overlaps that happen in the collision management layer, but won't be detected until the next frame.
    #delayedOverlaps
    
    constructor(pen){
        this.#pen=pen;
        this.#collidesList = new Array(10000);
        this.#overlapsList = new Array();
        this.#delayedOverlaps = new Array();
        this.#collisionCounter = 0;
    }

    overlaps(collider1, collider2) {   
        // if(collider1.exists===false || collider2.exists===false) {
        //     console.warn("overlaps called on a dead collider!")
        //     return false
        // }
        //this.#overlapsList.push([collider1, collider2]);
        return this.collidersOverlap(collider1, collider2);
    }

    collides(collider1, collider2) {
        // if(collider1.exists===false || collider2.exists===false) {
        //     console.warn("collides called on a dead collider!")
        //     return false
        // }
        this.addCollisionEvent(collider1, collider2);
        return this.collidersOverlap(collider1, collider2);
    }

    collidersOverlap(collider1, collider2) {
        //for now we are just doing spheretests
        return CollisionUtilities.sphereTest(collider1.x, collider1.y, collider1.radius, collider2.x, collider2.y, collider2.radius)
    }

    addCollisionEvent(collider1, collider2) {
        this.#collidesList[this.#collisionCounter] = collider1;
        this.#collisionCounter += 1;
        this.#collidesList[this.#collisionCounter] = collider2;
        this.#collisionCounter += 1;
    }

    doCollide(collider1, collider2) {

        let dist = CollisionUtilities.distanceBetweenpoints(collider1, collider2);

        let vectorN = CollisionUtilities.normalize(collider1.x - collider2.x, collider1.y - collider2.y);

        let v1 = {x: collider1.x - collider1.positionPrevious.x, y: collider1.y - collider1.positionPrevious.y};
        let v2 = {x: collider2.x - collider2.positionPrevious.x, y: collider2.y - collider2.positionPrevious.y};

        let vectorV = {x: v1.x - v2.x, y: v1.y - v2.y};

        let vectorSeparate = CollisionUtilities.dotProduct(vectorV, vectorN);
        let new_sepVel = -vectorSeparate * (collider1.bounciness * collider2.bounciness); 
    
        //the difference between the new and the original sep.velocity value
        let vsep_diff = new_sepVel - vectorSeparate;

        let m1 = 1/collider1.mass;
        let m2 = 1/collider2.mass;

        //dividing the impulse value in the ration of the inverse masses
        //and adding the impulse vector to the original vel. vectors
        //according to their inverse mass
        let impulse = vsep_diff / (m1 + m2);
        let impulseVec = {x: vectorN.x * impulse, y: vectorN.y * impulse};

        collider1.velocity.mod(impulseVec.x * m1, impulseVec.y * m1);
        collider2.velocity.mod(-impulseVec.x * m2, -impulseVec.y * m2);

        //normalise the masses so we can use them as multiplier in the position fix
        let n = 1 / (m1 + m2)
        m1 = m1 * n;
        m2 = m2 * n;

        //move objects apart to prevent collision over multiple frames
        let minimumDist = collider1.radius + collider2.radius;
        if (dist < minimumDist) {
            
            let difference = minimumDist - dist;
            collider1.x += vectorN.x * difference * m1;
            collider1.y += vectorN.y * difference * m1;
            collider2.x -= vectorN.x * difference * m2;
            collider2.y -= vectorN.y * difference * m2;
        }
    }

    handleCollisions() {        
        for (let i = 0; i < this.#collisionCounter; i += 2) {
            let entry1 = this.#collidesList[i];
            let entry2 = this.#collidesList[i+1];
            let overlaps = this.collidersOverlap(entry1, entry2);
            if (overlaps) {
                this.doCollide(entry1, entry2);
            }
        }
        this.#collidesList = new Array(10000);
        this.#collisionCounter = 0;
    }
}