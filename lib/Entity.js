import {makeGroup} from "./Group.js"
import {Point} from "./Point.js"
import {CollisionUtilities} from "./CollisionUtilities.js";

export class Entity {
    static id=0;
    static all=null;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    #attachements
    #hasAttachement
    #acceleration
    constructor(pen,x,y){
        this.id=Entity.getId();
        /**
         * @private 
         */
        this.exists=true;
        this.position=new Point(pen,x,y);
        this.#acceleration = 1; //change how this works
        this.#hasAttachement=false;
        this.#attachements=[];
        if(!Entity.all){ //this is for circumvention of hoisting order issue
            Entity.all=makeGroup();
            Entity.all.name="Entity.all"
        }
        Entity.all.push(this);
    }
    load(){}
    draw(){
        if(this.exists===false){
            return
        }
    }
    remove(){
        this.exists=false;
        this.position.x=0;
        this.position.y=0;
        this.velocity.x=0;
        this.velocity.y=0;
    }
    set x(value){
        if(Number.isFinite(value)){
            this.position.x=value;
            return this.position.x
        }
        throw Error(`x has to be a number! you gave ${value}:${typeof value}`);
    }
    get x(){
        return this.position.x
    }
    set y(value){
        if(Number.isFinite(value)){
            this.position.y=value;
            return this.position.y
        }
        throw Error(`y has to be a number! you gave ${value}:${typeof value}`);
    }
    get y(){
        return this.position.y
    }
    move(){
        if(this.exists===false){
            return
        }
        //do friction. replace / 1000 with time based system
        let vectorN = CollisionUtilities.normalize(this.velocity.x, this.velocity.y);
        let amplitude = CollisionUtilities.distance(this.velocity.x, this.velocity.y) - (this.friction / 1000);
        this.velocity._perfX = vectorN.x * amplitude;
        this.velocity._perfY = vectorN.y * amplitude;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.#acceleration !== 1) {
            this.velocity._perfX = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
            this.velocity._perfY = this.#formatNumber(
                this.#acceleration * this.velocity.y
            );
        }
    }
    #formatNumber(num) {
        if (Math.abs(num) > 0.009) {
            return parseFloat(num.toFixed(3));
        } else {
            return 0;
        }
    }
    attach(entity){
        //check its an entity
            //throw error if not
        //check if already attached to another entity
            //throw error if so
        //attach it
        //change them to share the same position object reference
    }
}

export class ShapedAssetEntity extends Entity {
    #w
    #h
    #asset
    constructor(pen,x,y,w,h){
        super(pen,x,y);
        // console.log("pen",pen,"x",x,"y",y,"w",w,"h",h)
        this.#w=w;
        this.#h=h;
        this.#asset={}
    }
    set w(value) {
        if (Number.isFinite(value) && value>0) {
            this.#w = value;
            // console.log("W FOR ENTITY",value,this.#asset,this.#asset.w)
            if(this.#asset){
                this.#asset.w = value;
            }
            return this.#w;
        }
        throw new Error(ErrorMsgManager.numberCheckFailed(value,"w has to be a number and above 0"));
    }
    get w() {
        return this.#w;
    }
    set h(value) {
        if (Number.isFinite(value) && value>0) {
            this.#h = value;
            if(this.#asset){
                this.#asset.h = value;
            }
            return this.#h;
        }
        throw new Error(ErrorMsgManager.numberCheckFailed(value,"h has to be a number and above 0"));
    }
    get h() {
        return this.#h;
    }
    remove(){
        this.exists=false;
        this.position.x=0;
        this.position.y=0;
        this.velocity.x=0;
        this.velocity.y=0;
        this.#w=1;
        this.#h=1;
    }
}
//shaped entity is an entity with getters and setters for w and h as well as x and y