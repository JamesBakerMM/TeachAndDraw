import { Collider } from "./Collider.js";
import { CollisionUtilities } from "./CollisionUtilities.js";
import { QuadTree, Quad } from "./QuadTree.js";

//errors
import { ErrorMsgManager } from "./ErrorMessageManager.js";

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

        if (collider1.shape === "circle" && collider2.shape === "circle") {
            return result;
        }

        if (!result)
            return false;

        if (collider1.shape === "box" && collider2.shape === "circle") {
            return CollisionUtilities.rectangleIntersectsCircle(collider2.x, collider2.y, collider2.radius, 
                                                collider1.vertices[0].x, collider1.vertices[0].y, 
                                                collider1.vertices[1].x, collider1.vertices[1].y,
                                                collider1.vertices[2].x, collider1.vertices[2].y, 
                                                collider1.vertices[3].x, collider1.vertices[3].y);
        } else if (collider1.shape === "circle" && collider2.shape === "box") {
            return CollisionUtilities.rectangleIntersectsCircle(collider1.x, collider1.y, collider1.radius, 
                                                collider2.vertices[0].x, collider2.vertices[0].y, 
                                                collider2.vertices[1].x, collider2.vertices[1].y,
                                                collider2.vertices[2].x, collider2.vertices[2].y, 
                                                collider2.vertices[3].x, collider2.vertices[3].y);
        } else {
            return CollisionUtilities.rectangleIntersectsRectangle(collider1.vertices[0].x, collider1.vertices[0].y, 
                                                collider1.vertices[1].x, collider1.vertices[1].y,
                                                collider1.vertices[2].x, collider1.vertices[2].y, 
                                                collider1.vertices[3].x, collider1.vertices[3].y, 
                                                collider2.vertices[0].x, collider2.vertices[0].y, 
                                                collider2.vertices[1].x, collider2.vertices[1].y,
                                                collider2.vertices[2].x, collider2.vertices[2].y, 
                                                collider2.vertices[3].x, collider2.vertices[3].y);
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

            //$.colour.stroke = "black";
            //$.shape.line(boxCollider.x - (axis.vector.x * axis.length/2), boxCollider.y - (axis.vector.y * axis.length/2), boxCollider.x + (axis.vector.x * axis.length/2), boxCollider.y + (axis.vector.y * axis.length/2));
            //$.shape.line(boxCollider.x + (axis.normal.x * axis.height/2), boxCollider.y + (axis.normal.y * axis.height/2), boxCollider.x - (axis.normal.x * axis.height/2), boxCollider.y - (axis.normal.y * axis.height/2));

            return axis;
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollideCircleToCircle(collider1, collider2) {
        
        //Get velocity vector
        const velocityV = {x: collider2.velocity.x - collider1.velocity.x, y: collider2.velocity.y - collider1.velocity.y};

        //get vector between circles
        let vectorBetween = { x: collider2.x - collider1.x, y: collider2.y - collider1.y };
        if (CollisionUtilities.difference(collider1.x, collider2.x) < CollisionUtilities.ERROR)  {
            vectorBetween.x = 0;
        }
        if (CollisionUtilities.difference(collider1.y, collider2.y) < CollisionUtilities.ERROR)  {
            vectorBetween.y = 0;
        }
        if (vectorBetween.x == 0 && vectorBetween.y == 0) {
            vectorBetween = {x: 0, y: CollisionUtilities.ERROR};
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
            collider1.velocity.x += vectorBetween.x * mult;
            collider1.velocity.y += vectorBetween.y * mult;
        }
        
        if (!collider2.static) {
            const mult = inverseMass2 * pushVector;
            collider2.velocity.x -= vectorBetween.x * mult;
            collider2.velocity.y -= vectorBetween.y * mult;
        }

        //move objects apart to prevent collision over multiple frames
        let vectorN = CollisionUtilities.normalize(collider2.x - collider1.x, collider2.y - collider1.y);
        const difference = (collider1.radius + collider2.radius + CollisionUtilities.ERROR - CollisionUtilities.distanceBetweenpoints(collider2, collider1)) / 2;
        if (!collider1.static) {
            let x = -vectorN.x * difference * inverseMass1;
            let y = -vectorN.y * difference * inverseMass1;
            collider1.x += x;
            collider1.y += y;
        }
        if (!collider2.static) {
            let x = vectorN.x * difference * inverseMass2;
            let y = vectorN.y * difference * inverseMass2;
            collider2.position.x += x;
            collider2.position.y += y;
        }
    }

       /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
       doCollideCircleToBox(collider1, collider2) {

        //label the differet colliders to handle both situations
        let circleCollider = collider1;
        let boxCollider = collider2;
        if (collider1.shape == "box" && collider2.shape == "circle") {
            circleCollider = collider2;
            boxCollider = collider1;
        }

        //check if we've hit any corner points
        let point = CollisionUtilities.rectanglePointsInsideCircle(circleCollider.x, circleCollider.y, circleCollider.radius, 
            boxCollider.vertices[0].x, boxCollider.vertices[0].y,
            boxCollider.vertices[1].x, boxCollider.vertices[1].y,
            boxCollider.vertices[2].x, boxCollider.vertices[2].y,
            boxCollider.vertices[3].x, boxCollider.vertices[3].y
        );

        let boxPoint = null;
        let boxAxisLength = 0;
        if (boxCollider.w == boxCollider.h) {
            //this is a square with no axis
            boxPoint = { x: boxCollider.x, y: boxCollider.y};
            boxAxisLength = boxCollider.w;

        } else {
            let boxAxis = CollisionManager.getAxisForBox(boxCollider, 0);
            boxAxisLength = boxAxis.length;
            
            boxPoint = CollisionUtilities.lineIntersectsLine(boxCollider.x, boxCollider.y, boxCollider.x + boxAxis.vector.x, boxCollider.y + boxAxis.vector.y,
                circleCollider.x, circleCollider.y, circleCollider.x + boxAxis.normal.x, circleCollider.y + boxAxis.normal.y
            );
            let intersectVector = {x: boxPoint.x - boxCollider.x, y: boxPoint.y - boxCollider.y};
            //clip intersect to end of box
            let dist = CollisionUtilities.distance(intersectVector.x, intersectVector.y);
            let radius = (boxAxis.length/2) - (boxAxis.height/2);
            if (dist > radius) {
                let limitedVector = CollisionUtilities.normalize(intersectVector.x, intersectVector.y);
                let percentage = (radius / dist) * dist;
                limitedVector.x = boxCollider.x + (limitedVector.x * percentage);
                limitedVector.y = boxCollider.y + (limitedVector.y * percentage);
                boxPoint = limitedVector;
            }
        }

        //get intersect line
        let intersectLine = CollisionUtilities.getEdgeLineGoesThrough(circleCollider.x, circleCollider.y, boxPoint.x, boxPoint.y, 
            boxCollider.vertices[0].x, boxCollider.vertices[0].y,
            boxCollider.vertices[1].x, boxCollider.vertices[1].y,
            boxCollider.vertices[2].x, boxCollider.vertices[2].y,
            boxCollider.vertices[3].x, boxCollider.vertices[3].y
        )

        if (intersectLine == null) { //circle entirely within rectangle
            intersectLine = {x1: boxCollider.vertices[0].x, y1: boxCollider.vertices[0].y, x2: boxCollider.vertices[1].x, y2: boxCollider.vertices[1].y};
        }
        if (intersectLine.x1 == intersectLine.x2 && intersectLine.y1 == intersectLine.y2) { //exactly on top of each other
            intersectLine.x1 += CollisionUtilities.ERROR;
        }

        let inverseMassBox = 0;
        let inverseMassCircle = 0;
        if (!boxCollider.static && circleCollider.static) {
            inverseMassBox = 2;
        } else if (boxCollider.static && !circleCollider.static) {
            inverseMassCircle = 2;
        } else if (!boxCollider.static && !circleCollider.static) {
            inverseMassBox = (2 * circleCollider.mass) / (boxCollider.mass + circleCollider.mass);
            inverseMassCircle = (2 * boxCollider.mass) / (circleCollider.mass + boxCollider.mass);
        }

        let normalVector = CollisionUtilities.getNormal(intersectLine.x2 - intersectLine.x1, intersectLine.y2 - intersectLine.y1);
        const dist = CollisionUtilities.distance(intersectLine.x2 - intersectLine.x1, intersectLine.y2 - intersectLine.y1);
        normalVector.x = normalVector.x * dist;
        normalVector.y = normalVector.y * dist;

        let boxPointVelocity = CollisionUtilities.getVectorOfPointTravelledAroundPoint(boxCollider.x, boxCollider.y, boxPoint.x, boxPoint.y, boxCollider.rotationalVelocity);
        boxPointVelocity.x += boxCollider.velocity.x;
        boxPointVelocity.y += boxCollider.velocity.y;
        let boxPercentage = CollisionUtilities.distanceBetweenpoints(boxCollider, boxPoint) / boxAxisLength;

        let boxPointVelocityR = {x: boxPointVelocity.x * boxPercentage, y: boxPointVelocity.y * boxPercentage};
        let boxPointVelocityV = {x: boxPointVelocity.x * (1-boxPercentage), y: boxPointVelocity.y * (1-boxPercentage)};

        if (boxCollider.static == false) {

            let rotCircleToBoxPoint = CollisionUtilities.normalize(circleCollider.x - boxPoint.x, circleCollider.y - boxPoint.y);
            let rotNormal = CollisionUtilities.getNormal(boxCollider.x - boxPoint.x, boxCollider.y - boxPoint.y);

            let dot = CollisionUtilities.dotProduct(rotCircleToBoxPoint, rotNormal);

            let direction = 0;
            if (dot < 0) {
                direction = -1;
            } else if (dot > 0) {
                direction = 1;
            }

            let vectorV = {x: boxPointVelocityV.x - circleCollider.velocity.x, y:boxPointVelocityV.y - circleCollider.velocity.y};
            boxCollider.rotationalVelocity += inverseMassBox * direction * CollisionUtilities.distance(boxPointVelocityR.x, boxPointVelocityR.y);

            let mult = inverseMassBox * ((CollisionUtilities.dotProduct(vectorV, normalVector)) / CollisionUtilities.dotProduct(normalVector, normalVector));
            boxCollider.velocity.x -= normalVector.x * mult;
            boxCollider.velocity.y -= normalVector.y * mult;

            normalVector = CollisionUtilities.normalize(normalVector.x, normalVector.y);
            
        }

        if (circleCollider.static == false) {
            let vectorV = {x: circleCollider.velocity.x - boxPointVelocityV.x, y: circleCollider.velocity.y- boxPointVelocityV.y};
            let mult = inverseMassCircle * ((CollisionUtilities.dotProduct(vectorV, normalVector)) / CollisionUtilities.dotProduct(normalVector, normalVector));
            circleCollider.velocity.x -= normalVector.x * mult;
            circleCollider.velocity.y -= normalVector.y * mult;

            normalVector = CollisionUtilities.normalize(normalVector.x, normalVector.y);
        }

        let normilizedVector = CollisionUtilities.normalize(boxPoint.x - circleCollider.x, boxPoint.y - circleCollider.y);
        let intersectLinePoint = CollisionUtilities.lineIntersectsLine(intersectLine.x1, intersectLine.y1, intersectLine.x2, intersectLine.y2, 
            boxPoint.x, boxPoint.y, circleCollider.x, circleCollider.y
        )
        
        let boxRadius = CollisionUtilities.ERROR;
        if (intersectLinePoint != null) {
            boxRadius = CollisionUtilities.distanceBetweenpoints(boxPoint, intersectLinePoint);
        }
        let difference = (circleCollider.radius + boxRadius - CollisionUtilities.distanceBetweenpoints(boxPoint, circleCollider)) / 2;

        if (point != null) {
            const cornerToCircle = (circleCollider.radius - CollisionUtilities.distanceBetweenpoints(point, circleCollider)) / 2;
            difference = Math.max(difference, cornerToCircle);
        }

        difference += CollisionUtilities.ERROR;

        if (boxCollider.static == false) {
            let x = normilizedVector.x * difference * inverseMassBox;
            let y = normilizedVector.y * difference * inverseMassBox;

            boxCollider.x += x;
            boxCollider.y += y;
        }
        if (circleCollider.static == false) {
            let x = -normilizedVector.x * difference * inverseMassCircle;
            let y = -normilizedVector.y * difference * inverseMassCircle;

            circleCollider.x += x;
            circleCollider.y += y;
        }
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollideBoxToBox(collider1, collider2) {

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
    }

    /**
     * @param {Collider} collider1 
     * @param {Collider} collider2 
     */
    doCollide(collider1, collider2) {
        if (collider1.shape == "circle" && collider2.shape == "circle") {
            this.doCollideCircleToCircle(collider1, collider2);
        } else if ((collider1.shape == "box" && collider2.shape == "circle") || (collider1.shape == "circle" && collider2.shape == "box")) {
            this.doCollideCircleToBox(collider1, collider2);
        } else if (collider1.shape == "box" && collider2.shape == "box") {
            this.doCollideBoxToBox(collider1, collider2);
        }
    }

    handleCollisions() {
        if(Collider.all){
            for (let entity of Collider.all) {
                entity.updateCollision();
                entity.forces = [];
            }
        }

        this.#quadTree.makeTree(this.#collisionObjects);
        this.processTree(this.#quadTree.getTree());

        this.loopThroughCollisions(false);
        this.loopThroughCollisions(true);

        this.#pendingCollision = new Set();
        this.#collisionCounter = 0;
    }

    loopThroughCollisions(doStatics) {
        for (let j = 0; j < this.#collisionCounter; j += 3) {
            const c1 = this.#pendingCollisionArray[j];
            const c2 = this.#pendingCollisionArray[j + 1];
    
            const overlaps = this.collidersOverlap(c1, c2);
            const isStatic = c1.static || c2.static;
    
            if (isStatic == doStatics) {
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

        this.#collisionObjects = new Array();
        this.#collisionObjectsIds = new Set();
    }
}
