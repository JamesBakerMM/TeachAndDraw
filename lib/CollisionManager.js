import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { QuadTree, Quad } from "./QuadTree.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { CollisionVector } from "./CollisionVector.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */
export class CollisionManager {
    #pen;

    //overlaps and collides to be run next management
    #pendingCollision;

    //ids to be use for collides and overlaps
    #pendingCollisionArray;

    #collisionCounter;

    //Holds all the objects that need to be put into the quadtree for collision
    #collisionObjects;
    #collisionObjectsIds;

    #quadTree;

    #STATIC_MASS = 100000;

    /**
     * @param {Tad} pen 
     */
    constructor(pen) {
        this.#pen = pen;
        this.#quadTree = new QuadTree();

        this.#pendingCollision = new Set();
        this.#pendingCollisionArray = new Array(2000);

        this.#collisionObjectsIds = new Set();
        this.#collisionObjects = new Array();

        this.#collisionCounter = 0;
        Object.preventExtensions(this);
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     * @returns {boolean}
     */
    overlaps(collider1, collider2) {
        let id = this.getSetId(collider1, collider2, 0);
        if (!this.#pendingCollision.has(id)) {
            this.addCollisionToArray(collider1, collider2, 0);
            this.#pendingCollision.add(id);
        }
        return collider1.collisions.has(collider2.id);
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     * @returns {boolean}
     */
    collides(collider1, collider2) {
        let id = this.getSetId(collider1, collider2, 1);
        if (!this.#pendingCollision.has(id)) {
            this.addCollisionToArray(collider1, collider2, 1);
            this.#pendingCollision.add(id);
        }
        return collider1.collisions.has(collider2.id);
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     * @returns {boolean}
     */
    collidersOverlap(collider1, collider2) {
        let result = CollisionUtilities.sphereTest(
            collider1.x,
            collider1.y,
            collider1.radius,
            collider2.x,
            collider2.y,
            collider2.radius
        );

        if (!result)
            return false;

        if (collider1.shape === "circle" && collider2.shape === "circle") {
            return result;

        } else if (collider1.shape === "box" && collider2.shape === "circle") {
            return collider1.collisionShape.doesCircleIntersect(collider2.x, collider2.y, collider2.radius);

        } else if (collider1.shape === "circle" && collider2.shape === "box") {
            return collider2.collisionShape.doesCircleIntersect(collider1.x, collider1.y, collider1.radius);

        } else if (collider1.shape === "box" && collider2.shape === "box") {
            return collider1.collisionShape.doesPolygonIntersect(collider2.collisionShape);
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     * @param {number} isOverlap
     */
    addCollisionToArray(collider1, collider2, isOverlap) {
        this.#pendingCollisionArray[this.#collisionCounter] = collider1;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = collider2;
        this.#collisionCounter += 1;
        this.#pendingCollisionArray[this.#collisionCounter] = isOverlap;
        this.#collisionCounter += 1;
    }

    /**
     * @param {Collider} collider 
     */
    addCollisionToQuadObjects(collider) {
        if (!this.#collisionObjectsIds.has(collider.id)) {
            this.#collisionObjectsIds.add(collider.id);
            this.#collisionObjects.push(collider);
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     * @param {number} collide
     * @returns 
     */
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

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2
     * @param {boolean} overlaps
     * @returns 
     */
    collidesOrOverlapsColliderToCollider(collider1, collider2, overlaps) {
        let validIds1 = collider1.validOverlapsIds;
        let validIds2 = collider2.validOverlapsIds;
        let collisions1 = collider1.overlays;
        let collisions2 = collider2.overlays;
        if (!overlaps) {
            validIds1 = collider1.validCollisionIds;
            validIds2 = collider2.validCollisionIds;
            collisions1 = collider1.collisions;
            collisions2 = collider2.collisions;
        }
        this.addCollisionToQuadObjects(collider1);
        this.addCollisionToQuadObjects(collider2);

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

    /**
     * @param {Collider} collider 
     * @param {number} group1Id 
     * @param {boolean} overlaps
     * @returns {boolean}
     */
    collidesOrOverlapsGroupToCollider(entities, collider, group1Id, overlaps) {
        let result = false;
        for (let i = 0; i < entities.length; i++) {
            const sprite = entities[i];
            if (overlaps) {
                sprite.validOverlapsIds.add(collider.id);
            } else {
                sprite.validCollisionIds.add(collider.id);
            }
            this.addCollisionToQuadObjects(sprite);
        }
        if (overlaps) {
            collider.validOverlapsIds.add(group1Id);
        } else {
            collider.validCollisionIds.add(group1Id);
        }
        this.addCollisionToQuadObjects(collider);
        if (overlaps) {
            if (collider.overlays.has(group1Id)) {
                result = true;
            }
        } else {
            if (collider.collisions.has(group1Id)) {
                result = true;
            }
        }

        return result;
    }

    /**
     * @param {number} group1Id 
     * @param {number} group2Id 
     * @param {boolean} overlaps
     * @returns {boolean}
     */
    collidesOrOverlapsGroupToGroup(entities1, entities2, group1Id, group2Id, overlaps) {
        
        let result = false;

        for (let i = 0; i < entities1.length; i++) {
            const sprite = entities1[i];
            if (overlaps) {
                sprite.validOverlapsIds.add(group2Id);
            } else {
                sprite.validCollisionIds.add(group2Id);
            }
            this.addCollisionToQuadObjects(sprite);

            if(!result){
                if (overlaps) {
                    if (sprite.overlays.has(group2Id)) {
                        result = true;
                    }
                } else {
                    if (sprite.collisions.has(group2Id)) {
                        result = true;
                    }
                }
            }
        }
        for (let i = 0; i < entities2.length; i++) {
            const sprite = entities2[i];
            if (overlaps) {
                sprite.validOverlapsIds.add(group1Id);
            } else {
                sprite.validCollisionIds.add(group1Id);
            }
            this.addCollisionToQuadObjects(sprite);
            if(!result){
            if (overlaps) {
                if (sprite.overlays.has(group1Id)) {
                    result = true;
                }
            } else {
                if (sprite.collisions.has(group1Id)) {
                    result = true;
                }
            }
            }
        }
        return result;
    }

    /**
     * @param {number} groupId 
     * @param {boolean} overlaps 
     * @returns {boolean}
     */
    collidesOrOverlapsGroupSelfToSelf(entities, groupId, overlaps) {
        let result = false;
        for (let i = 0; i < entities.length; i++) {
            const sprite = entities[i];
            if (overlaps) {
                sprite.validOverlapsIds.add(groupId);
            } else {
                sprite.validCollisionIds.add(groupId);
            }
            this.addCollisionToQuadObjects(sprite);
            if(!result){
                if (overlaps) {
                    if (sprite.overlays.has(groupId)) {
                        result = true;
                    }
                } else {
                    if (sprite.collisions.has(groupId)) {
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    /**
     * @param {Quad} quad 
     */
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
                    if (!canOverlap && sprite.validOverlapsIds.has(sprite2.id)) {
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
                    this.processTree(q);
                }
            }
        }
    }

    static getAxisForBox(boxCollider, edge) {
        let axis = {hasAxis: false, length: 0, height: 0, m: 0, c: 0, vector:{x:0, y:0}, normal:{x:0, y:0}, edge: edge}

        if (boxCollider.w == boxCollider.h) {
            return axis; //box is a square, it has no internal axis
        } else {
            axis.hasAxis = true;
            if (edge == 1 || edge == 3) {
                axis.m = (boxCollider.vertices[1].y - boxCollider.vertices[0].y) / (boxCollider.vertices[1].x - boxCollider.vertices[0].x); //dy/dx
                axis.length = boxCollider.w;
                axis.height = boxCollider.h;
            } else if (edge == 2 || edge == 4) {
                axis.m = (boxCollider.vertices[2].y - boxCollider.vertices[0].y) / (boxCollider.vertices[2].x - boxCollider.vertices[0].x); //dy/dx
                axis.length = boxCollider.h;   
                axis.height = boxCollider.w;  
            } else {
                if (boxCollider.w > boxCollider.h) {
                    axis.m = (boxCollider.vertices[1].y - boxCollider.vertices[0].y) / (boxCollider.vertices[1].x - boxCollider.vertices[0].x); //dy/dx
                    axis.length = boxCollider.w;
                    axis.height = boxCollider.h;
                } else {
                    axis.m = (boxCollider.vertices[2].y - boxCollider.vertices[0].y) / (boxCollider.vertices[2].x - boxCollider.vertices[0].x); //dy/dx
                    axis.length = boxCollider.h;
                    axis.height = boxCollider.w;
                }
            }
            axis.c = boxCollider.y - (axis.m * boxCollider.x); //c = y - mx

            //work out the vector for that axis
            if (Number.isFinite(axis.m)) {
                const x = (boxCollider.x + 100);
                const y = (axis.m * x) + axis.c;
                axis.vector = CollisionUtilities.normalize(x-boxCollider.x, y-boxCollider.y);
            } else {
                axis.vector = {x:0, y:1};
            }
            axis.normal = CollisionUtilities.getNormal(axis.vector.x, axis.vector.y);

            return axis;
        }
    }

    /**
     * @param {Collider} circle1 
     * @param {Collider} circle2 
     */
    doCollideCircleToCircle(circle1, circle2) {
        //Get velocity vector
        const velocityV = {x: circle2.velocity.x - circle1.velocity.x, y: circle2.velocity.y - circle1.velocity.y};

        //get vector between circles
        let vectorBetween = { x: circle2.x - circle1.x, y: circle2.y - circle1.y };
        if (CollisionUtilities.difference(circle1.x, circle2.x) < CollisionUtilities.ERROR)  {
            vectorBetween.x = 0;
        }
        if (CollisionUtilities.difference(circle1.y, circle2.y) < CollisionUtilities.ERROR)  {
            vectorBetween.y = 0;
        }
        if (vectorBetween.x == 0 && vectorBetween.y == 0) {
            vectorBetween = {x: 0, y: CollisionUtilities.ERROR};
        }

        //calculate inverse masses
        let inverseMass1 = 0;
        let inverseMass2 = 0;
        if (!circle1.static && circle2.static) {
            inverseMass1 = 2;
        } else if (circle1.static && !circle2.static) {
            inverseMass2 = 2;
        } else if (!circle1.static && !circle2.static) {
            inverseMass1 = (2 * circle2.mass) / (circle1.mass + circle2.mass);
            inverseMass2 = (2 * circle1.mass) / (circle2.mass + circle1.mass);
        }
        
        const pushVector = (CollisionUtilities.dotProduct(velocityV, vectorBetween)) / CollisionUtilities.dotProduct(vectorBetween, vectorBetween);
        if (!circle1.static) {
            const mult = inverseMass1 * pushVector;
            circle1.collisionShape.newVelocityX += vectorBetween.x * mult;
            circle1.collisionShape.newVelocityY += vectorBetween.y * mult;
        }
        
        if (!circle2.static) {
            const mult = inverseMass2 * pushVector;
            circle2.collisionShape.newVelocityX -= vectorBetween.x * mult;
            circle2.collisionShape.newVelocityY -= vectorBetween.y * mult;
        } 

        //move objects apart to prevent collision over multiple frames
        let vectorN = CollisionUtilities.normalize(circle2.x - circle1.x, circle2.y - circle1.y);
        const difference = (circle1.radius + circle2.radius + CollisionUtilities.ERROR - CollisionUtilities.distanceBetweenpoints(circle2, circle1)) / 2;
        if (!circle1.static) {
            let x = -vectorN.x * difference * inverseMass1;
            let y = -vectorN.y * difference * inverseMass1;
            circle1.collisionShape.newX += x;
            circle1.collisionShape.newY += y;
        }
        if (!circle2.static) {
            let x = vectorN.x * difference * inverseMass2;
            let y = vectorN.y * difference * inverseMass2;
            circle2.collisionShape.newX += x;
            circle2.collisionShape.newY += y;
        }
    }

    /**
     * @param {Collider} circle 
     * @param {Collider} polygon 
     */
    doCollideCircleToPolygon(circle, polygon) {

        //Get velocity vector
        const velocityV = new CollisionVector(polygon.velocity.x - circle.velocity.x, polygon.velocity.y - circle.velocity.y);

        //find which edge has the closest intersect to the circle center
        let intersect = polygon.collisionShape.getEdgeIntersectFromCircle(circle.collisionShape);
        let vectorBetween = null;
        
        if (intersect != null) {
            vectorBetween = new CollisionVector(intersect.x - circle.x, intersect.y - circle.y);

        } else {

            //get vector between shapes
            vectorBetween = new CollisionVector(polygon.x - circle.x, polygon.y - circle.y);
            if (CollisionUtilities.difference(circle.x, polygon.x) < CollisionUtilities.ERROR)  {
                vectorBetween = new CollisionVector(0, vectorBetween.y);
            }
            if (CollisionUtilities.difference(circle.y, polygon.y) < CollisionUtilities.ERROR)  {
                vectorBetween = new CollisionVector(vectorBetween.x, 0);
            }
            if (vectorBetween.x == 0 && vectorBetween.y == 0) {
                vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
            }
        }

        //calculate inverse masses
        let inverseMass1 = 0;
        let inverseMass2 = 0;
        if (!circle.static && polygon.static) {
            inverseMass1 = 2;
        } else if (circle.static && !polygon.static) {
            inverseMass2 = 2;
        } else if (!circle.static && !polygon.static) {
            inverseMass1 = (2 * polygon.mass) / (circle.mass + polygon.mass);
            inverseMass2 = (2 * circle.mass) / (polygon.mass + circle.mass);
        }
        
        const pushVector = (CollisionUtilities.dotProduct(velocityV, vectorBetween)) / CollisionUtilities.dotProduct(vectorBetween, vectorBetween);
        if (!circle.static) {
            const mult = inverseMass1 * pushVector;
            circle.collisionShape.newVelocityX += vectorBetween.x * mult;
            circle.collisionShape.newVelocityY += vectorBetween.y * mult;
        }
        
        if (!polygon.static) {
            const mult = inverseMass2 * pushVector;
            polygon.collisionShape.newVelocityX -= vectorBetween.x * mult;
            polygon.collisionShape.newVelocityY -= vectorBetween.y * mult;
        }

        let normilizedVector = vectorBetween.normalized().multiply(CollisionUtilities.ERROR);
        let collides = true;
        let count = 0;
        
        while(collides && count < 1000) {
            count += 1;
            if (circle.static == false) {
                circle.collisionShape.newX -= normilizedVector.x * inverseMass1;
                circle.collisionShape.newY -= normilizedVector.y * inverseMass1;
            }
            if (polygon.static == false) {
                polygon.collisionShape.newX += normilizedVector.x * inverseMass2;
                polygon.collisionShape.newY += normilizedVector.y * inverseMass2;
            }
            collides = polygon.collisionShape.doesCircleIntersect(circle.x + circle.collisionShape.newX, circle.y + circle.collisionShape.newY, circle.radius);
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollideBoxToBox(collider1, collider2) {

        //Get velocity vector
        const velocityV = new CollisionVector(collider2.velocity.x - collider1.velocity.x, collider2.velocity.y - collider1.velocity.y);

        let vectorBetween = collider2.collisionShape.getVectorFromPolygonIntersect(collider1.collisionShape);
        
        if (vectorBetween == null) {

            //get vector between shapes
            vectorBetween = new CollisionVector(collider2.x - collider1.x, collider2.y - collider1.y);
            if (CollisionUtilities.difference(collider1.x, collider2.x) < CollisionUtilities.ERROR)  {
                vectorBetween = new CollisionVector(0, vectorBetween.y);
            }
            if (CollisionUtilities.difference(collider1.y, collider2.y) < CollisionUtilities.ERROR)  {
                vectorBetween = new CollisionVector(vectorBetween.x, 0);
            }
            if (vectorBetween.x == 0 && vectorBetween.y == 0) {
                vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
            }
        }

        //calculate inverse masses
        let inverseMass1 = 0;
        let inverseMass2 = 0;
        if (!collider1.static && collider2.static) {
            inverseMass1 = 2;
        } else if (collider1.static && !collider2.static) {
            inverseMass2 = 2;
        } else if (!collider1.static && !collider2.static) {
            inverseMass1 = (2 * collider2.mass) / (collider1.mass + collider2.mass);
            inverseMass2 = (2 * collider1.mass) / (collider2.mass + collider1.mass);
        }
        
        const pushVector = (CollisionUtilities.dotProduct(velocityV, vectorBetween)) / CollisionUtilities.dotProduct(vectorBetween, vectorBetween);
        if (!collider1.static) {
            const mult = inverseMass1 * pushVector;
            collider1.collisionShape.newVelocityX += vectorBetween.x * mult;
            collider1.collisionShape.newVelocityY += vectorBetween.y * mult;
        }
        
        if (!collider2.static) {
            const mult = inverseMass2 * pushVector;
            collider2.collisionShape.newVelocityX -= vectorBetween.x * mult;
            collider2.collisionShape.newVelocityY -= vectorBetween.y * mult;
        }

        let normilizedVector = vectorBetween.normalized().multiply(CollisionUtilities.ERROR);
        let collides = true;
        let count = 0;
        while(collides && count < 100) {
            count += 1;
            if (collider1.static == false) {
                collider1.collisionShape.newX -= normilizedVector.x * inverseMass1;
                collider1.collisionShape.newY -= normilizedVector.y * inverseMass1;
            }
            if (collider2.static == false) {
                collider2.collisionShape.newX += normilizedVector.x * inverseMass2;
                collider2.collisionShape.newY += normilizedVector.y * inverseMass2;
            }
            collides = collider2.collisionShape.doesPolygonIntersect(collider1.collisionShape, circle.x + collider1.collisionShape.newX, circle.y + collider1.collisionShape.newY);
        }

        /*
        let boxPoint1 = null;
        let boxPoint2 = null;

        if (collider1.w == collider1.h) {
            //this is a square with no axis
            boxPoint1 = { x: collider1.x, y: collider1.y};
        } else {
            let boxAxis1 = CollisionManager.getAxisForBox(collider1, 0);
            
            boxPoint1 = CollisionUtilities.lineIntersectsLine(collider1.x, collider1.y, collider1.x + boxAxis1.vector.x, collider1.y + boxAxis1.vector.y,
                collider2.x, collider2.y, collider2.x + boxAxis1.normal.x, collider2.y + boxAxis1.normal.y
            );

            let intersectVector = {x: boxPoint1.x - collider1.x, y: boxPoint1.y - collider1.y};
            //clip intersect to end of box
            let dist = CollisionUtilities.distance(intersectVector.x, intersectVector.y);
            let radius = (boxAxis1.length/2) - (boxAxis1.height/2);
            if (dist > radius) {
                let limitedVector = CollisionUtilities.normalize(intersectVector.x, intersectVector.y);
                let percentage = (radius / dist) * dist;
                limitedVector.x = collider1.x + (limitedVector.x * percentage);
                limitedVector.y = collider1.y + (limitedVector.y * percentage);
                boxPoint1 = limitedVector;
            }
        }
        if (collider2.w == collider2.h) {
            //this is a square with no axis
            boxPoint2 = { x: collider2.x, y: collider2.y};
        } else {
            let boxAxis2 = CollisionManager.getAxisForBox(collider2, 0);
            
            boxPoint2 = CollisionUtilities.lineIntersectsLine(collider2.x, collider2.y, collider2.x + boxAxis2.vector.x, collider2.y + boxAxis2.vector.y,
                collider1.x, collider1.y, collider1.x + boxAxis2.normal.x, collider1.y + boxAxis2.normal.y
            );

            let intersectVector = {x: boxPoint2.x - collider2.x, y: boxPoint2.y - collider2.y};
            //clip intersect to end of box
            let dist = CollisionUtilities.distance(intersectVector.x, intersectVector.y);
            let radius = (boxAxis2.length/2) - (boxAxis2.height/2);
            if (dist > radius) {
                let limitedVector = CollisionUtilities.normalize(intersectVector.x, intersectVector.y);
                let percentage = (radius / dist) * dist;
                limitedVector.x = collider2.x + (limitedVector.x * percentage);
                limitedVector.y = collider2.y + (limitedVector.y * percentage);
                boxPoint2 = limitedVector;
            }
        }

        let intersect = CollisionUtilities.intersectBetweenRectangles(
            collider1.vertices[0].x, collider1.vertices[0].y,
            collider1.vertices[1].x, collider1.vertices[1].y,
            collider1.vertices[2].x, collider1.vertices[2].y,
            collider1.vertices[3].x, collider1.vertices[3].y, 
            collider2.vertices[0].x, collider2.vertices[0].y,
            collider2.vertices[1].x, collider2.vertices[1].y,
            collider2.vertices[2].x, collider2.vertices[2].y,
            collider2.vertices[3].x, collider2.vertices[3].y
        );
        if (intersect == null) { //rectangle entirely within rectangle
            intersect = {x: collider1.x, y: collider1.y};
        }
        if ((intersect.x == collider1.x && intersect.y == collider1.y) || (intersect.x == collider2.x && intersect.y == collider2.y)) { //exactly on top of each other
            intersect.x += CollisionUtilities.ERROR;
            intersect.y += CollisionUtilities.ERROR;
        }

        let inverseMass1 = 0;
        let inverseMass2 = 0;
        if (!collider1.static && collider2.static) {
            inverseMass1 = 2;
        } else if (collider1.static && !collider2.static) {
            inverseMass2 = 2;
        } else if (!collider1.static && !collider2.static) {
            inverseMass1 = (2 * collider2.mass) / (collider1.mass + collider2.mass);
            inverseMass2 = (2 * collider1.mass) / (collider2.mass + collider1.mass);
        }

        let v1 = {x: collider1.velocity.x, y: collider1.velocity.y};
        let v2 = {x: collider2.velocity.x, y: collider2.velocity.y};

        //get intersect line
        let intersectLine = CollisionUtilities.getEdgeLineGoesThrough(boxPoint1.x, boxPoint1.y, boxPoint2.x, boxPoint2.y, 
            collider2.vertices[0].x, collider2.vertices[0].y,
            collider2.vertices[1].x, collider2.vertices[1].y,
            collider2.vertices[2].x, collider2.vertices[2].y,
            collider2.vertices[3].x, collider2.vertices[3].y
        )

        if (intersectLine == null) { //circle entirely within rectangle
            intersectLine = {x1: collider1.x, y1: collider1.y, x2: collider2.x, y2: collider2.y};
        }
        if (intersectLine.x1 == intersectLine.x2 && intersectLine.y1 == intersectLine.y2) { //exactly on top of each other
            intersectLine.x1 += CollisionUtilities.ERROR;
        }

        let normalVector = CollisionUtilities.getNormal(intersectLine.x2 - intersectLine.x1, intersectLine.y2 - intersectLine.y1);
        const dist = CollisionUtilities.distance(intersectLine.x2 - intersectLine.x1, intersectLine.y2 - intersectLine.y1);
        normalVector.x = normalVector.x * dist;
        normalVector.y= normalVector.y * dist;

        if (collider1.static == false) {
            let vectorV = {x: v1.x - v2.x, y: v1.y - v2.y};

            let mult = inverseMass1 * ((CollisionUtilities.dotProduct(vectorV, normalVector)) / CollisionUtilities.dotProduct(normalVector, normalVector));
            collider1.velocity.x -= normalVector.x * mult;
            collider1.velocity.y -= normalVector.y * mult;

            normalVector = CollisionUtilities.normalize(normalVector.x, normalVector.y);  
        }

        if (collider2.static == false) {
            let vectorV = {x: v2.x - v1.x, y: v2.y - v1.y};

            let mult = inverseMass2 * ((CollisionUtilities.dotProduct(vectorV, normalVector)) / CollisionUtilities.dotProduct(normalVector, normalVector));
            collider2.velocity.x -= normalVector.x * mult;
            collider2.velocity.y -= normalVector.y * mult;

            normalVector = CollisionUtilities.normalize(normalVector.x, normalVector.y);
        }

        let normilizedVector = CollisionUtilities.normalize(boxPoint2.x - boxPoint1.x, boxPoint2.y - boxPoint1.y);
        
        let intersectLinePoint = CollisionUtilities.lineIntersectsLine(intersectLine.x1, intersectLine.y1, intersectLine.x2, intersectLine.y2, 
            boxPoint1.x, boxPoint1.y, boxPoint2.x, boxPoint2.y
        )

        let count = 0;
        let collides = true;
        while(collides && count < 100) {
            count += 1;
            if (collider1.static == false) {
                collider1.x -= normilizedVector.x * inverseMass1;
                collider1.y -= normilizedVector.y * inverseMass1;
                collider1.updateCollision();
            }
            if (collider2.static == false) {
                collider2.x += normilizedVector.x * inverseMass2;
                collider2.y += normilizedVector.y * inverseMass2;
                collider2.updateCollision();
            }

            collides = CollisionUtilities.rectangleIntersectsRectangle(collider1.vertices[0].x, collider1.vertices[0].y, 
                collider1.vertices[1].x, collider1.vertices[1].y,
                collider1.vertices[2].x, collider1.vertices[2].y, 
                collider1.vertices[3].x, collider1.vertices[3].y, 
                collider2.vertices[0].x, collider2.vertices[0].y, 
                collider2.vertices[1].x, collider2.vertices[1].y,
                collider2.vertices[2].x, collider2.vertices[2].y, 
                collider2.vertices[3].x, collider2.vertices[3].y);
        }
        */
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollide(collider1, collider2) {
        if (collider1.shape == "circle" && collider2.shape == "circle") {
            this.doCollideCircleToCircle(collider1, collider2);
        } else if (collider1.shape == "circle" && collider2.shape == "box") {
            this.doCollideCircleToPolygon(collider1, collider2);
        } else if (collider1.shape == "box" && collider2.shape == "circle") {
            this.doCollideCircleToPolygon(collider2, collider1);
        } else if (collider1.shape == "box" && collider2.shape == "box") {
            this.doCollideBoxToBox(collider1, collider2);
        }
    }

    startCollisions() {
        this.#quadTree.makeTree(this.#collisionObjects);
        this.processTree(this.#quadTree.getTree());
    }

    handleCollisions() {
        this.loopThroughCollisions(false);
        this.loopThroughCollisions(true);
    }

    loopThroughCollisions(doStatics) {
        for (let j = 0; j < this.#collisionCounter; j += 3) {
            const c1 = this.#pendingCollisionArray[j];
            const c2 = this.#pendingCollisionArray[j + 1];
            const isStatic = c1.static || c2.static;
    
            if (isStatic == doStatics) {
                const overlaps = this.collidersOverlap(c1, c2);
                if (overlaps) {
                    const type = this.#pendingCollisionArray[j + 2];
                    if (type === 1) { //1 MEANS COLLIDE
                        for(let i=0; i<c2.groupsOwnedBy.length; i++){
                            c1.collisions.add(c2.groupsOwnedBy[i]);
                        }
                        for(let i=0; i<c1.groupsOwnedBy.length; i++){
                            c2.collisions.add(c1.groupsOwnedBy[i]);
                        }
                        c1.collisions.add(c2.id);
                        c2.collisions.add(c1.id);
                        this.doCollide(c1, c2);
                    } else { //0 means overlay
                        for(let i=0; i<c2.groupsOwnedBy.length; i++){
                            c1.overlays.add(c2.groupsOwnedBy[i]);
                        }
                        for(let i=0; i<c1.groupsOwnedBy.length; i++){
                            c2.overlays.add(c1.groupsOwnedBy[i]);
                        }
                        c1.overlays.add(c2.id);
                        c2.overlays.add(c1.id);
                    }
                }
            }
        }
    }

    finishCollisions() {
        this.#pendingCollision = new Set();
        this.#collisionCounter = 0;
        this.#collisionObjects = new Array();
        this.#collisionObjectsIds = new Set();
    }
}
