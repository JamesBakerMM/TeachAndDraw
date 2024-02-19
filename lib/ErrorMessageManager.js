import { Group } from "./Group.js";
import {Collider} from "./Collider.js";

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
        const isMoreThenMaxToDisplayEntries = array.length > ErrorMsgManager.MAX_LOOPS;
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

        const isMoreThenMaxToDisplayEntries = array.length > ErrorMsgManager.MAX_LOOPS;
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
            } else if(typeof array[i]==='object') {
                msg+=`${tab(d+1)}object:${array[i].constructor.name}`
            } else if(typeof array[i]==='string') {
                msg += `${tab(d + 1)}'${array[i]}',\n`;
            } else { //otherwise primitive
                msg += `${tab(d + 1)}${array[i]},\n`;
            }
        }
        if (isMoreThenMaxToDisplayEntries) {
            msg += `${tab(d + 1)}...\n`;
        }
        msg += `${tab(d)}]`;
        return msg;
    }
    static previewGroup(group,d=0) {
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
                msg += `${tab(d + 1)}Group(${group[i].length}):${group[i].type},\n`;
            } else if (Array.isArray(group[i])) {
                msg += `${tab(d + 1)}Array(${group[i].length}),\n`;
            } else if(typeof group[i]==='object') {
                msg+=`${tab(d+1)}object:${group[i].constructor.name}`
            } else if(typeof group[i]==='string'){
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
    static numberCheckFailed(value,msg=`Expected a Number!`) {
        msg+=`\nRecieved: `
        if (value instanceof Group) {
            msg += ErrorMsgManager.previewGroup(value);
            if(value.type==="number"){
                console.warn("This is a group of numbers did you mean to pass a specific number with []?")
            }
        } else if (Array.isArray(value)) {
            msg += ErrorMsgManager.previewArray(value);
            if(value.length>0){
                let isNumberedArray=true;
                for(let entry of value){
                    if(!Number.isFinite(entry)){
                        isNumberedArray=false;
                    }
                }
                if(isNumberedArray){
                    console.warn("This is an array of numbers did you mean to pass a specific number with []?")
                }
            }
        } else if(value instanceof Collider) {
            msg +=`Possible Causes:\n`
            msg +=`If using a variable check if it's value is a Collider`
            msg +=`If using a function result check if it's returned value is a Collider`
        } else if(typeof value === 'object'){
            msg += ErrorMsgManager.previewObject(value);
        } else if(value===undefined){
            msg +=`${value}\n`
            msg += '_________________________________________\n'
            msg += `undefined often means the value you have passed in does not exist!:\n`;
            msg += `- If you passed this a variable, check your spelling and scope.\n`;
            msg += `- If you passed it a function result check that function is returning a value.\n`;
        } else if(value===null){
            msg +=`${value}:${typeof value}\n`
            msg +=`Possible Causes:\n`
            msg +=`If using a variable check if it's value is null`
            msg +=`If using a function result check if it's returned value is null`
        } else if(typeof value === 'boolean'){
            msg +=`${value}:${typeof value}\n`
            msg +=`Possible Causes:\n`
            msg +=`- Did you accidentally pass a comparison operation using?`
        } else if(typeof value === 'string'){
            msg +=`"${value}":${typeof value}\n`
            msg += '_________________________________________\n'
            msg += `Possible causes:\n`;
            msg += `- Forgetting to parse a string to a number using parseInt or parseFloat.\n`;
            msg += `- Concatenating a number with a string, which results in a string.\n`;
        } else if(Number.isNaN(value)){
            msg +=`${value}:${typeof value}\n`
            msg += `NaN, or 'Not a Number', can occur due to several reasons:\n`;
            msg += `- Performing math operations with non-number operands (e.g., 'abc' - 3).\n`;
            msg += `- Dividing by zero.\n`;
            msg += `- Parsing a non-number string with parseInt or parseFloat.\n`;
            msg += `- It's generally a sign that some arithmetic or parsing has gone wrong. Check your calculations.`;
        } else if(value === Infinity){
            msg +=`${value}:${typeof value}\n`
            msg +=`Infinity doesn't make much sense in the context of this program`
        }        
        return msg;
    }
    static drawStateSizeDesync(value) {
        //
    }
}
