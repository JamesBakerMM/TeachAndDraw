import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class CollisionManager {

    #pen
    #collidesList
    #collidesMap
    #overlapsList

    //stores overlaps that happen in the collision management layer, but won't be detected until the next frame.
    #delayedOverlaps
    
    constructor(pen){
        this.#pen=pen;
        this.#collidesMap = new Set(); 
        this.#collidesList = new Array();
        this.#overlapsList = new Array();
        this.#delayedOverlaps = new Array();
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
        
        // console.log(collider1.id,collider2.id);
        //alternate way
        let newKey;
        if(collider1.id < collider2.id){
            newKey=collider1.id+"A"+collider2.id
        } else if(collider2.id < collider1.id){
            newKey=collider2.id+"A"+collider1.id
        } else {
            throw Error("these are the same collider!")
        }

        if(!this.#collidesMap.has(newKey)){
            this.#collidesMap.add(newKey);
            this.#collidesList.push(collider1);
            this.#collidesList.push(collider2);
        }
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
        collider2.velocity.mod(-impulseVec.x * m2, -impulseVec.y * m1);

        //move objects apart to prevent collision over multiple frames
        let minimumDist = collider1.radius + collider2.radius;
        if (dist < minimumDist) {
            let difference = minimumDist - dist;
            collider1.x += vectorN.x * difference;
            collider1.y += vectorN.y * difference;
            collider2.x -= vectorN.x * difference;
            collider2.y -= vectorN.y * difference;
        }
    }

    handleCollisions() {
        // console.log(this.#collidesMap,Object.entries(this.#collidesMap),this.#collidesList.length)
        const length = this.#collidesList.length;
        for (let i = 0; i < length; i += 2) {
            let entry1 = this.#collidesList[i];
            let entry2 = this.#collidesList[i+1];
            let overlaps = this.collidersOverlap(entry1, entry2);
            if (overlaps) {
                this.doCollide(entry1, entry2);
            }
        }
        this.#collidesMap=new Set();
        this.#collidesList = new Array();
    }
}