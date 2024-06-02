import { Collider } from "./Collider.js";
import { Id } from "./Id.js"

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
    static all = [];
    static cleanup() {
        for (let g = Group.all.length - 1; g >= 0; g--) {
            Group.all[g].cleanup();
        }
    }

    constructor(...elements) {
        super();
        this.id=Id.getId();
        for (let element of elements) {
            this.push(element);
        }
        this.name = null;
    }

    /**
     * Validates elements about to be added to the group.
     * Throws error if elements not of the same type, undefined or NaN.
     * @param {...any} elements - Elements to validate.
     */
    isValid(...elements) {
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
        this.isValid(...elements);
        for(let i=0; i<elements.length; i++){
            if(elements[i] instanceof Collider){
                elements[i].groupsOwnedBy.push(this.id);
            }
        }
        return super.push(...elements);
    }

    unshift(...elements) {
        this.isValid(...elements);
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
        throw new Error("Unfinshed, blame Andrew");
        /*
        if (collideableEntity instanceof Collider) {
            return this.overlapSingleEntity(collideableEntity); //we.are.LEAVING
        }
        if (collideableEntity === this) {
            return this.overlapSelfToSelf(collideableEntity);
        }
        if (collideableEntity instanceof Group) {
            return this.overlapGroupToGroup(collideableEntity);
        }
        throw new Error(
            `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
        );*/
    }

    overlapSingleEntity(collideableEntity) {
        return false;
        /*
        for (const sprite of this) {
            if (sprite.overlaps(collideableEntity)) {
                return true;
            }
        }
        return false;*/
    }

    overlapGroupToGroup(collideableEntity) {
        return false;
        /*
        let result = false;
        for (let i = 0; i < this.length; i++) {
            const sprite = this[i];
            for (let c = 0; c < collideableEntity.length; c++) {
                if (
                    sprite.id !== collideableEntity[c].id &&
                    sprite.overlaps(collideableEntity[c])
                ) {
                    result = true;
                }
            }
        }
        return result;*/
    }

    overlapSelfToSelf(collideableEntity) {
        return false;
        /*let result = false;
        for (let i = 0; i < this.length; i++) {
            const sprite = this[i];
            for (let c = i + 1; c < collideableEntity.length; c++) {
                if (
                    sprite.id !== collideableEntity[c].id &&
                    sprite.overlaps(collideableEntity[c])
                ) {
                    result = true;
                }
            }
        }
        return result;
        */
    }

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
