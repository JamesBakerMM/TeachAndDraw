import { Group } from "./Group.js";
import { Collider } from "./Collider.js";

function tab(number) {
    return `    `.repeat(number);
}

export class ErrorMsgManager {
    static MAX_LOOPS = 2;
    static previewObject(object, d = 0) {
        let msg = `${tab(d)}Object:${object.constructor.name} `;
        msg += `${tab(d)}{\n`;

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
            msg += `${tab(d + 1)}${key}:${value},\n`;
        }
        msg += `${tab(d + 1)}...\n`;
        msg += `${tab(d)}}`;
        return msg;
    }
    static previewArray(array, d = 0) {
        let msg = `${tab(d)}Array(${array.length})`; //loop the first few entries of the array

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
                msg += `${tab(d + 1)}Array(${array[i].length}),\n`;
            } else if (typeof array[i] === "object") {
                msg += `${tab(d + 1)}object:${array[i].constructor.name}`;
            } else if (typeof array[i] === "string") {
                msg += `${tab(d + 1)}'${array[i]}',\n`;
            } else {
                //otherwise primitive
                msg += `${tab(d + 1)}${array[i]},\n`;
            }
        }
        if (isMoreThenMaxToDisplayEntries) {
            msg += `${tab(d + 1)}...\n`;
        }
        msg += `${tab(d)}]`;
        return msg;
    }
    static previewGroup(group, d = 0) {
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
                msg += `${tab(d + 1)}Group(${group[i].length}):${
                    group[i].type
                },\n`;
            } else if (Array.isArray(group[i])) {
                msg += `${tab(d + 1)}Array(${group[i].length}),\n`;
            } else if (typeof group[i] === "object") {
                msg += `${tab(d + 1)}object:${group[i].constructor.name}`;
            } else if (typeof group[i] === "string") {
                msg += `${tab(d + 1)}'${group[i]}',\n`;
            } else {
                //otherwise primitive
                msg += `${tab(d + 1)}${group[i]},\n`;
            }
        }
        if (isMoreThenMaxToDisplayEntries) {
            msg += `${tab(d + 1)}..\n`;
        }
        msg += `${tab(d)}]`;
        return msg;
    }
    static booleanCheckFailed(value, msg = "Expected a Boolean!") {
        msg += `\nRecieved: `;
        msg += `${value}:${typeof value}\n`;
        return msg;
    }
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
    static drawStateSizeDesync(value) {
        //
    }
    static loadFileFailed(path, type, msg="") {

        const splitPath=path.split('/');
        const filename = splitPath.splice(splitPath.length-1)[0];
        if(msg===""){
            msg=`"${filename}" could not be loaded from "${path}"\n`
        }
        msg += `Make sure to carefully check your path to make sure it is correct!`
        msg += `\nContext Hints:\n`;
        msg += `▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
        let filetypeFromPath;
        if(filename.includes(".")){
            const splitname=filename.split(".");            
            filetypeFromPath=splitname[splitname.length-1];
        } else {
            msg+=`Your file doesn't have a dot inside it!`;
        }
        switch (type) {
            case `img`:
                msg += ``;
                if(
                    filetypeFromPath 
                    && filetypeFromPath==="jpg"
                    && filetypeFromPath==="jpeg"
                ){
                    msg += `${tab(1)}${filename} you wrote .jpg for your filename, have you checked if the file is a .jpg or a .jpeg?`;
                }
                break;
            //common file extension mistakes.
            //did they write jpg?
            //ask if they meant jpeg? and vice versa
            //ask them to check the file type and ensure its a valid image type
            case `text`:
                if(filetypeFromPath && filetypeFromPath==="text"){
                    msg+=`${tab(1)}◼ You wrote .text for your filepath, did you mean .txt?\n`
                }
                break;
            //common file extensions mistakes i.e check if they wrote .text instead of txt
            case `json`:
            //what are the common mistakes here?
            //jason instead of json?
                break;
            case `sound`:
                let validSoundTypes=new Set();
                validSoundTypes.add("mp3");
                if(filetypeFromPath && validSoundTypes.has(filetypeFromPath)===false){
                    msg += `${tab(1)}◼ You are trying to load a non mp3 file for your sound!\n`;
                }
                break;
            default:
        }
        const finalPathCharIsWhiteSpace = path[path.length-1]===" ";
        if (finalPathCharIsWhiteSpace) {
            msg += `${tab(1)}◼ Your file path has an empty space at the end of the filepath!\n`;
        }
        const pathHasSpaces=path.includes(`%20`);
        if(pathHasSpaces){
            msg+=`${tab(1)}◼ Your filepath has spaces inside its file and/or folder names! Consider removing spaces from your  names to keep the paths simpler :)\n`;
        }
        const filenameHasSymbols="";

        const filenameIsComplex="";

        const folderPathIsComplex="";

        const numberOfSlashes=path.matchAll("/");
        const numberOfFolders=[...numberOfSlashes].length-1;
        const folderPathIsDeep=numberOfFolders>3;
        if(folderPathIsDeep){
            msg+=`${tab(1)}◼ your path is going through ${numberOfFolders}ish folders are you sure this is the correct path? most folder structures are kept relatively simple in learning to program courses.`
        }
        const isRelativePath="";
                
        //common issues
        //complex filename
        //complex folder path
        //if its a relative path
        //talk about relative pathing, link to a page explaining further

        msg += `\n`;
        return msg;
    }
}
