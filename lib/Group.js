import { Collider } from "./Collider.js";
import { Paint } from "./Paint.js"
import { Id } from "./Id.js"
import { Pen } from "./Pen.js";

/**
 * 
 * @param {Pen} pen 
 * @param  {...any} elements 
 * @returns 
 */
export function makeGroup(pen, ...elements) {
    const nuGroup = new Group(...elements);
    nuGroup.pen = pen;
    Group.all.push(nuGroup);
    return nuGroup;
}

export class Group extends Array {
    /**
     * Static properties and methods serve to track all groups and facilitates issuing the cleanup order to all of them
     */
    /**
     * @type {Group[]}
     */
    static all = [];
    static cleanup() {
        for (let g = Group.all.length - 1; g >= 0; g--) {
            Group.all[g].cleanup();
        }
    }
    #approvedColours
    constructor(...elements) {
        super();
        this.id=Id.getId();
        for (let element of elements) {
            this.push(element);
        }
        this.name = null;

        this.#approvedColours = [
            Paint.palegreen, Paint.green, 
            Paint.paleblue, Paint.blue, 
            Paint.palered, Paint.red, 
            Paint.palepurple, Paint.purple, 
            Paint.paleaqua, Paint.aqua, 
            Paint.palepink, Paint.pink, 
            Paint.paleyellow, Paint.yellow, 
            Paint.palebrown, Paint.brown, 
            Paint.paleorange, Paint.orange
        ];
        if(this.id>3){
            this.fill = this.#approvedColours[Math.floor(Math.random() * this.#approvedColours.length)];
        } else {
            this.fill=this.#approvedColours[Math.floor(Math.random() * this.#approvedColours.length)];
        }
    }

    /**
     * Validates elements about to be added to the group.
     * Throws error if elements not of the same type, undefined or NaN.
     * @param {Array} elements - Elements to validate.
     */
    #isValid(...elements) {
        for (const element of elements) {
            if (Number.isNaN(element)) {
                throw new Error("Cannot add NaN to a Group!");
            }
            if (element === undefined) {
                throw new Error("Cannot add undefined to a Group!");
            }

            if (this.length > 0) {
                if (
                    this[0] instanceof Collider &&
                    element instanceof Collider === false &&
                    this.name !== "Entity.all"
                ) {
                    // is a collider && element is NOT a collider
                    throw new Error(
                        "This group has a collider in it! All other entries must also be colliders"
                    );
                }
                //enforce monotype for array
                if (typeof element !== typeof this[0]) {
                    throw new Error(
                        "All elements in a Group must be of the same type"
                    );
                }
            }
        }
    }

    push(...elements) {
        if(elements[0] instanceof Collider){
            return this.colliderPush(...elements);
        }
        this.#isValid(...elements);
        return super.push(...elements);
    }

    
    /**
     * internal
     * private_internal
     */
    colliderPush(...elements){
        this.#isValid(...elements);
        for(let i=0; i<elements.length; i++){
            const isCollider=elements[i] instanceof Collider;
            if(isCollider){
                if(!elements[i].groupsOwnedBy.includes(this.id)) {
                    if(elements[i].hadColourAssigned===false){
                        elements[i]._fillWithoutTrackingAssignment=this.fill;
                    }

                    super.push(elements[i]);
                    elements[i].groupsOwnedBy.push(this.id);
                }
            } else {
                throw new Error("not all provided elements match as colliders!");
            }
        }
        return super.length;
    }

    unshift(...elements) {
        this.#isValid(...elements);
        return super.unshift(...elements);
    }

    /**
     * Calls the draw method on each element of the group, if they have one.
     */
    draw() {
        for (let i = 0; i < this.length; i++) {
            if (this[i].draw) {
                this[i].draw();
            }
        }
    }

    /**
     * Checks if any element in the group overlaps with the provided entity.
     * @param {Collider|Group} collideableEntity - The entity to check for overlaps.
     * @returns {boolean} True if any element overlaps with the entity, false otherwise.
     */
    overlaps(collideableEntity) {
        const IS_OVERLAPS=true;
        if (collideableEntity instanceof Collider) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupToCollider(this, collideableEntity, this.id,IS_OVERLAPS) ;
        }
        if (collideableEntity === this) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupSelfToSelf(this, this.id,IS_OVERLAPS);
        }
        if (collideableEntity instanceof Group) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupToGroup(this, collideableEntity, this.id, collideableEntity.id,IS_OVERLAPS);
        }
        throw new Error(
            `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
        );
    }

    
    /**
     * internal
     * private_internal
     */
    collideQuad(quad) {
        let result = false;
        if (quad.objects != null) {
            for (let i = 0; i < quad.objects.length; i++) {
                const sprite = quad.objects[i];
                for (let j = i + 1; j < quad.objects.length; j++) {
                    if (sprite.collides(quad.objects[j])) {
                        result = true;
                    }
                }
            }
        } else {
            for (let i = 1; i <= 4; i++) {
                const q = quad.getQuad(i);
                if (q != null) {
                    if (this.collideQuad(q)) {
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    /**
     * Placeholder for collision detection with a collider or another group.
     * Currently not implemented.
     * @param {Collider|Group} colliderOrGroup - The collider or group to check for collisions.
     */
    collides(collideableEntity) {
        if (collideableEntity instanceof Collider) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupToCollider(this, collideableEntity, this.id) ;
        }
        if (collideableEntity === this) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupSelfToSelf(this, this.id);
        }
        if (collideableEntity instanceof Group) {
            return this.pen.getCollisionManager().collidesOrOverlapsGroupToGroup(this, collideableEntity, this.id, collideableEntity.id);
        }
        throw new Error(
            `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
        );
    }
    /**
     * Cleans up the group by removing elements that have a remove property set to true.
     * private_internal
     */
    cleanup() {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i].exists === false || this[i] === undefined) {
                this.splice(i, 1);
            }
        }
    }

    /**
     * Returns a random element from the group.
     * @returns {any} A random element from the group.
     * @throws {Error} If the group is empty.
     */
    getRandomEntry() {
        if (this.length === 0) {
            throw new Error("Cannot get a random element from an empty group");
        }
        const randomIndex = Math.floor(Math.random() * this.length);
        return this[randomIndex];
    }

    /**
     * Gets the type of elements stored in the group.
     * - If the group is empty, returns "empty".
     * - For primitive types (like number, string, boolean), returns the type of the element.
     * - For object types, returns the name of the constructor (e.g., "Array", "Object", "Collider"). If the constructor name is not available, returns "object".
     * @returns {string} The type of elements in the group as a string.
     */
    get type() {
        if (this.length === 0) {
            return "empty";
        }

        const firstEntry = this[0];
        const elementType = typeof firstEntry;

        if (elementType === "object" && firstEntry !== null) {
            return firstEntry.constructor.name || "object";
        }

        return elementType;
    }
}
