import { Paint } from "./Paint.js";

/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */

/**
 * Represents color settings for drawing, managing fill and stroke colors.
 */
export class Colour {
    #fill;
    #stroke;
    #tad;
    #cache;
    // Courtesy of https://github.com/Kyza/color-regex/?tab=readme-ov-file
    static regex = new RegExp(
        "(#)(?:([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?|([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?)|(rgb|rgba)\\((?:\\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s*,\\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s*,\\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)(?:\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*|\\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s*|\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*|\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s*|\\s*(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)\\s+(0*(?:0|1[0-9]{0,2}|2(?:[0-4][0-9]?|5[0-4]?|[6-9])?|[3-9][0-9]?)(?:\\.[0-9]+)?|255(?:\\.0+)?|\\.[0-9]+)(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*|\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)\\)|(hsl|hsla)\\((?:\\s*(-?[0-9]+(?:\\.[0-9]+)?(?:deg|rad|grad|turn)?)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*|\\s*(-?[0-9]+(?:\\.[0-9]+)?(?:deg|rad|grad|turn)?)\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s*,\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*|\\s*(-?[0-9]+(?:\\.[0-9]+)?(?:deg|rad|grad|turn)?)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s*)\\)|(hwb)\\(\\s*(-?[0-9]+(?:\\.[0-9]+)?(?:deg|rad|grad|turn)?)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)?\\)|(lab|oklab)\\(\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?)\\s+(-?(?:0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|(?:0|1(?:[0-1][0-9]?|2[0-4]?|[3-9])?|[2-9][0-9]?)(?:\\.[0-9]+)?|125(?:\\.0+)?))\\s+(-?(?:0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|(?:0|1(?:[0-1][0-9]?|2[0-4]?|[3-9])?|[2-9][0-9]?)(?:\\.[0-9]+)?|125(?:\\.0+)?))\\s*(?:(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)?\\)|(lch|oklch)\\(\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?)\\s+(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|(?:0|1(?:[0-4][0-9]?|[5-9])?|[2-9][0-9]?)(?:\\.[0-9]+)?|150(?:\\.0+)?)\\s+(-?[0-9]+(?:\\.[0-9]+)?(?:deg|rad|grad|turn)?)\\s*(?:(?:\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)?\\)|(color)\\((?:(srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020)(?:\\s+|\\s*,\\s*)(0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s+|\\s*,\\s*)(0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:\\s+|\\s*,\\s*)(0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+|0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%)(?:(?:\\s+\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)?|(xyz|xyz-d50|xyz-d65)(?:\\s+|\\s*,\\s*)(-?[0-9]+(?:\\.[0-9]+)?%?)(?:\\s+|\\s*,\\s*)(-?[0-9]+(?:\\.[0-9]+)?%?)(?:\\s+|\\s*,\\s*)(-?[0-9]+(?:\\.[0-9]+)?%?)(?:(?:\\s+\\s*(?:\\/)\\s*(0*(?:(?:0|[1-9][0-9]?)(?:\\.[0-9]+)?|100(?:\\.0+)?|\\.[0-9]+)%|0*0*(?:\\.[0-9]+)?|1(?:\\.0+)?|\\.[0-9]+))?\\s*)?)\\)|(yellowgreen|yellow|whitesmoke|white|wheat|VisitedText|violet|turquoise|transparent|tomato|thistle|teal|tan|steelblue|springgreen|snow|slategrey|slategray|slateblue|skyblue|silver|sienna|SelectedItemText|SelectedItem|seashell|seagreen|sandybrown|salmon|saddlebrown|royalblue|rosybrown|red|rebeccapurple|purple|powderblue|plum|pink|peru|peachpuff|papayawhip|palevioletred|paleturquoise|palegreen|palegoldenrod|orchid|orangered|orange|olivedrab|olive|oldlace|navy|navajowhite|moccasin|mistyrose|mintcream|midnightblue|mediumvioletred|mediumturquoise|mediumspringgreen|mediumslateblue|mediumseagreen|mediumpurple|mediumorchid|mediumblue|mediumaquamarine|maroon|MarkText|Mark|magenta|LinkText|linen|limegreen|lime|lightyellow|lightsteelblue|lightslategrey|lightslategray|lightskyblue|lightseagreen|lightsalmon|lightpink|lightgrey|lightgreen|lightgray|lightgoldenrodyellow|lightcyan|lightcoral|lightblue|lemonchiffon|lawngreen|lavenderblush|lavender|khaki|ivory|indigo|indianred|hotpink|honeydew|HighlightText|Highlight|grey|greenyellow|green|GrayText|gray|goldenrod|gold|ghostwhite|gainsboro|fuchsia|forestgreen|floralwhite|firebrick|FieldText|Field|dodgerblue|dimgrey|dimgray|deepskyblue|deeppink|darkviolet|darkturquoise|darkslategrey|darkslategray|darkslateblue|darkseagreen|darksalmon|darkred|darkorchid|darkorange|darkolivegreen|darkmagenta|darkkhaki|darkgrey|darkgreen|darkgray|darkgoldenrod|darkcyan|darkblue|cyan|currentColor|crimson|cornsilk|cornflowerblue|coral|chocolate|chartreuse|CanvasText|Canvas|cadetblue|ButtonText|ButtonFace|ButtonBorder|burlywood|brown|blueviolet|blue|blanchedalmond|black|bisque|beige|azure|aquamarine|aqua|antiquewhite|aliceblue|ActiveText|AccentColorText|AccentColor)",
        "gi"
    );
    /**
     * Constructs a Colour instance with a given drawing context.
     * @param {Tad} tad
     * @constructor
     * @property {string} fill - The current fill color.
     * @property {string} stroke - The current stroke color.
     * @property {Pen} pen - The drawing context.
     * @property {boolean} isValid - Checks if a given value is a valid color.
     */
    constructor(tad) {
        this.#tad = tad;
        this.#fill = Paint.clear; // default fill color
        this.#stroke = Paint.clear; // default stroke color
        this.#cache = new Set();
        Object.preventExtensions(this); //protect against accidental assignment;
    }

    /**
     * Gets the current fill color.
     * @returns {string} The current fill color.
     */
    get fill() {
        return this.#fill;
    }

    /**
     * Sets a new fill color and updates the canvas context.
     * @param {string} value - The new fill color.
     */
    set fill(value) {
        if (this.isValid(value) === false) {
            throw new Error(
                `Given colour was not valid! ${value}:${typeof value}`
            );
        }
        if (Paint.get(value.toLowerCase())) {
            this.#fill = Paint.get(value.toLowerCase());
            this.#tad.context.fillStyle = value;
            return;
        }
        this.#fill = value;
        this.#tad.context.fillStyle = value;
        return;
    }

    /**
     * Checks if a given value is a valid color within CSS standards.
     * internal
     * @param {any} value
     * @returns {boolean} True if the value is a valid color. False otherwise.
     */
    isValid(value) {
        if (this.#cache.has(value)) {
            return true;
        }

        if (value === undefined) {
            return false;
        }
        if (typeof value !== "string") {
            return false;
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
        Colour.regex.lastIndex = 0;
        if (Colour.regex.test(value) === false) {
            return false;
        }

        if (this.#cache.size < 200) {
            this.#cache.add(value);
        }
        return true;
    }

    /**
     * Gets the current stroke color.
     * @returns {string} The current stroke color.
     */
    get stroke() {
        return this.#stroke;
    }

    /**
     * Sets a new stroke color and updates the canvas context.
     * @param {string} value - The new stroke color.
     */
    set stroke(value) {
        if (Paint.get(value.toLowerCase())) {
            this.#stroke = Paint.get(value.toLowerCase());
            this.#tad.context.strokeStyle = value;
            return;
        }
        this.#stroke = value;
        this.#tad.context.strokeStyle = value;
        return;
    }

    /**
     * Sets the fill and stroke state of the Colour object.
     * @param {{colourFill:string, colourStroke:string}} newState - The new state to set.
     * @throws {Error} If newState is undefined or invalid.
     */
    set state(newState) {
        if (newState === undefined) {
            throw new Error("Undefined state given!");
        }
        this.#fill = newState.colourFill;
        this.#stroke = newState.colourStroke;
        return;
    }
}
