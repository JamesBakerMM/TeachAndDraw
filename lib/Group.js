//groups are arrays that:
//crash if a value they hold is undefined
//have a cleanup method that removes all things marked for removal from it
//looping from the rear
//call the onRemove method attached to that object if there
//this is also where it checks for anything undefined in it etc
//checks something being added is of the expected type
import { Collider } from "./Collider.js"
export class Group extends Array {
    static all = [];
    static cleanup() {
        for (let g = Group.all.length - 1; g >= 0; g--) {
            for (let i = Group.all[g].length - 1; i >= 0; i--) {
                if (Group.all[g][i].remove) {
                    Group.all[g].splice(i, 1);
                }
            }
        }
    }
    constructor(...elements) {
        super(...elements);
        Group.all.push(this);
    }

    isValid(...elements) {
        for (const element of elements) {
            if (element === undefined) { //add a similar check for Nan as well?
                throw new Error("Cannot add undefined to a Group");
            } else if (this.length > 0) { //enforce monotype for array
                if (typeof element !== typeof this[0]) {
                    throw new Error(
                        "All elements in a Group must be of the same type"
                    );
                }
            } else {
                //confirm all elements being added are the same type
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

    update() {
        //loop through
    }

    draw(){
        for(let i=0; i<this.length; i++){
            if(this[i].draw){
                this[i].draw();
            }
        }
    }

    overlaps(colliderOrGroup){
        if (colliderOrGroup instanceof Collider) {
            console.log("ITS A COLLIDER")
            const SPRITE=colliderOrGroup;
            for(const sprite of this){
                if(SPRITE.overlaps(sprite)){
                    return true
                }
            } 
        } else if(colliderOrGroup instanceof Group){
            const GROUP=colliderOrGroup
            for(let i=0; i<this.length; i++){
                let sprite=this[i]
                for(let c=0; c<GROUP.length; c++){
                    console.log("CHECKING",sprite,colliderOrGroup)
                    if(colliderOrGroup[c].overlaps(sprite)){
                        return true
                    }
                }
            }
            throw new Error(`Unsupported! ${colliderOrGroup}:${typeof colliderOrGroup}`);
        } else {
            throw new Error(`Unsupported! ${colliderOrGroup}:${typeof colliderOrGroup}`);
        }

        return false
    } 

    collides(colliderOrGroup){
        let result=false;
        //if its a sprite
            //check each sprite in the group
        
    }

    cleanup() {
        // console.log("-----------------------------------------");
        // console.log("Starting cleanup. Initial length:", this.length);
        const LENGTH = this.length;
        //make a copy of the array, manipulate it see if it still breaks
        for (let i = this.length - 1; i >= 0; i--) {
            // console.log(`index ${i}`, this[i]);

            if (this[i].remove === true) {
                // console.log(`${i} marked for removal`, this[i]);
                this.length;
                if (typeof this[i].onRemove === "function") {
                    // console.log(`Calling onRemove for  ${i}`);
                    this[i].onRemove();
                }
                const tumor = this.splice(i, 1);
                // debugger

                // console.log("targeting", i, this[i]);
                // //
                // console.log("removing", tumor, tumor.id);
                // console.log(`${i} removed. New length:`, this.length);
            }
        }
        // console.log("Cleanup completed. Final length:", this.length);
    }
}

//intentionally brick some js array features, this is intentional do not remove these without consulting with your teacher as you are not meant to be using them, and this tools educational experience is not designed for it.
// Array.prototype.reduce = function (...args) {
//     console.error(` This feature is disabled intentionally, talk to your teacher.
// █░▄▄▀█░██░█░██████░██░█░██████░██░█░███
// █░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
// █▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
// };
// Array.prototype.map = function (...args) {
//     console.error(` This feature is disabled intentionally, talk to your teacher.
// █░▄▄▀█░██░█░██████░██░█░██████░██░█░███
// █░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
// █▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
// };
// Array.prototype.filter = function (...args) {
//     console.error(` This feature is disabled intentionally, talk to your teacher.
// █░▄▄▀█░██░█░██████░██░█░██████░██░█░███
// █░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
// █▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
// };
// Array.prototype.forEach = function (...args) {
//     console.error(` This feature is disabled intentionally, talk to your teacher.
// █░▄▄▀█░██░█░██████░██░█░██████░██░█░███
// █░██░█░██░█░▄▄░███░██░█░▄▄░███░██░█░▄▄░
// █▄██▄██▄▄▄█▄██▄████▄▄▄█▄██▄████▄▄▄█▄██▄`);
// };
