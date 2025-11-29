import { tad } from "./TeachAndDraw.js";
import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { QuadTree, Quad } from "./QuadTree.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { CollisionVector } from "./CollisionVector.js";
import { Vector } from "./Vector.js";
import { CollisionTriangle } from "./CollisionTriangle.js";
import { CollisionCircle } from "./CollisionCircle.js";
import { CollisionPolygon } from "./CollisionPolygon.js";

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

    #SCALER_LIMIT = 100.1;

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
        if (isNaN(vectorBetween.x) || isNaN(vectorBetween.y)) {
            vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
        }
        
        let angle1 = 0;
        if (circle1.velocity.x != 0 || circle1.velocity.y != 0 && velocityV.x != 0 || velocityV.y != 0)
        {
            angle1 = CollisionUtilities.angleBetweenVectors(new Vector(circle1.velocity.x, circle1.velocity.y), new Vector(vectorBetween.x, vectorBetween.y));
            if (isNaN(angle1)) {
                angle1 = 0;
            }
        }

        let percentage = angle1 / 90;
        let rotationToAddToCircle1 = 0;
        let rotationToAddToCircle2 = 0;
        if (velocityV.x != 0 || velocityV.y != 0)
        {
            let dist = CollisionUtilities.distance(velocityV.x, velocityV.y);
            if (isNaN(dist)) {
                dist = 0;
            }
            rotationToAddToCircle1 = dist * percentage * (0.05 / circle1.torque);
            rotationToAddToCircle2 = dist * percentage * (0.05 / circle2.torque);
        }

        let direction = CollisionTriangle.isPointBeforeOtherPointClockwise({x: 0, y: 0}, {x: circle1.velocity.x, y: circle1.velocity.y}, {x: vectorBetween.x, y: vectorBetween.y});
        if (direction)
        {
            rotationToAddToCircle1 = -rotationToAddToCircle1;
            rotationToAddToCircle2 = -rotationToAddToCircle2;
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
            const bounce = circle1.bounciness / this.#SCALER_LIMIT;
            const grip = circle1.grip / this.#SCALER_LIMIT;
            const collisionCount = circle2.collisions.size-2;
            console.log(circle2.collisions);
            circle1.collisionShape.newVelocityX += vectorBetween.x * mult * bounce * (1 / collisionCount);
            circle1.collisionShape.newVelocityY += vectorBetween.y * mult * bounce * (1 / collisionCount);
            circle1.collisionShape.newVelocityRot += rotationToAddToCircle1 * grip * mult * (1 / collisionCount);
        }
        
        if (!circle2.static) {
            const mult = inverseMass2 * pushVector;
            const bounce = circle2.bounciness / this.#SCALER_LIMIT;
            const grip = circle2.grip / this.#SCALER_LIMIT;
            const collisionCount = circle1.collisions.size-2;
            circle2.collisionShape.newVelocityX -= vectorBetween.x * mult * bounce * (1 / collisionCount);
            circle2.collisionShape.newVelocityY -= vectorBetween.y * mult * bounce * (1 / collisionCount);
            circle2.collisionShape.newVelocityRot -= rotationToAddToCircle2 * grip * mult * (1 / collisionCount);
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

        //find which edge has the closest intersect to the circle center
        let intersect = polygon.collisionShape.getEdgeIntersectFromCircle(circle.collisionShape);
        let vectorBetween = null;
        
        if (intersect != null) {
            vectorBetween = new CollisionVector(intersect.x - circle.x, intersect.y - circle.y);
        } else {
            //get vector between shapes
            vectorBetween = new CollisionVector(polygon.x - circle.x, polygon.y - circle.y);
            intersect = new CollisionVector(circle.x, circle.y);
        }

        if (CollisionUtilities.difference(circle.x, polygon.x) < CollisionUtilities.ERROR)  {
            vectorBetween = new CollisionVector(0, vectorBetween.y);
        }
        if (CollisionUtilities.difference(circle.y, polygon.y) < CollisionUtilities.ERROR)  {
            vectorBetween = new CollisionVector(vectorBetween.x, 0);
        }
        if (vectorBetween.x == 0 && vectorBetween.y == 0) {
            vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
        }

        //Calculate rotational forces
        let pushForce = CollisionUtilities.getVectorOfPointTravelledAroundPoint(polygon.x, polygon.y, intersect.x, intersect.y, polygon.rotationalVelocity);
        pushForce = new CollisionVector(-pushForce.x, -pushForce.y);

        if (isNaN(intersect.x) || isNaN(intersect.y)) {
            intersect = new CollisionVector(circle.x, circle.y);
        }
        if (isNaN(vectorBetween.x) || isNaN(vectorBetween.y)) {
            vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
        }
        if (isNaN(pushForce.x) || isNaN(pushForce.y)) {
            pushForce = new CollisionVector(0, 0);
        }

        let angle = 0;
        if (pushForce.x != 0 || pushForce.y != 0) {
            angle = CollisionUtilities.angleBetweenVectors(new Vector(pushForce.x, pushForce.y), new Vector(-vectorBetween.x, -vectorBetween.y));
            if (isNaN(angle)) {
                angle = 0;
            }
            if (polygon.rotationalVelocity < 0) {
                pushForce = CollisionUtilities.rotatePointAroundPoint(pushForce.x, pushForce.y, 0, 0, angle * 2);
            } else {
                pushForce = CollisionUtilities.rotatePointAroundPoint(pushForce.x, pushForce.y, 0, 0, angle * -2);
            }
        }
        
        //do circle
        let percentage = angle / 90;
        let rotationToAddToCircle = 1 / (circle.torque * 0.5);
        if (polygon.rotationalVelocity < 0) {
            rotationToAddToCircle = -rotationToAddToCircle;
        }
        
        let circleForce = new CollisionVector(circle.velocity.x, circle.velocity.y);
        let rotationalForce = new CollisionVector(circleForce.x - pushForce.x, circleForce.y - pushForce.y); 
        let length = rotationalForce.length();
        if (isNaN(length)) {
            length = 0;
        }

        //do polygon
        percentage = CollisionUtilities.distanceBetweenpoints(polygon, intersect) / polygon.radius;
        let rotationToAddToPolygon = length * percentage * (0.05 / circle.torque);
        let direction = CollisionTriangle.isPointBeforeOtherPointClockwise({x: polygon.x, y: polygon.y}, {x: intersect.x, y: intersect.y}, {x: circle.x, y: circle.y});
        if (direction) {
            rotationToAddToPolygon = -rotationToAddToPolygon;
        }

        //Get velocity vector
        let velocityV = new CollisionVector(polygon.velocity.x - circle.velocity.x + pushForce.x, polygon.velocity.y - circle.velocity.y + pushForce.y);

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
            const bounce = circle.bounciness / this.#SCALER_LIMIT;
            const grip = circle.grip / this.#SCALER_LIMIT;
            const collisionCount = polygon.collisions.size-2;
            circle.collisionShape.newVelocityX += (vectorBetween.x - (pushForce.x * grip)) * mult * bounce * (1 / collisionCount);
            circle.collisionShape.newVelocityY += (vectorBetween.y - (pushForce.y * grip)) * mult * bounce * (1 / collisionCount);
            circle.collisionShape.newVelocityRot += rotationToAddToCircle * grip * mult * (1 / collisionCount);
        }
        
        if (!polygon.static) {
            const mult = inverseMass2 * pushVector;
            const bounce = polygon.bounciness / this.#SCALER_LIMIT;
            const grip = polygon.grip / this.#SCALER_LIMIT;
            const collisionCount = circle.collisions.size-2;
            polygon.collisionShape.newVelocityX -= (vectorBetween.x + (pushForce.x * grip)) * mult * bounce * (1 / collisionCount);
            polygon.collisionShape.newVelocityY -= (vectorBetween.y + (pushForce.y * grip)) * mult * bounce * (1 / collisionCount);
            polygon.collisionShape.newVelocityRot += rotationToAddToPolygon * grip * mult * (1 / collisionCount);
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

            let newCircle = new CollisionCircle(circle.x + circle.collisionShape.newX, circle.y + circle.collisionShape.newY, circle.radius);
            let points = polygon.collisionShape.copyPoints(polygon.collisionShape.newX, polygon.collisionShape.newY);
            let newPolygon = new CollisionPolygon(polygon.x + polygon.collisionShape.newX, polygon.y + polygon.collisionShape.newY, points);

            collides = newPolygon.doesCircleIntersect(newCircle.x, newCircle.y, newCircle.radius);                
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollideBoxToBox(collider1, collider2) {

        //Get velocity vector
        let intersect = null;
        let vectorBetween = null;

        let values = collider2.collisionShape.getVectorFromPolygonIntersect(collider1.collisionShape);
        if (values != null) {
            intersect = values[0];
            vectorBetween = values[1];
        } else {
            //get vector between shapes
            vectorBetween = new CollisionVector(collider2.x - collider1.x, collider2.y - collider1.y);
            intersect = new CollisionVector((collider2.x + collider1.x) / 2, (collider2.y + collider1.y) / 2);
        }
            
        if (CollisionUtilities.difference(collider1.x, collider2.x) < CollisionUtilities.ERROR)  {
            vectorBetween = new CollisionVector(0, vectorBetween.y);
        }
        if (CollisionUtilities.difference(collider1.y, collider2.y) < CollisionUtilities.ERROR)  {
            vectorBetween = new CollisionVector(vectorBetween.x, 0);
        }
        if (vectorBetween.x == 0 && vectorBetween.y == 0) {
            vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
        }
        if (isNaN(intersect.x) || isNaN(intersect.y)) {
            intersect = new CollisionVector((collider2.x + collider1.x) / 2, (collider2.y + collider1.y) / 2);
        }
        if (isNaN(vectorBetween.x) || isNaN(vectorBetween.y)) {
            vectorBetween = new CollisionVector(0, CollisionUtilities.ERROR)
        }

        //Calculate rotational forces
        let pushForce1 = CollisionUtilities.getVectorOfPointTravelledAroundPoint(collider1.x, collider1.y, intersect.x, intersect.y, collider1.rotationalVelocity);
        pushForce1 = new CollisionVector(-pushForce1.x, -pushForce1.y);
        if (isNaN(pushForce1.x) || isNaN(pushForce1.y)) {
            pushForce1 = new CollisionVector(0, 0);
        }

        let angle1 = 0;
        if (pushForce1.x != 0 || pushForce1.y != 0) {
            angle1 = CollisionUtilities.angleBetweenVectors(new Vector(pushForce1.x, pushForce1.y), new Vector(-vectorBetween.x, -vectorBetween.y));
            if (isNaN(angle1)) {
                angle1 = 0;
            }
            if (collider2.rotationalVelocity < 0) {
                pushForce1 = CollisionUtilities.rotatePointAroundPoint(pushForce1.x, pushForce1.y, 0, 0, angle1 * 2);
            } else {
                pushForce1 = CollisionUtilities.rotatePointAroundPoint(pushForce1.x, pushForce1.y, 0, 0, angle1 * -2);
            }
        }

        let pushForce2 = CollisionUtilities.getVectorOfPointTravelledAroundPoint(collider2.x, collider2.y, intersect.x, intersect.y, collider2.rotationalVelocity);
        pushForce2 = new CollisionVector(-pushForce2.x, -pushForce2.y);
        if (isNaN(pushForce2.x) || isNaN(pushForce2.y)) {
            pushForce2 = new CollisionVector(0, 0);
        }

        let angle2 = 0;
        if (pushForce2.x != 0 || pushForce2.y != 0) {
            angle2 = CollisionUtilities.angleBetweenVectors(new Vector(pushForce2.x, pushForce2.y), new Vector(-vectorBetween.x, -vectorBetween.y));
            if (isNaN(angle2)) {
                angle2 = 0;
            }
            if (collider2.rotationalVelocity < 0) {
                pushForce2 = CollisionUtilities.rotatePointAroundPoint(pushForce2.x, pushForce2.y, 0, 0, angle2 * 2);
            } else {
                pushForce2 = CollisionUtilities.rotatePointAroundPoint(pushForce2.x, pushForce2.y, 0, 0, angle2 * -2);
            }
        }
        let pushForce = {x: pushForce1.x + pushForce2.x, y: pushForce1.y + pushForce2.y};

        //do polygon1
        let rollingToFlats = collider1.collisionShape.getRotationDirection(vectorBetween.getNormal(), intersect);
        if (isNaN(rollingToFlats)) {
            rollingToFlats = 0;
        }
        let rotationalForce = new CollisionVector(collider2.velocity.x - pushForce.x, collider2.velocity.y - pushForce.y); 
        let percentage = CollisionUtilities.distanceBetweenpoints(collider2, intersect) / collider2.radius;
        if (isNaN(percentage)) {
            percentage = 0;
        }
        let direction = CollisionTriangle.isPointBeforeOtherPointClockwise({x: collider2.x, y: collider2.y}, {x: intersect.x, y: intersect.y}, {x: collider1.x, y: collider1.y});
        let rotation = rotationalForce.length();
        if (isNaN(rotation)) {
            rotation = 0;
        }
        if (direction)
        {
            rotation = -rotation;
        }
        let rotationToAddToPolygon1 = (rotation + rollingToFlats) * percentage * (0.05 / collider1.torque);

        //do polygon2
        rollingToFlats = collider2.collisionShape.getRotationDirection(vectorBetween.getNormal(), intersect);
        if (isNaN(rollingToFlats)) {
            rollingToFlats = 0;
        }
        rotationalForce = new CollisionVector(collider1.velocity.x + pushForce.x, collider1.velocity.y + pushForce.y); 
        percentage = CollisionUtilities.distanceBetweenpoints(collider1, intersect) / collider1.radius;
        if (isNaN(percentage)) {
            percentage = 0;
        }
        direction = CollisionTriangle.isPointBeforeOtherPointClockwise({x: collider1.x, y: collider1.y}, {x: intersect.x, y: intersect.y}, {x: collider2.x, y: collider2.y});
        rotation = rotationalForce.length();
        if (isNaN(rotation)) {
            rotation = 0;
        }
        if (direction)
        {
            rotation = -rotation;
        }
        let rotationToAddToPolygon2 = (rotation + rollingToFlats) * percentage * (0.05 / collider2.torque);

        //const velocityV = new CollisionVector(collider2.velocity.x - collider1.velocity.x + pushForce.x, collider2.velocity.y - collider1.velocity.y + pushForce.y);
        const velocityV = new CollisionVector(-collider1.velocity.x, -collider1.velocity.y);

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
            const bounce = collider1.bounciness / this.#SCALER_LIMIT;
            const grip = collider1.grip / this.#SCALER_LIMIT;
            const collisionCount = collider2.collisions.size-2;
            collider1.collisionShape.newVelocityX += (vectorBetween.x - (pushForce.x * grip)) * mult * bounce * (1/collisionCount);
            collider1.collisionShape.newVelocityY += (vectorBetween.y - (pushForce.y * grip)) * mult * bounce * (1/collisionCount);
            collider1.collisionShape.newVelocityRot += rotationToAddToPolygon1 * grip * mult * (1/collisionCount);
        }
        
        if (!collider2.static) {
            const mult = inverseMass2 * pushVector;
            const bounce = collider2.bounciness / this.#SCALER_LIMIT;
            const grip = collider2.grip / this.#SCALER_LIMIT;
            const collisionCount = collider1.collisions.size-2;
            collider2.collisionShape.newVelocityX -= (vectorBetween.x + (pushForce.x * grip)) * mult * bounce * (1/collisionCount);
            collider2.collisionShape.newVelocityY -= (vectorBetween.y + (pushForce.y * grip)) * mult * bounce * (1/collisionCount);
            collider2.collisionShape.newVelocityRot += rotationToAddToPolygon2 * grip * mult * (1/collisionCount);
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

            let points1 = collider1.collisionShape.copyPoints(collider1.collisionShape.newX, collider1.collisionShape.newY);
            let points2 = collider2.collisionShape.copyPoints(collider2.collisionShape.newX, collider2.collisionShape.newY);
            let newPolygon1 = new CollisionPolygon(collider1.x + collider1.collisionShape.newX, collider1.y + collider1.collisionShape.newY, points1);
            let newPolygon2 = new CollisionPolygon(collider2.x + collider2.collisionShape.newX, collider2.y + collider2.collisionShape.newY, points2);
            
            collides = newPolygon1.doesPolygonIntersect(newPolygon2, 0, 0);
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollide(collider1, collider2) {
        if (collider1.collisionShape == null || collider2.collisionShape == null) {
            return;
        }

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
        let listOfCollisions = new Array();
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
                        listOfCollisions.push([c1, c2]);
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
        for (let i = 0; i < listOfCollisions.length; i += 1) {
            const c1 = listOfCollisions[i][0];
            const c2 = listOfCollisions[i][1];
            this.doCollide(c1, c2);
        }
    }

    finishCollisions() {
        this.#pendingCollision = new Set();
        this.#collisionCounter = 0;
        this.#collisionObjects = new Array();
        this.#collisionObjectsIds = new Set();
    }
}
