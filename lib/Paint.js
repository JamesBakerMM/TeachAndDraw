/**
 * used as a place to refer to for colour codes instead of using the css colours.
 */

/**
 * @type {Record<string, string>}
 */
export class Paint {
    /**
     * @param {string} value 
     * @returns {string}
     */
    static get(value){
        if(typeof value !== "string") {
            throw new Error("must provide a string to access");
        }
        return Paint[value];
    }
    static clear = "rgba(0,0,0,0)";
    static white = "#f5f4ef";
    static black = "#06060a";
    static grey = "#4c4c4c";
    //-----
    static palegreen = "#92d2af";
    static green = "#5ac632";
    static darkgreen = "#446808";
    //-----
    static paleblue = "#b0fff5";
    static blue = "#3ca9c6";
    static darkblue = "#132c54";
    //-----
    static palered = "#f46c70";
    static red = "#ad1f1e";
    static darkred = "#55080e";
    //-----
    static palepurple = "#cd80e0";
    static purple = "#91155e";
    static darkpurple = "#270f33";
    //-----
    static paleaqua = "#b0fff5";
    static aqua = "#2ee2b5";
    static darkaqua = "#3c6d74";
    //-----
    static palepink = "#f4d0de";
    static pink = "#f250a5";
    static darkpink = "#e4007b";
    //-----
    static paleyellow = "#fae79b";
    static yellow = "#ffd744";
    static darkyellow = "#bd821a";
    //----
    static palebrown = "#f9a581";
    static brown = "#97776c";
    static darkbrown = "#382a2a";
    //----
    static paleorange = "#ffd8b7";
    static orange = "#f46d35";
    static darkorange = "#c7371d";
}



/**
 * @type {Record<String,String>}
 */
Paint;