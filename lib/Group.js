import { Collider } from "./Collider.js";
import { Paint } from "./Paint.js";
import { Id } from "./Id.js";
import { Tad } from "./TeachAndDraw.js";
/**
 * @typedef {import("./QuadTree.js").Quad} Quad
 */

/**
 * Creates a new group with the provided elements.
 * @param {Tad} tad - The tad to use for drawing the group.
 * @param  {...any} elements - The elements to add to the group.
 * @returns {Group} A new group with the provided elements.
 */
export function makeGroup(tad, ...elements) {
    const nuGroup = new Group(...elements);
    nuGroup.tad = tad;
    Group.all.push(new WeakRef(nuGroup));
    return nuGroup;
}

/**
 * A class that represents a group of elements that can be drawn and checked for collisions.
 */
//@ts-expect-error
export class Group extends Array {
    /**
     * Static properties and methods serve to track all groups and facilitates issuing the cleanup order to all of them
     */

    /**
     * @type {WeakRef<Group>[]}
     */
    static all = [];
    static cleanup() {
        for (let g = Group.all.length - 1; g >= 0; g--) {
            const groupRef = Group.all[g];
            const group = groupRef.deref();
            if (group) {
                group.cleanup();
            } else {
                console.log("KILL")
                // Remove the dead weak reference from Group.all
                Group.all.splice(g, 1);
            }
        }
    }

    /** @type {number} index for using #approvedColours as a circular buffer. */
    static #approvedColoursIdx = 0;
    #approvedColours;

    /**
     * Creates an instance of Group.
     * @memberof Group
     * @example
     * const group = new Group(entity1, entity2, entity3);
     * group.draw(); // Inside your update function.
     * @param {...any} elements - The elements to add to the group.
     * @property {string} name - The name of the group.
     * @property {Paint} fill - The fill colour of the group.
     * @property {Tad} tad - The tad to use for drawing the group.
     * @property {number} id - The unique identifier of the group.
     * @constructor
     */
    constructor(...elements) {
        super();
        this.id = Id.getId();
        for (let element of elements) {
            this.push(element);
        }

        /**
         * @type {null | Tad}
         */
        this.tad = null;

        /**
         * @type {null | String}
         */
        this.name = null;

        this.#approvedColours = [
            Paint.palegreen,
            Paint.green,
            Paint.paleblue,
            Paint.blue,
            Paint.palered,
            Paint.red,
            Paint.palepurple,
            Paint.purple,
            Paint.paleaqua,
            Paint.aqua,
            Paint.palepink,
            Paint.pink,
            Paint.paleyellow,
            Paint.yellow,
            Paint.palebrown,
            Paint.brown,
            Paint.paleorange,
            Paint.orange,
        ];
    
        this.fill = this.#approvedColours[Group.#approvedColoursIdx];
        Group.#approvedColoursIdx = (Group.#approvedColoursIdx + 1) % this.#approvedColours.length;
    }

    /**
     * Validates elements about to be added to the group.
     * @param {Array<any>} elements - Elements to validate.
     * @throws {Error} If elements are not of the same type, undefined or NaN.
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

    /**
     * Pushes new elements to the group.
     * @param {...any} elements - The elements to add to the group.
     * @returns {number} The output of the push operation.
     */
    push(...elements) {
        if (elements[0] instanceof Collider) {
            return this.colliderPush(...elements);
        }
        this.#isValid(...elements);
        return super.push(...elements);
    }

    /**
     * internal
     * private_internal
     * @param {...any} elements 
     */
    colliderPush(...elements) {
        this.#isValid(...elements);
        for (let i = 0; i < elements.length; i++) {
            const isCollider = elements[i] instanceof Collider;
            if (isCollider) {
                if (!elements[i].groupsOwnedBy.includes(this.id)) {
                    if (elements[i].hadColourAssigned === false) {
                        elements[i]._fillWithoutTrackingAssignment = this.fill;
                    }

                    super.push(elements[i]);
                    elements[i].groupsOwnedBy.push(this.id);
                }
            } else {
                throw new Error(
                    "not all provided elements match as colliders!"
                );
            }
        }
        return super.length;
    }

    /**
     * Removes elements from the group.
     * @param {...any} elements - The elements to remove from the group.
     * @returns {any} The output of the unshift operation.
     */
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
        if (collideableEntity instanceof Collider) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupToCollider(
                    this,
                    collideableEntity,
                    this.id,
                    true
                );
        }
        if (collideableEntity === this) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupSelfToSelf(this, this.id, true);
        }
        if (collideableEntity instanceof Group) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupToGroup(
                    this,
                    collideableEntity,
                    this.id,
                    collideableEntity.id,
                    true
                );
        }
        throw new Error(
            `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
        );
    }

    /**
     * @param {Quad} quad 
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
     * @param {(Collider | Group)} collideableEntity - The collider or group to check for collisions.
     */
    collides(collideableEntity) {
        if (collideableEntity instanceof Collider) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupToCollider(
                    this,
                    collideableEntity,
                    this.id,
                    false
                );
        }
        if (collideableEntity === this) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupSelfToSelf(this, this.id,false);
        }
        if (collideableEntity instanceof Group) {
            if(!this.tad){
                throw new Error("Tad is not bound to this group! Was it made via $.makeGroup?")
            }
            return this.tad
                .getCollisionManager()
                .collidesOrOverlapsGroupToGroup(
                    this,
                    collideableEntity,
                    this.id,
                    collideableEntity.id,
                    false
                );
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
