import { Pen } from "./Pen.js";

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
    #pen;
    #theme; //holds the indication of which theme is enabled
    #primaryColour;
    #secondaryColour;
    #textColour;
    #accentColour;
    constructor(pen) {
        this.theme = "retro"; // Use the setter
        this.#pen = pen;
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
                    console.log("retro theme set");
                    break;
                default:
                    this.#primaryColour = "#C0C0C0";
                    this.#secondaryColour = "#858585";
                    this.#textColour = "#000000";
                    this.#accentColour = "#008081";
                    console.log("default theme set");
                    break;
            }
        }
    }
    get theme() {
        return this.#theme;
    }

    /**
     * @param {string} value
     * @description Change the primary colour of the current theme
     */
    set primaryColour(value) {
        this.#primaryColour = value;
    }
    get primaryColour() {
        return this.#primaryColour;
    }

    /**
     * @param {string} value
     * @description Change the secondary colour of the current theme
     */
    set secondaryColour(value) {
        this.#secondaryColour = value;
    }
    get secondaryColour() {
        return this.#secondaryColour;
    }

    /**
     * @param {string} value
     * @description Change the text colour of the current theme
     */
    set textColour(value) {
        this.#textColour = value;
    }
    get textColour() {
        return this.#textColour;
    }

    /**
     * @param {string} value
     * @description Change the accent colour of the current theme
     */
    set accentColour(value) {
        this.#accentColour = value;
    }
    get accentColour() {
        return this.#accentColour;
    }
}
