import { ErrorMsgManager } from "./ErrorMessageManager.js";

/** @typedef {import("./TeachAndDraw.js").Tad} Tad */

import { Button } from "./Button.js";

import { Entity } from "./Entity.js";
import { Group, makeGroup } from "./Group.js";
import { Slider } from "./Slider.js";
import { Checkbox } from "./Checkbox.js";
import { Dropdown } from "./Dropdown.js";
import { TextArea } from "./TextArea.js";
import { Collider } from "./Collider.js";
import { Point } from "./Point.js";

export class Make {
    /** @param {Tad} tad */
    constructor(tad) {
        this.tad = tad;
    }
    /**
     * Creates a new Entity object.
     * @param {number} x - The x-coordinate of the entitys's position.
     * @param {number} y - The y-coordinate of the entitys's position.
     * @returns {Entity} The newly created Entity.
     * @throws {Error} If x, y, are not finite numbers.
     */
    entity(x, y) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        return new Entity(this.tad, x, y);
    }
    /**
     * Makes a group filled with the given values.
     * @param  {...any} values
     * @returns {Group}
     */
    group(...values) {
        return makeGroup(this.tad, ...values);
    }

    /**
     * Creates a new Button object.
     * @param {number} x - The x-coordinate of the button's position.
     * @param {number} y - The y-coordinate of the button's position.
     * @param {number} w - The width of the button.
     * @param {number} h - The height of the button.
     * @param {string} label - The label text of the button. Defaults to "btn".
     * @returns {Button} The newly created Button object.
     * @throws {Error} If x, y, w, h are not finite numbers or if label is not a string.
     */
    button(x, y, w, h, label) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number")
            );
        }

        if (label === undefined || typeof label !== "string") {
            throw Error(
                `You need to give a string for the label.\n` +
                    `You gave: ${label}:${typeof label}`
            );
        }
        return new Button(x, y, w, h, label, this.tad);
    }
    /**
     * Creates a new Checkbox object for use in canvas.
     * @example
     * const checkbox = $.makeCheckbox(100, 200, 30);
     * checkbox.draw();
     * @param {number} x - The x-coordinate of the checkbox's position.
     * @param {number} y - The y-coordinate of the checkbox's position.
     * @param {number} w - The width of the checkbox.
     * @param {number} [h = w] - The height of the checkbox [optional]. Default is same as w.
     * @returns {Checkbox} The newly created Checkbox object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    checkbox(x, y, w, h = w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }

        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }
        return new Checkbox(x, y, w, h, this.tad);
    }
    /**
     * Creates a new Slider object for use in canvas.
     * @example
     * const slider = $.makeSlider(100, 200, 30); //x, y, w
     * slider.draw();
     * @param {number} x - The x-coordinate of the slider's position.
     * @param {number} y - The y-coordinate of the slider's position.
     * @param {number} w - The width of the slider.
     * @returns {Slider} The newly created Slider object.
     * @throws {Error} If x, y, and w are not finite numbers.
     */
    slider(x, y, w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        return new Slider(x, y, w, this.tad);
    }
    /**
     * Creates a new Dropdown object.
     * @example
     * const dropdown = $.makeDropdown(200, 100, 100, ["Option 1", "Option 2", "Option 3"]);
     * dropdown.draw();
     * @param {number} x - The x-coordinate of the dropdown's position.
     * @param {number} y - The y-coordinate of the dropdown's position.
     * @param {number} w - The width of the dropdown.
     * @param {string[]} options - The list of options contained in the dropdown. Must be strings.
     * @returns {Dropdown} The newly created Dropdown object.
     * @throws {Error} If x, y, and w are not finite numbers or if options is not an array of strings.
     */
    dropdown(x, y, w, options) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        Dropdown.checkOptionsConditions(options);
        return new Dropdown(this.tad, x, y, w, options);
    }
    /**
     * Creates a new TextArea object.
     * @example
     * const textArea = $.makeTextArea(400, 200, 300, 150);
     * textArea.draw();
     * @param {number} x - The x-coordinate of the text area's position.
     * @param {number} y - The y-coordinate of the text area's position.
     * @param {number} w - The width of the text area.
     * @returns {TextArea} The newly created TextArea object.
     * @throws {Error} If x, y, w, are not finite numbers.
     */
    textArea(x, y, w) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number!")
            );
        }

        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        return new TextArea(this.tad, x, y, w);
    }
    /**
     * Creates a new Point object.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {Point} The newly created Point object.
     * @throws {Error} If x or y are not finite numbers.
     */
    point(x, y) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        return new Point(this.tad, x, y);
    }
    /**
     * Creates a new Collider object representing a box collider.
     * @param {number} x - The x-coordinate of the collider's position.
     * @param {number} y - The y-coordinate of the collider's position.
     * @param {number} w - The width of the collider.
     * @param {number} h - The height of the collider.
     * @returns {Collider} The newly created Collider object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    boxCollider(x, y, w, h) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(w) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(w, "w has to be a number!")
            );
        }
        if (Number.isFinite(h) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(h, "h has to be a number!")
            );
        }
        return new Collider(this.tad, x, y, w, h, "box");
    }
    /**
     * Creates a new Collider object representing a box collider.
     * @param {number} x - The x-coordinate of the collider's position.
     * @param {number} y - The y-coordinate of the collider's position.
     * @param {number} d - The diameter of the collider.
     * @returns {Collider} The newly created Collider object.
     * @throws {Error} If x, y, w, h are not finite numbers.
     */
    circleCollider(x, y, d) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (Number.isFinite(d) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(d, "d has to be a number!")
            );
        }
        return new Collider(this.tad, x, y, d, d, "circle");
    }
}
