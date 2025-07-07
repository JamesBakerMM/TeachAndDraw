import { Tad } from "./TeachAndDraw.js";
import { ErrorMsgManager } from "./ErrorMessageManager.js";

const THEMES = new Set();
THEMES.add("terminal"); // <win 3.1/terminal looking gui
THEMES.add("retro"); // < old school windows 98 gui
THEMES.add("modern"); // < modern slick looking gui
THEMES.add("medieval");

//guis will have several visual themes enabled
//each themed set will behave differently and have different core defaults
//this includes different fonts it sets, font sizes etc
//the first set should ape windows 98 because it amuses me if they do
//second set ge
//This class is more like an abstract class laying out some core elements all gui elements share

export class Gui {
    #tad;
    /**
     * @type {"terminal" | "retro" | "modern" | "medieval"}
     */
    #theme = "retro"; //holds the indication of which theme is enabled
    #primaryColour = "";
    #secondaryColour = "";
    #textColour = "";
    #accentColour = "";

    /**
     * @param {Tad} tad
     */
    constructor(tad) {
        this.theme = "retro"; // Use the setter
        this.#tad = tad;
    }
    /**
     * @param {"terminal" | "retro" | "modern" | "medieval"} value
     * @description Change the theme of the current gui
     */
    set theme(value) {
        if (THEMES.has(value) === false) {
            throw new Error(
                `GUI THEMES CAN ONLY BE ONE OF THE FOLLOW VALUES\n 
                "${[...THEMES].join('", "')}"\n
                YOU ENTERED: ${value}`
            );
        } else {
            this.#theme = value;
            switch (value) {
                case "retro":
                    this.#primaryColour = "#C0C0C0";
                    this.#secondaryColour = "#858585";
                    this.#textColour = "#000000";
                    this.#accentColour = "#008081";
                    break;
                default:
                    this.#primaryColour = "#C0C0C0";
                    this.#secondaryColour = "#858585";
                    this.#textColour = "#000000";
                    this.#accentColour = "#008081";
                    break;
            }
        }
    }

    /**
     * @returns {"terminal" | "retro" | "modern" | "medieval"} The current theme selected.
     */
    get theme() {
        return this.#theme;
    }

    /**
     * @param {string} value
     * @description Change the primary colour of the current theme
     */
    set primaryColour(value) {
        if (typeof value !== "string") {
            ErrorMsgManager.colourCheckFailed(value);
        }
        this.#primaryColour = value;
    }

    /**
     * Returns the primary colour of the current.
     * @returns {string} The primary colour of the current theme
     */
    get primaryColour() {
        return this.#primaryColour;
    }

    /**
     * @param {string} value
     * @description Change the secondary colour of the current theme
     */
    set secondaryColour(value) {
        if (typeof value !== "string") {
            ErrorMsgManager.colourCheckFailed(value);
        }
        this.#secondaryColour = value;
    }

    /**
     * Returns the secondary colour of the current theme.
     * @returns {string} The secondary colour of the current theme
     */
    get secondaryColour() {
        return this.#secondaryColour;
    }

    /**
     * @param {string} value
     * @description Change the text colour of the current theme
     */
    set textColour(value) {
        if (typeof value !== "string") {
            ErrorMsgManager.colourCheckFailed(value);
        }
        this.#textColour = value;
    }

    /**
     * Returns the text colour of the current theme.
     * @returns {string} The text colour of the current theme
     */
    get textColour() {
        return this.#textColour;
    }

    /**
     * @param {string} value
     * @description Change the accent colour of the current theme
     */
    set accentColour(value) {
        if (typeof value !== "string") {
            ErrorMsgManager.colourCheckFailed(value);
        }
        this.#accentColour = value;
    }

    /**
     * Returns the accent colour of the current theme.
     * @returns {string} The accent colour of the current theme
     */
    get accentColour() {
        return this.#accentColour;
    }
}
