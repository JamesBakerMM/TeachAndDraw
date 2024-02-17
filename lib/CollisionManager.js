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

        let v1 = {x: collider1.velocity.x, y: collider1.velocity.y}
        let v1Length = CollisionUtilities.distance(v1.x, v1.y);

        let v2 = {x: collider2.velocity.x, y: collider2.velocity.y}
        let v2Length = CollisionUtilities.distance(v2.x, v2.y);

        let vectorN = CollisionUtilities.normalize(collider1.x - collider2.x, collider1.y - collider2.y);

        collider1.velocity.x = vectorN.x * v1Length;
        collider1.velocity.y = vectorN.y * v1Length;

        collider2.velocity.x = -vectorN.x * v2Length;
        collider2.velocity.y = -vectorN.y * v2Length;
    }

    handleCollisions() {
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