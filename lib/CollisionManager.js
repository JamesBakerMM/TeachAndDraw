import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

export class CollisionManager {

    #pen
    #collidesList
    #overlapsList

    //stores overlaps that happen in the collision management layer, but won't be detected until the next frame.
    #delayedOverlaps
    
    constructor(pen){
        this.#pen=pen;
        this.#collidesList = new Array();
        this.#overlapsList = new Array();
        this.#delayedOverlaps = new Array();
    }

    overlaps(collider1, collider2) {   
        //this.#overlapsList.push([collider1, collider2]);
        return this.collidersOverlap(collider1, collider2);
    }

    collides(collider1, collider2) {
        this.addCollisionEvent(collider1, collider2);
        return this.collidersOverlap(collider1, collider2);
    }

    collidersOverlap(collider1, collider2) {
        //for now we are just doing spheretests
        return CollisionUtilities.sphereTest(collider1.x, collider1.y, collider1.radius, collider2.x, collider2.y, collider2.radius)
    }

    addCollisionEvent(collider1, collider2) {
        for(let i = 0; i < this.#collidesList.length; i++) {
            let entry = this.#collidesList[i];
            if ((entry[0] == collider1 && entry[1] == collider2) ||
                (entry[1] == collider1 && entry[0] == collider2)) {
                return;
            }
        }
        this.#collidesList.push([collider1, collider2]);
    }

    doCollide(collider1, collider2) {

        let vectorV = {x: collider1.velocity.x - collider2.velocity.x, y: collider1.velocity.y - collider2.velocity.y};
        let dist = CollisionUtilities.distanceBetweenpoints(collider1, collider2);

        let vectorN = CollisionUtilities.normalize(collider1.x - collider2.x, collider1.y - collider2.y);

        let forceOn1 = 1;
        let forceOn2 = 1;
        if (collider1.mass > collider2.mass) {
            forceOn2 = collider1.mass / collider2.mass;
            forceOn1 = 1 / forceOn2;
        } else {
            forceOn1 = collider2.mass / collider1.mass;
            forceOn2 = 1 / forceOn1;
        }

        let forceOn1Scaled = forceOn1 * (forceOn1 / (forceOn1 + forceOn2));
        let forceOn2Scaled = forceOn2 * (forceOn2 / (forceOn1 + forceOn2));

        //move objects apart to prevent collision over multiple frames
        
        let minimumDist = collider1.radius + collider2.radius;
        if (dist < minimumDist) {
            let difference = minimumDist - dist;
            collider1.x += vectorN.x * difference;
            collider1.y += vectorN.y * difference;
            collider2.x -= vectorN.x * difference;
            collider2.y -= vectorN.y * difference;
        }

        collider1.velocity.x += (vectorN.x * forceOn1);
        collider1.velocity.y += (vectorN.y * forceOn1);

        collider2.velocity.x -= (vectorN.x * forceOn2);
        collider2.velocity.y -= (vectorN.y * forceOn2);
    }

    handleCollisions() {
        console.log(this.#collidesList.length);
        for (let i = this.#collidesList.length-1; i >= 0; i--) {
            let entry = this.#collidesList[i];
            let overlaps = this.collidersOverlap(entry[0], entry[1]);
            if (overlaps) {
                this.doCollide(entry[0], entry[1]);
            }
        }
        this.#collidesList = new Array();
    }
}