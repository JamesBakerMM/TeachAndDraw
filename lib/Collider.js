import { Debug } from "./Debug.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Point } from "./Point.js";
import { ImgWrapper } from "./Img.js";
import { Animation } from "./Animation.js";
import { Velocity } from "./Velocity.js";

export class Collider extends ShapedAssetEntity {
    static all = [];
    #pen;
    #asset;
    #w;
    #h;
    #acceleration;
    #validAssets;
    static reset(){
        Collider.all=[];
    }

    constructor(pen, x, y, w, h = w) {
        //type checks are in the make function
        //id is set in Entity class
        super(pen, x, y, w, h);
        this.#pen = pen;
        this.velocity = new Velocity(0, 0);
        this.#validAssets = [];
        this.mass = 1;
        this.bounciness = 1;
        this.static = false;
        this.prevX = x;
        this.prevY = y;
        this.x = x;
        this.y = y;
        this.#w = w;
        this.#h = h;
        this.#acceleration = 1; //change how this works
        this.#asset;
        this.hasOverlapped = false;
    }
    get top() {
        return this.y - this.#h / 2;
    }

    get bottom() {
        return this.y + this.#h / 2;
    }

    get left() {
        return this.x - this.#w / 2;
    }

    get right() {
        return this.x + this.#w / 2;
    }

    set asset(value) {
        //if value is a type of valid asset
        this.#asset = value;
        return this.#asset;
        throw Error(
            `you can only assign an asset of the validTypdaes, you gave ${value}:${typeof value}`
        );
        //else throw error listing expected types
    }
    get asset() {
        return this.#asset;
    }
    drawIdleVersion() {}
    #formatNumber(num) {
        if (Math.abs(num) > 0.009) {
            return parseFloat(num.toFixed(3));
        } else {
            return 0;
        }
    }
    overlaps(otherCollider) {
        if(otherCollider instanceof Collider===false) {
            throw Error(`you gave not a collider ${otherCollider}:${typeof otherCollider}`);
        }
        // console.log("CHECKING COLLISION BETWEEN\n",this,"AND\n",otherCollider)
        //check if its a collider of the box type
        const result =
            this.bottom > otherCollider.top &&
            this.top < otherCollider.bottom &&
            this.right > otherCollider.left &&
            this.left < otherCollider.right;
        if (result) {
            this.hasOverlapped = true;
            otherCollider.hasOverlapped = true;
        }
        return result;
    }
    set attachement(value){
        if ((value instanceof ImgWrapper || value instanceof Animation)===false) {
            throw new Error(`Attachment was incorrect! You gave: ${value}:${typeof value}:${value.constructor.name}`);
        }
    
        this.#asset = value;
        return this.#asset;
    }
    get attachement(){
        return this.#asset
    }
    collides(otherCollider) {
        const overlapResult=this.overlaps(otherCollider);
        Collider.all.push({colliders:[this,otherCollider],overlapped:overlapResult})
        if (overlapResult) {
            //https://developer.ibm.com/tutorials/wa-build2dphysicsengine/
            //check if already collided with this one this round
            //get displacement for one into the other
            //and vice versa

            let xDepth = (otherCollider.x - this.x) / otherCollider.w / 2;
            let yDepth = (otherCollider.y - this.y) / otherCollider.h / 2;

            //get absolute
            let absoluteXDepth = Math.abs(xDepth);
            let absoluteYDepth = Math.abs(yDepth);

            const fromRight = xDepth < 0;
            const fromBottom = yDepth < 0;
            const fromCorner = Math.abs(absoluteXDepth - absoluteYDepth) < 0.1;
            const fromSides=absoluteXDepth > absoluteYDepth;

            const halfWidth=this.w/2;
            const halfHeight=this.h/2;

            //createStorageforQueuedVelocityAdjustments

            if (fromCorner) {
                //approach from a corner
                if (fromRight) {
                    this.x = otherCollider.right + halfWidth;
                } else {
                    this.x = otherCollider.left - halfWidth;
                }

                if (fromBottom) {
                    this.y = otherCollider.bottom + halfHeight;
                } else {
                    this.y = otherCollider.top - halfHeight;
                }
                this.velocity.x = -this.velocity.x * this.bounciness;
                this.velocity.y = -this.velocity.y * this.bounciness;
            } else if (fromSides) {
                if (fromRight) {
                    this.x = otherCollider.right + halfWidth;
                } else { //must be from left
                    this.x = otherCollider.left - halfWidth;
                }
                this.velocity.x = -this.velocity.x * this.bounciness;
            } else {
                if (fromBottom) {
                    this.y = otherCollider.bottom + halfHeight;
                } else { //must be from top
                    this.y = otherCollider.top - halfHeight;
                }
                this.velocity.y = -this.velocity.y * this.bounciness;
            }
        }
        return overlapResult
    }

    move() {
        // console.log(this.x,this.y)
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // console.log(this.x,this.y)
        if (this.#acceleration !== 1) {
            this.velocity.x = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
            this.velocity.y = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
        }
        // console.log(this.x,this.y)
        // console.log(`''''''''''`)
    }
    set acceleration(value) {
        //check types
        if (Number.isFinite(value)) {
            this.#acceleration = value;
            return this.#acceleration;
        }
        throw Error(
            `acceleration has to be a number but you gave ${value}:${typeof value}`
        );
    }
    get acceleration() {
        return this.#acceleration;
    }
    draw() {
        this.#pen.state.save();
        this.move();
        if (this.#pen.debug) {
            Debug.drawCollider(this.#pen, this);
            this.#pen.state.load();
            return
        }
        
        this.sync();

        if(this.#asset){
            this.#asset.x=this.x
            this.#asset.y=this.y
            this.#asset.draw();
        } else {
            this.drawCollider();
        }
        
        this.#pen.state.load();
    }
    drawCollider(){
        this.#pen.shape.xAlignment="center";
        this.#pen.shape.yAlignment="center";
        this.#pen.shape.rectangle(this.x,this.y,this.w,this.h);
    }
    sync() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.hasOverlapped = false;
    }
    set w(value) {
        if (Number.isFinite(value)) {
            this.#w = value;
            this.#asset.w = value;
            return this.#w;
        }
        throw Error(
            `soz, w can only be set as a number, you gave me ${value}:${typeof value}`
        );
    }
    get w() {
        return this.#w;
    }
    set h(value) {
        if (Number.isFinite(value)) {
            this.#h = value;
            this.#asset.h = value;
            return this.#h;
        }
        throw Error(
            `soz, h can only be set as a number, you gave me: ${value} of type ${typeof value}`
        );
    }
    get h() {
        return this.#h;
    }
}
