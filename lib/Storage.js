import { ErrorMsgManager } from "./ErrorMessageManager.js";

const innerStorage = {};

/**
 * Controls the get and setting of key,values, intercepting them and having instead writing to/reading from local storage
 */
const handler = {
    /**
     * 
     * @param {Object} object 
     * @param {string} prop 
     * @param {any} value 
     * @returns 
     */
    set(object, prop, value) {// Validate if value can be stored in localStorage
        try {
            var jsonString=JSON.stringify(value);
        } 
        catch (e) {
            throw new Error(`Value for property cannot be converted for storage!`);
        }
        try {
            const testKey = "_-storage--_test_";
            localStorage.setItem(testKey, jsonString);
            localStorage.removeItem(testKey);
        } catch (e) {
            throw new Error(`Value for property "${prop}" cannot be stored: ${e.message}`);
        }

        object[prop] = value;

        localStorage.setItem(`-storage--${prop}`, jsonString);

        return true;
    },
    /**
     * @param {object} object 
     * @param {string} prop 
     * @returns 
     */
    get(object, prop) {// Check localStorage first
        const key =`-storage--${prop}`
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            try {
                return JSON.parse(storedValue);
            } catch {
                console.error(`data in storage for ${prop} is not parseable and may be invalid!`)
                return undefined;
            }
        }
        if(object.hasOwnProperty(prop)){
            return object[prop];
        } 
        return undefined;
    }
};

//consider a isValid() method wrapper!
export const storage = new Proxy(innerStorage,handler);