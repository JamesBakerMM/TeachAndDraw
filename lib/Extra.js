/**
 * Returns a proxy wrapped object where key, value pairs are type checked
 * @returns {Object}
 */
export function makeExtra(){
    const innerExtra = {};

    const handler ={
        /**
         * @param {Object} object 
         * @param {string} prop 
         * @param {any} value 
         * @returns {any}
         */
        set(object,prop,value){
            if (prop in object) {
                const mismatchedType = typeof object[prop] !== typeof value;
                if (mismatchedType) {
                    throw new TypeError(
                        `Type mismatch: Expected ${typeof object[prop]}, but got ${typeof value}`
                    );
                }
            }
            object[prop] = value;
            return value;
        },
        /**
         * @param {Object} object 
         * @param {string} prop 
         * @param {any} value 
         * @returns {any}
         */
        get(object,prop,value){
            return object[prop];
        }
    }

    return new Proxy(innerExtra,handler)
}