import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { QuadTree } from "./QuadTree.js";

//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class CollisionManager {

    #pen

    //overlaps and collides to be run next management
    #pendingCollision;

    //ids to be use for collides and overlaps
    #pendingCollisionArray;
    
    #collisionCounter;

    //Holds all the objects that need to be put into the quadtree for collision
    #collisionObjects;
    #collisionObjectsIds;

    #quadTree;        
    

    constructor(pen){
        this.#pen=pen;
        this.#quadTree = new QuadTree();
        
        this.#pendingCollision = new Set();
        this.#pendingCollisionArray = new Array(2000);

        this.#collisionObjectsIds = new Set();
        this.#collisionObjects = new Array();

        this.#collisionCounter = 0;
        Object.preventExtensions(this);
    }

    overlaps(collider1, collider2) {

        let id = this.getSetId(collider1, collider2, 0);
        if (!this.#pendingCollision.has(id)) {
            this.addCollisionToArray(collider1, collider2, 0);
            this.#pendingCollision.add(id);
        }
        return collider1.collisions.has(collider2.id);
    }

    collides(collider1, collider2) {    
        let id = this.getSetId(collider1, collider2, 1);
        if (!this.#pendingCollision.has(id)) {
            this.addCollisionToArray(collider1, collider2, 1);
            this.#pendingCollision.add(id);
        }
        return collider1.collisions.has(collider2.id);
    }

    collidersOverlap(collider1, collider2) {
        //for now we are just doing spheretests
        return CollisionUtilities.sphereTest(collider1.x, collider1.y, collider1.radius, collider2.x, collider2.y, collider2.radius);
    }

    addCollisionToArray(collider1, collider2, isOverlap) {
        this.#pendingCollisionArray[this.#collisionCounter] = collider1;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = collider2;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = isOverlap;
        this.#collisionCounter += 1;
    }

    addCollisionToQuadObjects(collider) {
        if (!this.#collisionObjectsIds.has(collider.id)) {
            this.#collisionObjectsIds.add(collider.id);
            this.#collisionObjects.push(collider);
        }
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

    collidesOrOverlapsColliderToCollider(collider1, collider2, overlaps) {

        let validIds1 = collider1.validOverlapsIds;
        let validIds2 = collider2.validOverlapsIds;
        let collisions1 = collider1.overlaps;
        let collisions2 = collider2.overlaps;
        if (!overlaps) {
            validIds1 = collider1.validCollisionIds;
            validIds2 = collider2.validCollisionIds;
            collisions1 = collider1.collisions;
            collisions2 = collider2.collisions;
        }

        let result = false;

        validIds1.add(collider2.id); 
        if (collisions1.has(collider2.id)) {
            result = true;
        }

        validIds2.add(collider1.id); 
        if (!result) {
            if (collisions2.has(collider1.id)) {
                result = true;
            }
        }        
        
        return result;
    }

    collidesOrOverlapsGroupToCollider(entities, collider, group1Id, overlaps) {

        let result = false;
        for (let i = 0; i < entities.length; i++) {
            const sprite = entities[i];
            sprite.validCollisionIds.add(collider.id); 
            this.addCollisionToQuadObjects(sprite);
        }

        collider.validCollisionIds.add(group1Id); 
        this.addCollisionToQuadObjects(collider);
        if (!result) {
            if (collider.collisions.has(group1Id)) {
                result = true;
            }
        }
        
        return result;
    }

    collidesOrOverlapsGroupToGroup(entities1, entities2, group1Id, group2Id, overlaps) {

        let result = false;
        for (let i = 0; i < entities1.length; i++) {
            const sprite = entities1[i];
            sprite.validCollisionIds.add(group2Id);
            this.addCollisionToQuadObjects(sprite);

            if (!result) {
                if (sprite.collisions.has(group2Id)) {
                    result = true;
                }
            }
        }
        for (let i = 0; i < entities2.length; i++) {
            const sprite = entities2[i];
            sprite.validCollisionIds.add(group1Id);
            this.addCollisionToQuadObjects(sprite);
        }
        return result;
    }

    collidesOrOverlapsGroupSelfToSelf(entities, groupId, overlaps) {
        let result = false;
        for (let i = 0; i < entities.length; i++) {
            const sprite = entities[i];
            sprite.validCollisionIds.add(groupId);
            this.addCollisionToQuadObjects(sprite);
            
            if (!result) {
                if (sprite.collisions.has(groupId)) {
                    result = true;
                }
            }
        }
        return result;
    }

    processTree(quad) {
        if (quad.objects != null) {
            for (let i = 0; i < quad.objects.length; i++) {
                const sprite = quad.objects[i];
                for (let j = i + 1; j < quad.objects.length; j++) {
                    const sprite2 = quad.objects[j];
                    let canCollide = false;
                    if (sprite.validCollisionIds.has(sprite2.id)) {
                        canCollide = true;
                    }
                    for (let k = 0; k < sprite2.groupsOwnedBy.length && !canCollide; k++) {
                        if (sprite.validCollisionIds.has(sprite2.groupsOwnedBy[k])) {
                            canCollide = true;
                        }
                    }
                    if (canCollide) {
                        this.collides(sprite, sprite2);
                    }

                    ///this is so that if something has collided, we don't need to check if it overlapped as well.
                    let canOverlap = canCollide; 
                    if (sprite.validOverlapsIds.has(sprite2.id)) {
                        canOverlap = true;
                    }
                    for (let k = 0; k < sprite2.groupsOwnedBy.length && !canOverlap; k++) {
                        if (sprite.validOverlapsIds.has(sprite2.groupsOwnedBy[k])) {
                            canOverlap = true;
                        }
                    }
                    if (canOverlap) {
                        this.overlaps(sprite, sprite2);
                    }
                }
            }
        } else {
            for (let i = 1; i <= 4; i++) {
                const q = quad.getQuad(i);
                if (q != null) {
                    this.processTree(q)
                }
            }
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

    handleCollisions() {

        this.#quadTree.makeTree(this.#collisionObjects);
        this.processTree(this.#quadTree.getTree());
        
        for (let j = 0; j < this.#collisionCounter; j += 3) {

            const c1 = this.#pendingCollisionArray[j];
            const c2 = this.#pendingCollisionArray[j+1];

            const overlaps = this.collidersOverlap(c1, c2);

            if (overlaps) {
                c1.collisions.add(c2.id);
                c2.collisions.add(c1.id);
                const type = this.#pendingCollisionArray[j+2];
                if (type == 1) {
                    this.doCollide(c1, c2);
                }
            }
        }

        this.#pendingCollision = new Set();
        this.#collisionCounter = 0;
    }

    finishCollisions() {
        this.#collisionObjects = new Array();
        this.#collisionObjectsIds = new Set();
    }
}