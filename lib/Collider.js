import { Debug } from "./Debug.js";
import { ShapedAssetEntity } from "./Entity.js";
import { Point } from "./Point.js";
import { Velocity } from "./Velocity.js"



export class Collider extends ShapedAssetEntity {
    #pen
    #asset
    #w
    #h
    #friction
    constructor(pen,x,y,w,h=w) {
        super(x,y)
        this.#pen=pen;
        this.velocity=new Velocity(0,0);
        this.prevX=x;
        this.prevY=y;
        this.x=x;
        this.y=y;
        this.#w=w;
        this.#h=h;
        this.#friction=0.9;
        this.#asset;
        this.hasOverlapped=false;
    }
    set asset(value){
        //if value is a type of valid asset
        this.#asset=value;
        return this.#asset
        throw Error(`you can only assign an asset of the validTypes, you gave ${value}:${typeof value}`)
        //else throw error listing expected types
    }
    get asset(){
        return this.#asset
    }
    drawIdleVersion(){

    }
    #formatNumber(num) {
        if (Math.abs(num) > 0.009) {
            return parseFloat(num.toFixed(3));
        } else {
            return 0;
        }
    }
    overlaps(otherCollider){
        //check if its a collider of the box type
        const result=this.x < otherCollider.x + otherCollider.w &&
        this.x + this.w > otherCollider.x &&
        this.y < otherCollider.y + otherCollider.h &&
        this.h + this.y > otherCollider.y;
        if(result){
            this.hasOverlapped=true;
            otherCollider.hasOverlapped=true;
        }
        return result
        throw Error(`overlaps only works on colliders! you gave ${otherCollider}:${typeof otherCollider}`)
    }    
    collides(otherCollider){
        //if overlaps, go do physics stuff!
    }
    move(){
        this.x+=this.velocity.x
        this.y+=this.velocity.y
        if(this.#friction!==1){
            this.velocity.x=this.#formatNumber(this.#friction*this.velocity.y);
            this.velocity.y=this.#formatNumber(this.#friction*this.velocity.y);
        }
    }
    set friction(value){
        //check types
        this.#friction=value;
    }
    get friction(){

    }
    drawCollidedVersion(){

    }
    draw(){
        this.move();
        this.#pen.state.save();
        this.#pen.context.translate(this.x,this.y)
        const x=0;
        const y=0;
        this.#pen.colour.stroke="aqua";
        this.#pen.shape.strokeWidth=3;
        this.#pen.shape.alignment="center";        
        this.#pen.colour.fill="rgba(136,242,194,0.7)";
        this.#pen.shape.rectangle(x,y,this.w,this.h);
        
        this.#pen.colour.fill="rgba(86,153,234,0.7)";
        let w= this.w/1.5;
        let h =this.h/1.5;
        if(Point.isInRect(
            this.#pen.mouse.x,this.#pen.mouse.y,
            this.x,this.y,this.w,this.h
        ) || this.hasOverlapped){
            w=this.w/1.25;
            h=this.h/1.25;
            this.#pen.colour.stroke="rgba(86,153,234,0.7)";    
            this.#pen.colour.fill="rgba(136,242,194,1)";
        }
        this.#pen.shape.rectangle(x,y,w,h)
        this.#pen.state.load();
        this.sync();
    }
    sync(){
        this.prevX=this.x;
        this.prevY=this.y;
        this.hasOverlapped=false;
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

// export class CircleCollider extends Collider {
//     #diameter
//     #w
//     constructor(pen,x,y,d){
//         super(pen,x,y,d)
//     }
//     set diameter(value) {
//         if (Number.isFinite(value)) {
//             this.#w=value;
//             return this.#w
//         }
//         throw Error(
//             `soz, diameter can only be set as a number, you gave me: ${value} of type ${typeof value}`
//         );

//     }
//     get diameter(){
//         return this.#diameter
//     }
//     draw(){

//     }
// }