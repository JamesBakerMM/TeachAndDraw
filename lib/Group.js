//groups are arrays that:
//crash if a value they hold is undefined
//have a cleanup method that removes all things marked for removal from it
    //looping from the rear
    //call the onRemove method attached to that object if there
    //this is also where it checks for anything undefined in it etc
//checks something being added is of the expected type

export class Group extends Array {
    constructor() {
        super();
    }

    isValid(...elements) {
        for (const element of elements) {
            if (element === undefined) { //add a similar check for Nan as well?
                throw new Error('Cannot add undefined to a Group');
            } else if (this.length > 0) { //enforce monotype for array
                if (typeof element !== typeof this[0]) {
                    throw new Error('All elements in a Group must be of the same type');
                }
            }
        }
    }

    push(...elements) {
        this.isValid(...elements);
        return super.push(...elements); 
    }

    unshift(...elements) {
        this.isValid(...elements);
        return super.unshift(...elements); 
    }
}

//intentionally brick some js array features, this is intentional do not remove these without consulting with your teacher as you are not meant to be using them, and this tools educational experience is not designed for it.
Array.prototype.reduce = function(...args) {        
    console.error(` This feature is disabled intentionally, talk to your teacher.
█░▄▄▀█░██░█░██████░██░█░██████░██░█░███
█░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
█▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
    };
Array.prototype.map = function(...args) {        
    console.error(` This feature is disabled intentionally, talk to your teacher.
█░▄▄▀█░██░█░██████░██░█░██████░██░█░███
█░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
█▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
    };
Array.prototype.filter = function(...args) {        
    console.error(` This feature is disabled intentionally, talk to your teacher.
█░▄▄▀█░██░█░██████░██░█░██████░██░█░███
█░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
█▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
    };
Array.prototype.forEach = function(...args) {        
    console.error(` This feature is disabled intentionally, talk to your teacher.
█░▄▄▀█░██░█░██████░██░█░██████░██░█░███
█░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
█▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
    };