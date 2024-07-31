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
    #theme; //holds the indication of which theme is enabled
    constructor() {
        this.#theme = "retro";
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
        }
    }
    get theme() {
        return this.#theme;
    }
}
