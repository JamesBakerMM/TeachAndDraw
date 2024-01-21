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
        // console.log(colliderOrGroup)
        if (colliderOrGroup instanceof Collider) {
            // console.log("ITS A COLLIDER")
            const SPRITE=colliderOrGroup;
            for(const sprite of this){
                if(SPRITE.overlaps(sprite)){
                    return true
                }
            } 
        } else if(colliderOrGroup instanceof Group){
            // console.log("IT A GROUP")
            for(let i=0; i<this.length; i++){
                let sprite=this[i]
                //confirm first entry is a collider
                for(let c=0; c<colliderOrGroup.length; c++){
                    const GROUP_ENTRY=colliderOrGroup[c]
                    if(sprite.overlaps(GROUP_ENTRY)){
                        throw new Error(`FOUND IT! ${colliderOrGroup}:${typeof colliderOrGroup}`);
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
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i].remove === true) {
                this.length;
                if (typeof this[i].onRemove === "function") {
                    this[i].onRemove();
                }
                const tumor = this.splice(i, 1);
            }
        }
    }

    getRandomEntry(){
        // Check if the group is empty
        if (this.length === 0) {
            throw new Error("Cannot get a random element from an empty group");
        }
        // Generate a random index based on the group's length
        const randomIndex = Math.floor(Math.random() * this.length);
        // Return the element at the randomly generated index
        return this[randomIndex];
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
