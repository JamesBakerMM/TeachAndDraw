/**
 * A simple class that manages unique ids for groups, entities, and colliders.
 */
export class Id {
    static id = 0;

    /**
     * Creates a unique id.
     * @returns {number} A unique id.
     * @static
     */
    static getId() {
        Id.id += 1;
        return Id.id;
    }
}
