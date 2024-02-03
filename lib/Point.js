/**
 * Represents a point in a 2D space with x and y coordinates.
 * Intended for internal library use only
 * @private
 */
export class Point {
    /**
     * The x-coordinate of the point.
     * @private
     */
    #x

    /**
     * The y-coordinate of the point.
     * @private
     */
    #y

    /**
     * Reference to the pen object.
     * @private
     */
    #pen

    /**
     * Creates a Point instance.
     * @param {Object} pen - The pen object associated with the point.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */
    constructor(pen, x, y){
        this.#pen = pen;
        this.#x = x;
        this.#y = y;
        Object.preventExtensions(this); // Protect against accidental assignment
    }

    /**
     * Gets the x-coordinate of the point.
     * @returns {number} The x-coordinate.
     */
    get x(){
        return this.#x;
    }

    /**
     * Gets the y-coordinate of the point.
     * @returns {number} The y-coordinate.
     */
    get y(){
        return this.#y;
    }

    /**
     * Sets a new x-coordinate for the point.
     * @param {number} value - The new x-coordinate.
     */
    set x(value){
        this.#x = value;
    }

    /**
     * Sets a new y-coordinate for the point.
     * @param {number} value - The new y-coordinate.
     */
    set y(value){
        this.#y = value;
    }

    /**
     * Determines if a point (x, y) is within a rectangle defined by its center, width, and height.
     * This method is internal and intended for use by other classes.
     * @private
     * @param {number} x - The x-coordinate of the point to check.
     * @param {number} y - The y-coordinate of the point to check.
     * @param {number} centerX - The x-coordinate of the rectangle's center.
     * @param {number} centerY - The y-coordinate of the rectangle's center.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @returns {boolean} True if the point is inside the rectangle, false otherwise.
     * @static
     */
    static isInRect(x, y, centerX, centerY, width, height) {
        // Calculate the top-left corner of the rectangle
        const leftX = centerX - width / 2;
        const topY = centerY - height / 2;

        // Check if the point is within the rectangle
        return (
            x >= leftX &&
            x <= leftX + width &&
            y >= topY &&
            y <= topY + height
        );
    }
}