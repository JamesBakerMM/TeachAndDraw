import {makeGroup} from "./Group.js";
import {ErrorMsgManager} from "./ErrorMessageManager.js";
import {Point} from "./Point.js";
import {CollisionUtilities} from "./CollisionUtilities.js"; 
import { Velocity } from "./Velocity.js"
import {Animation} from "./Animation.js";

export class Entity {
    static id=0;
    static all=null;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    #assets
    #acceleration
    #collider
    #pen
    constructor(pen,x,y){
        this.id=Entity.getId();
        this.#pen=pen;
        /**
         * @private 
         */
        this.exists=true;
        this.position=new Point(pen,x,y); 
        this.positionPrevious={
            x:this.position.x,
            y:this.position.y
        }

        this.velocity=new Velocity(0,0);
        this.#acceleration = 1; //change how this works
        this.#collider=null;
        this.#assets=[];
        //entity.all is initiated in setup, this is a backup that fires for situations with no canvas
        if(!Entity.all){ //this is for circumvention of hoisting order issue
            Entity.all=makeGroup();
        }
        Entity.all.push(this);
    }
    drawAsset() {
        for(let i=0; i<this.#assets.length; i++){
            this.#assets[i].x=this.x;
            this.#assets[i].y=this.y;
            this.#assets[i].draw();
        }
    }
    draw(){
        if(this.exists===false){
            return
        }
        this.#pen.state.save();
        this.#pen.colour.fill="red";
        this.#pen.colour.stroke="white";
        this.#pen.shape.strokeDash=3;
        this.#pen.shape.oval(this.position.x,this.position.y,10);
        this.#pen.state.load();

        if(this.#assets.length>0){
            this.drawAsset();
        }
    }
    set asset(asset){
        if(asset===undefined){
            throw Error(`You need to provide an Image or an Animation! You provided undefined :(`);
        }
        //if its a group
        this.#assets=[]; //clear old assets, since only one right now
        
        if(asset.type==="animation"){ 
            //create a new wrapper and fill with the images
            // console.log(this.x,this.y,this.#pen,...asset)
            const newAnimWrapper = new Animation( this.x, this.y, this.#pen, ...asset );
            newAnimWrapper.delay=asset.delay;
            newAnimWrapper.looping = asset.looping;
            newAnimWrapper.playing = asset.playing;
            newAnimWrapper.w = asset.w;
            newAnimWrapper.h = asset.h;
            newAnimWrapper.rotation = asset.rotation;
            newAnimWrapper.frame = asset.frame;
            // const newAnimWrapper = asset.clone(this.x,this.y);
            //update all the props to match, do this manually
            this.#assets.push(newAnimWrapper);
        }

    }
    get asset(){
        return this.#assets[0]; //currently hardcoded using an array for future extensibility
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
            this.positionPrevious.x = this.position.x;
            this.position.x=value;
            return this.position.x;
        }
        throw Error(`x has to be a number! you gave ${value}:${typeof value}`);
    }
    get x(){
        return this.position.x
    }
    set y(value){
        if(Number.isFinite(value)){
            this.positionPrevious.y = this.position.y;
            this.position.y=value;
            return this.position.y;
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

        if (this.velocity.x != 0) {
            this.x += this.velocity.x;
        }
        if (this.velocity.y != 0) {
            this.y += this.velocity.y;
        }
        
        if (this.#acceleration !== 1) {
            this.velocity._perfX = this.#formatNumber(
                this.#acceleration * this.velocity.x
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