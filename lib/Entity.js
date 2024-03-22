import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Point } from "./Point.js";
import { Velocity } from "./Velocity.js"
import { Animation } from "./Animation.js";

export class Entity {
    static id=0;
    static all=null;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    #assets
    #acceleration
    #rotation
    #direction
    #speed
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
        this.#direction=pen.math.adjustDegressSoTopIsZero(0);
        this.#speed=0;
        this.#rotation=pen.math.adjustDegressSoTopIsZero(0);
        this.#collider=null;
        this.#assets=[];
        //entity.all is initiated in setup, this is a backup that fires for situations with no canvas
        if(!Entity.all){ //this is for circumvention of hoisting order issue
            Entity.all=[];
        }
        Entity.all.push(this);
    }
    set speed(value){
        if (!Number.isFinite(value)) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value, "Speed must be a valid number."));
        }
        this.#speed=value
        this.velocity.x=this.#pen.math.cos(this.#direction)*this.#speed;
        this.velocity.y=this.#pen.math.sin(this.#direction)*this.#speed;
        return this.#speed
    }   
    get speed(){
        return this.#speed
    }
    set direction(value){
        if (!Number.isFinite(value)) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value, "Direction must be a valid number."));
        }
        this.#direction=this.#pen.math.adjustDegressSoTopIsZero(value);
        const adjustedDegree=this.#direction;
        this.velocity.x=this.#pen.math.cos(adjustedDegree)*this.#speed;
        this.velocity.y=this.#pen.math.sin(adjustedDegree)*this.#speed;
        return this.#direction
    }
    get direction(){
        return this.#direction
    }
    hasAsset(){
        return this.#assets.length > 0
    }
    drawAssets() {
        for(let i=0; i<this.#assets.length; i++){
            this.#assets[i].x=this.x;
            this.#assets[i].y=this.y;
            this.#assets[i].draw(this.x,this.y,this.rotation);
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

        if(this.hasAsset()){
            this.drawAssets();
        }
    }
    set asset(value){
        if(value===undefined){
            throw Error(`You need to provide an Image or an Animation! You provided undefined :(`);
        }
        //check if its a group as that'd be a common brainfart
        this.#assets=[]; //clear old assets, since only one right now
        
        if(value.type==="animation"){ 
            //change this over to a .clone method in animation so its consistent with imgWrapper
            const nuAnimWrapper = new Animation( this.x, this.y, this.#pen, ...value );
            nuAnimWrapper.delay=value.delay;
            nuAnimWrapper.looping = value.looping;
            nuAnimWrapper.playing = value.playing;
            nuAnimWrapper.rotation = value.rotation;
            nuAnimWrapper.frame = value.frame;
            //update all the props to match, do this manually to avoid silly behaviours
            this.#assets.push(nuAnimWrapper);
        }
        if(value.type==="image"){
            //added clone method to circumvent hoisting issue
            const nuImgWrapper=value.clone(value.x,value.y,value.data,this.#pen);
            nuImgWrapper.w=value.w;
            nuImgWrapper.h=value.h;
            this.#assets.push(nuImgWrapper);
        }
    }
    set rotation(value) { 
        if (Number.isFinite(value) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(value,"The width for this animation needs to be a number!"));
        }
        const degreeAdjustedValue=this.#pen.math.adjustDegressSoTopIsZero(value);
        this.#rotation=degreeAdjustedValue;
        for(let i=0; i<this.#assets.length; i++){
            this.#assets[i].rotation=degreeAdjustedValue;
        }
        return this.#rotation;
    }

    /**
     * returns the internal rotation
     *
     * @returns {number} The current width.
     */
    get rotation() {
        return this.#rotation;
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
            this.x += this.velocity.x * this.#pen.time.timeMultipler;
        }
        if (this.velocity.y != 0) {
            this.y += this.velocity.y * this.#pen.time.timeMultipler;
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
    #w;
    #h;
    #radius;
    #assets;
    constructor(pen,x,y,w,h){
        super(pen,x,y);
        this.#w=w;
        this.#h=h;
        this.#updateRadius(this.#w,this.#h);
        this.#assets=[]
    }
    set w(value) {
        if (Number.isFinite(value) && value>0) {
            this.#w = value;
            this.#updateRadius(this.#w, this.#h);
            if(this.#assets){
                this.#assets.w = value;
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
            this.#updateRadius(this.#w, this.#h);
            if(this.#assets){
                this.#assets.h = value;
            }
            return this.#h;
        }
        throw new Error(ErrorMsgManager.numberCheckFailed(value,"h has to be a number and above 0"));
    }
    get h() {
        return this.#h;
    }
    get radius() {
        return this.#radius;
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
    #updateRadius(width, height) {
        this.#radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        return this.#radius;
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