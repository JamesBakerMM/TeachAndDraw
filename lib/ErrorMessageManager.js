import { Group } from "./Group.js";
import { Collider } from "./Collider.js";
/**
 * Creates a tabbed string for indentation purposes.
 * Out of class so I'm not writing this.tab a bunch
 * @param {number} number - The number of tabs to create.
 * @returns {string} A string containg the number of tabs.
 */
function tab(number) {
    return `    `.repeat(number);
}

// helper to extract "member" from a few common TypeError shapes
/***
 * @param {string} moduleName
 * @param {string} message
 */
function extractMember(moduleName, message) {
    // 1) "<module>.<member> is not a function"
    let m = message.match(
        new RegExp(`^${moduleName}\\.([\\w$]+) is not a function$`)
    );
    if (m) return m[1];

    // 2) "<module>.<member> is undefined" (Firefox style)
    m = message.match(new RegExp(`^${moduleName}\\.([\\w$]+) is undefined$`));
    if (m) return m[1];

    // 3) "Cannot read properties of <something> (reading '<member>')"
    //    This can surface when code touched ".member" first before calling,
    //    e.g. module.member(...) when module is not what you think.
    m = message.match(/reading '([\w$]+)'\)?$/);
    if (m) return m[1];

    // 4) Fallback: "<module>.<member> ..." (best-effort)
    m = message.match(new RegExp(`^${moduleName}\\.([\\w$]+)\\b`));
    if (m) return m[1];

    return "";
}

/**
 * A class that manages error messages for debugging purposes.
 */
export class ErrorMsgManager {
    static modules = [
        {
            name: "shape",
            properties: [
                "alignment",
                "rotation",
                "colour",
                "border",
                "borderDash",
                "borderWidth",
                "movedByCamera",
            ],
            methods: [
                "arc",
                "line",
                "circle",
                "polygon",
                "multiline",
                "rectangle",
            ],
        },
        { name: "time", properties: ["frames", "seconds", "fps"], methods: [] },
        {
            name: "camera",
            properties: ["x", "y", "zoom", "rotation"],
            methods: ["moveTo", "rotateTo", "zoomTo"],
        },
        {
            name: "text",
            properties: [
                "alignment",
                "rotation",
                "movedByCamera",
                "maxWidth",
                "font",
                "bold",
                "italic",
                "hyphenation",
                "colour",
            ],
            methods: ["print"],
        },
        {
            name: "make",
            properties: [],
            methods: [
                "group",
                "entity",
                "button",
                "checkbox",
                "slider",
                "dropdown",
                "textArea",
                "point",
                "boxCollider",
                "circleCollider",
            ],
        },
        {
            name: "load",
            properties: [],
            methods: ["image", "text", "font", "animation", "json", "sound"],
        },
        {
            name: "mouse",
            properties: [
                "x",
                "y",
                "leftDown",
                "leftReleased",
                "rightDown",
                "rightReleased",
                "colour",
                "border",
                "collider",
            ],
            methods: [],
        },
        { name: "state", properties: [], methods: [] },
        { name: "touch", properties: [], methods: [] },
        {
            name: "keys",
            properties: [],
            methods: ["released", "down", "durationDown"],
        },
        {
            name: "math",
            properties: [],
            methods: [
                "abs",
                "floor",
                "ceiling",
                "round",
                "clamp",
                "flerp",
                "degreeToRadian",
                "radianToDegree",
                "sin",
                "cos",
                "tan",
                "atan",
                "atan2",
                "distance",
                "random",
                "rescale",
            ],
        },
    ];
    static MAX_LOOPS = 2;

    // helper to extract "member" from a few common TypeError shapes

    /**
     * Takes a given error stack and cleans it up to remove repetitive calls to drawCanvas
     * @param {String} stack
     */
    static cleanErrorStack(stack) {
        let newStack = "";
        for (const line of stack.split("\n")) {
            if (!line.trim().startsWith("at Tad.drawCanvas")) {
                newStack += line + "\n";
            }
        }
        return newStack;
    }

    /**
     *
     * @param {String} moduleName
     * @param {String} message
     * @returns
     */
    static extractMember(moduleName, message) {
        if (message.startsWith(moduleName)) {
            console.log("match on start with");
            message = message.replace(moduleName, " ");
            message = message.replace(" is not a function", " ");
            return message;
        }
        return "";
    }
    /**
     * Inspects if a given TypeError likely indicates a common mistake with tad and constructs a unique error msg if so.
     * @param {TypeError} error
     * @returns {{
     *  isTad:Boolean,
     *  error:TypeError,
     *  type:String,
     *  message:String,
     * }}
     */

    /** @param {TypeError} error */
    static handleTadTypeError(error) {
        const msg = String(error?.message ?? "");

        //mostly handling chrome specific error messages for now for time
        //come back and do firefox/others later etc
        for (const module of ErrorMsgManager.modules) {
            // properties misused as functions
            for (const prop of module.properties) {
                const chrome_notfunc = `${module.name}.${prop} is not a function`;
                if (msg.endsWith(chrome_notfunc)) {
                    let msg = `\nOops! You tried to call ${module.name}.${prop} as a function.`;
                    msg += `\nDid you write '${module.name}.${prop}()' by accident? ${module.name}.${prop} is a property.`;
                    return {
                        isTad: true,
                        error,
                        type: "import",
                        message: msg,
                    };
                }
            }

            // known method name but not actually a function (bad import/shadowing)
            for (const func of module.methods) {
                const chrome_notfunc = `${module.name}.${func} is not a function`;
                if (msg.endsWith(chrome_notfunc)) {
                    let msg = `\nUh oh! ${module.name}.${func} isn't callable right now.`;
                    msg += `\nCheck:\n- Did you import it? e.g. import { tad, ${module.name} } from '...'\n- Did you override '${module.name}' with your own variable?`;
                    return {
                        isTad: true,
                        error,
                        type: "import",
                        message: msg,
                    };
                }
            }

            // right module, wrong field
            const looksLikeWrongField =
                msg.startsWith(module.name + ".") &&
                msg.endsWith("not a function");

            if (looksLikeWrongField) {
                const extracted_field = extractMember(module.name, msg);
                if (extracted_field) {
                    let msg = `\n'${module.name}.${extracted_field}' isn't a callable function\n----------------------------`;
                    msg += `\nDid you mean one of these?\n  ${
                        module.name
                    } functions:\n    ${module.methods.join("\n    ") || "()"}`;
                    if (module.properties?.length) {
                        msg += `\n  ${
                            module.name
                        } properties:\n    ${module.properties.join("\n    ")}`;
                    }
                    return {
                        isTad: true,
                        error,
                        type: "import",
                        message: msg,
                    };
                }
            }

            // Also catch "<module>.<member> is undefined" (Firefox) the same way
            const looksUndefined =
                msg.startsWith(module.name + ".") &&
                msg.endsWith("is undefined");
            if (looksUndefined) {
                const extracted_field = extractMember(module.name, msg);
                if (extracted_field) {
                    let hint = `\n${module.name}.${extracted_field} doesn't exist.`;
                    hint += `\nCheck the spelling. Valid methods: ${
                        module.methods.join(", ") || "(none)"
                    }`;
                    if (module.properties?.length) {
                        hint += `\nValid properties: ${module.properties.join(
                            ", "
                        )}`;
                    }
                    return {
                        isTad: true,
                        error,
                        type: "import",
                        message: hint,
                    };
                }
            }
        }

        // default: not a recognized tad error
        return { isTad: false, error, type: null, message: null };
    }

    /**
     * Inspects if a given error is an error indicating the user has forgotten to import a module!
     * @param {ReferenceError} error
     * @returns {{
     *  isTad:Boolean,
     *  error:ReferenceError,
     *  type:String,
     *  message:String,
     * }}
     */
    static handleTadReferenceError(error) {
        for (const module of ErrorMsgManager.modules) {
            const referenceErrorStr = `${module.name} is not defined`;
            if (
                error.message.trim().toLocaleLowerCase() ===
                referenceErrorStr.trim().toLocaleLowerCase()
            ) {
                let msg = `\nOops! You need to import ${module.name} to use it:\n`;
                msg += `- Do you have import {tad, ${module.name}} from "..." at the top?\n`;
                msg += `- Have you checked the filepath is correct for TeachAndDraw?`;
                return {
                    isTad: true,
                    error: error,
                    type: "import",
                    message: msg,
                };
            }
        }

        return {
            isTad: false,
            error: error,
            type: null,
            message: null,
        };
    }

    /**
     * Constructs an error string for if a module import has likely failed.
     */
    static importFailed() {}

    /**
     * Inspects if a given Error is a known kind of error for tad specifically and if so returns a object with the type of Error, a boolean flag indiciating it is, and a error message to print.
     * @param {Error} error
     * @returns {{
     *  isTad:Boolean,
     *  type:String,
     *  message:String,
     * }}
     */
    static isTadError(error) {
        return {
            isTad: false,
            type: "none",
            message: "nonge",
        };
    }
    /**
     * Determines which objects to preview whether they've generated an error.
     * @param {Object} object - The object to preview.
     * @param {number} [depth=0] - The depth of the object in the preview.
     * @returns {string} A string representation of the object.
     */
    static previewObject(object, depth = 0) {
        let msg = `${tab(depth)}Object:${object.constructor.name} `;
        msg += `${tab(depth)}{\n`;

        if (typeof object !== "object" || object === null) {
            throw new Error(
                `object given must be an Object. You provided: ${object} (${typeof object})`
            );
        }
        //work out how many entries to loop
        const array = Object.entries(object);
        const isMoreThenMaxToDisplayEntries =
            array.length > ErrorMsgManager.MAX_LOOPS;
        let loopCount;
        if (isMoreThenMaxToDisplayEntries) {
            loopCount = ErrorMsgManager.MAX_LOOPS;
        } else {
            loopCount = array.length;
        }
        for (let i = 0; i < loopCount; i++) {
            const key = array[i][0];
            const value = array[i][1];
            msg += `${tab(depth + 1)}${key}:${value},\n`;
        }
        msg += `${tab(depth + 1)}...\n`;
        msg += `${tab(depth)}}`;
        return msg;
    }
    /**
     * Determines which arrays to preview whether they've generated an error.
     * @param {any[]} array - The array to preview.
     * @param {number} [depth=0] - The depth of the array in the preview.
     * @returns {string} A string containing the error messages of the arrays (if any).
     */
    static previewArray(array, depth = 0) {
        let msg = `${tab(depth)}Array(${array.length})`; //loop the first few entries of the array

        const isMoreThenMaxToDisplayEntries =
            array.length > ErrorMsgManager.MAX_LOOPS;
        let loopCount;
        if (isMoreThenMaxToDisplayEntries) {
            loopCount = ErrorMsgManager.MAX_LOOPS;
        } else {
            loopCount = array.length;
        }
        msg += `[\n`;
        for (let i = 0; i < loopCount; i++) {
            if (Array.isArray(array[i])) {
                msg += `${tab(depth + 1)}Array(${array[i].length}),\n`;
            } else if (typeof array[i] === "object") {
                msg += `${tab(depth + 1)}object:${array[i].constructor.name}`;
            } else if (typeof array[i] === "string") {
                msg += `${tab(depth + 1)}'${array[i]}',\n`;
            } else {
                //otherwise primitive
                msg += `${tab(depth + 1)}${array[i]},\n`;
            }
        }
        if (isMoreThenMaxToDisplayEntries) {
            msg += `${tab(depth + 1)}...\n`;
        }
        msg += `${tab(depth)}]`;
        return msg;
    }

    /**
     * Determines which groups to preview whether they've generated an error.
     * @param {Group} group - The group to preview.
     * @param {number} depth - The depth of the group in the preview.
     * @returns {string} A string containing the error messages of the groups (if any).
     */
    static previewGroup(group, depth = 0) {
        let msg = `Group[${group.length}]:${group.type}`; //loop the first few entries of the group
        const isMoreThenMaxToDisplayEntries =
            group.length > ErrorMsgManager.MAX_LOOPS;
        let loopCount;
        if (isMoreThenMaxToDisplayEntries) {
            loopCount = ErrorMsgManager.MAX_LOOPS;
        } else {
            loopCount = group.length;
        }
        msg += ` [\n`;
        for (let i = 0; i < loopCount; i++) {
            //check if its an object
            if (group[i] instanceof Group) {
                msg += `${tab(depth + 1)}Group(${group[i].length}):${
                    group[i].type
                },\n`;
            } else if (Array.isArray(group[i])) {
                msg += `${tab(depth + 1)}Array(${group[i].length}),\n`;
            } else if (typeof group[i] === "object") {
                msg += `${tab(depth + 1)}object:${group[i].constructor.name}`;
            } else if (typeof group[i] === "string") {
                msg += `${tab(depth + 1)}'${group[i]}',\n`;
            } else {
                //otherwise primitive
                msg += `${tab(depth + 1)}${group[i]},\n`;
            }
        }
        if (isMoreThenMaxToDisplayEntries) {
            msg += `${tab(depth + 1)}..\n`;
        }
        msg += `${tab(depth)}]`;
        return msg;
    }

    /**
     * Recursively sifts the objects fields for any that are an instance of collider.
     *
     * If there is one return a stringified path of the fields to reach that collider i.e
     * thing.otherthing.collider
     * otherwise return null
     * @param {Object} object
     * @param {string} [path="sampleObject"]
     * @param {Set<any>} [visited=new Set()]
     * @param {{ count: number; }} [checks={ count: 0 }]
     */
    static siftForColliderPathIn(
        object,
        path = "sampleObject",
        visited = new Set(),
        checks = { count: 0 }
    ) {
        const MAX_CHECKS = 200;
        if (object instanceof Collider) {
            return "uh this IS a collider? What are we doing here?";
        }
        if (
            typeof object !== "object" ||
            object === null ||
            visited.has(object)
        ) {
            return null;
        }

        visited.add(object);

        for (const key of Object.keys(object)) {
            if (checks.count >= MAX_CHECKS) {
                console.warn("Max checks hit while searching for Collider");
                return null;
            }

            const value = object[key];
            checks.count += 1;

            if (value instanceof Collider) {
                return `${path}.${key}`;
            }

            if (typeof value === "object" && value !== null) {
                const result = this.siftForColliderPathIn(
                    value,
                    `${path}.${key}`,
                    visited,
                    checks
                );
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }

    /**
     * Generates the error message for when a boolean check has failed.
     * @param {any} value - The value that failed the boolean check.
     * @param {string} msg - The message to display when the boolean check fails.
     * @returns {string} The formatted error message to be outputted to the console.
     * @static
     */
    static booleanCheckFailed(value, msg = "Expected a Boolean!") {
        msg += `\nRecieved: `;
        msg += `${value}:${typeof value}\n`;
        return msg;
    }

    /**
     * Generate the error message for when a check for if something is collideable has failed.
     * @param {*} value
     * @param {*} msg
     */
    static colliderCheckFailed(value, msg = "\nExpected a Collider or Group!") {
        const invalidGroupType = !(
            value.type === "Collider" || value.type === "empty"
        );
        if (value instanceof Group && invalidGroupType) {
            //this is a group that isn't holding colliders
            msg += `\nRecieved:`;
            msg += `Group containing ${value.type}\n`;
            msg += `Only groups holding Colliders can be used with .collides or .overlaps\n`;
            return msg;
        } else if (value instanceof Object) {
            const path = ErrorMsgManager.siftForColliderPathIn(value);
            if (path !== null) {
                //we have a path!
                msg += `\nRecieved:`;
                msg += ` An Object containing a collider, did you mean to pass the collider at:\n`;
                msg += `${path}`;
                return msg;
            } else {
                msg += `\nRecieved:`;
                msg += ErrorMsgManager.previewObject(value, 2);
                return msg;
            }
        }
    }

    /**
     * Generates the error message for when a number check has failed.
     * @param {any} value - The value that failed the number check.
     * @param {string} msg - The message to display when the number check fails.
     * @returns {string} The formatted error message to be outputted to the console.
     * @static
     */
    static numberCheckFailed(value, msg = `Expected a Number!`) {
        msg += `\nRecieved: `;
        if (value instanceof Group) {
            msg += ErrorMsgManager.previewGroup(value);
            if (value.type === "number") {
                console.warn(
                    "This is a group of numbers did you mean to pass a specific number with []?"
                );
            }
        } else if (Array.isArray(value)) {
            msg += ErrorMsgManager.previewArray(value);
            if (value.length > 0) {
                let isNumberedArray = true;
                for (let entry of value) {
                    if (!Number.isFinite(entry)) {
                        isNumberedArray = false;
                    }
                }
                if (isNumberedArray) {
                    console.warn(
                        "This is an array of numbers did you mean to pass a specific number with []?"
                    );
                }
            }
        } else if (value instanceof Collider) {
            msg += `Possible Causes:\n`;
            msg += `If using a variable check if it's value is a Collider`;
            msg += `If using a function result check if it's returned value is a Collider`;
        } else if (typeof value === "object") {
            msg += ErrorMsgManager.previewObject(value);
        } else if (value === undefined) {
            msg += `${value}\n`;
            msg += "_________________________________________\n";
            msg += `undefined often means the value you have passed in does not exist!:\n`;
            msg += `- If you passed this a variable, check your spelling and scope.\n`;
            msg += `- If you passed it a function result check that function is returning a value.\n`;
        } else if (value === null) {
            msg += `${value}:${typeof value}\n`;
            msg += `Possible Causes:\n`;
            msg += `If using a variable check if it's value is null`;
            msg += `If using a function result check if it's returned value is null`;
        } else if (typeof value === "boolean") {
            msg += `${value}:${typeof value}\n`;
            msg += `Possible Causes:\n`;
            msg += `- Did you accidentally pass a comparison operation using?`;
        } else if (typeof value === "string") {
            msg += `"${value}":${typeof value}\n`;
            msg += "_________________________________________\n";
            msg += `Possible causes:\n`;
            msg += `- Forgetting to parse a string to a number using parseInt or parseFloat.\n`;
            msg += `- Concatenating a number with a string, which results in a string.\n`;
        } else if (Number.isNaN(value)) {
            msg += `${value}:${typeof value}\n`;
            msg += `NaN, or 'Not a Number', can occur due to several reasons:\n`;
            msg += `- Performing math operations with non-number operands (e.g., 'abc' - 3).\n`;
            msg += `- Dividing by zero.\n`;
            msg += `- Parsing a non-number string with parseInt or parseFloat.\n`;
            msg += `- It's generally a sign that some arithmetic or parsing has gone wrong. Check your calculations.`;
        } else if (value === Infinity) {
            msg += `${value}:${typeof value}\n`;
            msg += `Infinity doesn't make much sense in the context of this program`;
        }
        return msg;
    }

    /**
     * @static
     * @param {any} value
     * @param {string} msg
     * @returns {string}
     */
    static colourCheckFailed(
        value,
        msg = `Given colour was not a valid string.`
    ) {
        if (typeof value === "number") {
            //if value wasn't a string and was an int, explain formatting
        }
        if (typeof value !== "string") {
            //if value wasn't a string and not an int, explain expected types
        }
        //ok its a string
        //if value is not a valid string
        //look for common mistakes
        //hsl,rgb, rgba etc
        //missing ( or )
        //missing , ?
        //hexcode
        //looks like hex but missed the #?

        return msg;
    }

    /**
     * Generates the error message for when a file load has failed.
     * @static
     * @param {string} filepath - The path to the file that failed to load.
     * @param {string} type - The type of file that failed to load.
     * @param {string} msg - The message to display when the file load fails.
     * @returns {string} The formatted error message to be outputted to the console.
     */
    static loadFileFailed(filepath, type, msg = "") {
        const splitPath = filepath.split("/");
        const filename = splitPath.splice(splitPath.length - 1)[0];
        if (msg === "") {
            msg = `"${filename}" could not be loaded from "${filepath}"\n`;
        }
        msg += `Make sure to carefully check your path to make sure it is correct!\n`;

        msg += `Context Hints:\n`;
        msg += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
        let filetypeFromPath = "";
        if (filename.includes(".")) {
            const splitname = filename.split(".");
            filetypeFromPath = splitname[splitname.length - 1];
        } else {
            msg += `Your file doesn't have a dot inside it!`;
        }
        switch (type) {
            case `img`:
                const validImageTypes = new Set();
                validImageTypes.add(`jpg`);
                validImageTypes.add(`jpeg`);
                validImageTypes.add(`png`);
                validImageTypes.add(`bmp`);
                msg += ``;
                if (
                    filetypeFromPath &&
                    (filetypeFromPath === `jpg` || filetypeFromPath === `jpeg`)
                ) {
                    msg += `${tab(
                        1
                    )}◼ ${filename} you wrote .jpg for your filename, have you checked if the file is a .jpg or a .jpeg?\n`;
                }

                if (
                    filetypeFromPath &&
                    validImageTypes.has(filetypeFromPath.toLowerCase()) ===
                        false
                ) {
                    msg += `${tab(
                        1
                    )}◼ img filetype (${filetypeFromPath}) is not a valid type for loadImage!\n ${tab(
                        2
                    )}>It needs to be one of the following types: ${[
                        ...validImageTypes,
                    ].join(", ")}\n`;
                }
                break;
            //common file extension mistakes.
            //did they write jpg?
            //ask if they meant jpeg? and vice versa
            //ask them to check the file type and ensure its a valid image type
            case `text`:
                if (filetypeFromPath && filetypeFromPath === "text") {
                    msg += `${tab(
                        1
                    )}◼ filetype given is .text for your filepath, did you mean .txt?\n`;
                }
                break;
            //common file extensions mistakes i.e check if they wrote .text instead of txt
            case `json`:
                if (filetypeFromPath.toLowerCase() !== "json") {
                    msg += `${tab(
                        1
                    )}◼ invalid filetype ("${filetypeFromPath}") given for .json file!\n`;
                }
                //what are the common mistakes here?
                //jason instead of json?
                break;
            case `sound`:
                let validSoundTypes = new Set();
                validSoundTypes.add("mp3");

                if (
                    filetypeFromPath &&
                    validSoundTypes.has(filetypeFromPath.toLowerCase()) ===
                        false
                ) {
                    msg += `${tab(
                        1
                    )}◼ sound filetype (${filetypeFromPath}) is not a valid type for loadSound!\n${tab(
                        2
                    )}>It needs to be one of the following types: ${[
                        ...validSoundTypes,
                    ].join(", ")}\n`;
                }
                break;
            case `font`:
                const fileTypes = ["ttf", "otf", "woff", "woff2"];
                const filepathEnding = filepath.split(".").pop() || "none";
                if (filepathEnding === "tff") {
                    msg += `${tab(
                        1
                    )}◼ Filepath ending "tff" is not an accepted file type for custom fonts. Did you mean ttf?`;
                } else if (fileTypes.includes(filepathEnding) === false) {
                    msg +=
                        `${tab(
                            1
                        )}◼ Filepath is not an accepted file type for custom fonts! You gave the path ${filepath}, ` +
                        `which is a file ending in ${filepathEnding}.\n` +
                        `${tab(
                            2
                        )}> The accepted file endings are: ${fileTypes.join(
                            ", "
                        )}\n`;
                }
                break;
            default:
        }
        const finalPathCharIsWhiteSpace = filepath[filepath.length - 1] === " ";
        if (finalPathCharIsWhiteSpace) {
            msg += `${tab(
                1
            )}◼ filepath has an empty space at the end of the filepath!\n`;
        }
        const pathHasSpaces =
            filepath.trim().includes(`%20`) || filepath.trim().includes(` `);
        if (pathHasSpaces) {
            let cleanedUpFilepath = filepath.trim().replaceAll(" ", "_");
            msg += `${tab(
                1
            )}◼ filepath has spaces inside its file and/or folder names! Consider replacing spaces with _ to simplify.\n`;
            msg += `${tab(2)}> eg:${cleanedUpFilepath}\n`;
        }
        const filenameSymbols = this.getSymbols(filename.toLowerCase());

        if (filenameSymbols.length > 0) {
            msg += `${tab(
                1
            )}◼ filename is using complex symbols, we recommend removing these symbols: ${filenameSymbols.join(
                ","
            )} from the name\n`;
        }

        const numberOfSlashes = filepath.matchAll(/\//g);
        const numberOfFolders = [...numberOfSlashes].length - 1;
        const folderPathIsDeep = numberOfFolders > 3;
        if (folderPathIsDeep) {
            msg += `${tab(
                1
            )}◼ your path is going through ${numberOfFolders}ish folders are you sure this is the correct path? most folder structures are kept relatively simple in learning to program courses.\n`;
        }

        msg += `\n`;
        return msg;
    }
    /**
     * ?????
     * @param {*} string
     * @returns {string[]}
     */
    static getSymbols(string) {
        const matches = string.matchAll(/[^a-zA-Z0-9/._\s-]/g) || [];
        return Array.from(new Set(matches));
    }

    /**
     * NOT YET IMPLEMENTED
     * @param {string} value
     * @param {Set<String>} expected_values
     * @param {string} [msg=""]
     */
    static notInValues(value, expected_values, msg = "") {
        //work out type of value and expected_values
        //if type mismatch focus on reporting that

        //otherwise
        //explain value is not an accepted

        return msg;
    }
}
