import { Collider } from "./Collider.js";

export function makeGroup(...elements){
    const nuGroup=new Group(...elements);
    Group.all.push(nuGroup);
    return nuGroup
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
        for(let element of elements){
            this.push(element);
        }
        this.name=null
        // Group.all.push(this);
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
                if(this[0] instanceof Collider && element instanceof Collider === false && this.name!=="Entity.all"){// is a collider && element is NOT a collider
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
        if (collideableEntity instanceof Collider) {
            const SPRITE = collideableEntity;
            for (const sprite of this) {
                if (SPRITE.overlaps(sprite)) {
                    return true;
                }
            }
            return false
        } else if (collideableEntity instanceof Group) {
            for (const sprite of this) {
                for (const otherSprite of collideableEntity) {
                    if (sprite.overlaps(otherSprite)) {
                        return true;
                    }
                }
            }
            return false
        } else {
            throw new Error(
                `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
            );
        }

        return false;
    }
    /**
     * Placeholder for collision detection with a collider or another group.
     * Currently not implemented.
     * @param {Collider|Group} colliderOrGroup - The collider or group to check for collisions.
     */
    collides(collideableEntity) {
        if (collideableEntity instanceof Collider) {
            for(const sprite of this){
                if(sprite.collides(collideableEntity)){
                    return true
                }
            }
            return false //we.are.LEAVING
        } 
        if(collideableEntity instanceof Group) {
            let result=false;
            for(let i=0; i<this.length; i++){
                const sprite=this[i];
                for (let c = i + 1; c < collideableEntity.length; c++) {
                    const isSameSprite=sprite.id===collideableEntity[c].id
                    if (!isSameSprite && sprite.collides(collideableEntity[c])) {
                        result=true;
                    }
                }
            }
            return result
        } 
        throw new Error(
            `Unsupported! ${collideableEntity}:${typeof collideableEntity}`
        );
        

        throw Error("Group collides is not yet implemented");
    }
    /**
     * Cleans up the group by removing elements that have a remove property set to true.
     */
    cleanup() {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i].exists===false || this[i]===undefined) {
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