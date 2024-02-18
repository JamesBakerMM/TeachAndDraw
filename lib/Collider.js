import { Debug } from "./Debug.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Point } from "./Point.js";
import { ImgWrapper } from "./Img.js";
import { Animation } from "./Animation.js";
import { Velocity } from "./Velocity.js";
import { CollisionUtilities } from "./CollisionUtilities.js";

//errors
import {ErrorMsgManager} from "./ErrorMessageManager.js"

export class Collider extends ShapedAssetEntity {
    #pen;
    #asset;
    #w;
    #h;
    #acceleration;
    #validAssets;
    static reset(){
    }

    constructor(pen, x, y, w, h = w) {
        //type checks are in the make function
        //id is set in Entity class
        super(pen, x, y, w, h);
        this.#pen = pen;
        this.velocity = new Velocity(0, 0);
        this.#validAssets = [];
        this.mass = 1;
        this.bounciness = 0;
        this.friction = 0;
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
    
    get radius() {
        return Math.sqrt(Math.pow(this.#w / 2, 2) + Math.pow(this.#h / 2, 2));
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
    overlaps(otherCollider) {
        if(collider2 instanceof Collider===false) {
            throw Error(`you gave not a collider ${collider2}:${typeof collider2}`);
        }
        return this.#pen.getCollisionManager().overlaps(this, otherCollider);
    }
    collides(otherCollider) {
        return this.#pen.getCollisionManager().collides(this, otherCollider);
    }

    move() {
        //do friction. replace / 1000 with time based system
        let vectorN = CollisionUtilities.normalize(this.velocity.x, this.velocity.y);
        let amplitude = CollisionUtilities.distance(this.velocity.x, this.velocity.y) - (this.friction / 1000);
        this.velocity.x = vectorN.x * amplitude;
        this.velocity.y = vectorN.y * amplitude;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.#acceleration !== 1) {
            this.velocity.x = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
            this.velocity.y = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
        }
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
