import {Point} from "./Point.js"

export class Entity {
    static id=0;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    #position
    #attachements
    #hasAttachement
    constructor(pen,x,y){
        this.id=Entity.getId();
        this.#position=new Point(pen,x,y);
        this.#hasAttachement=false;
        this.#attachements=[];
    }
    load(){}
    setup(){}
    draw(){}
    set x(value){
        if(Number.isFinite(value)){
            this.#position.x=value;
            return this.#position.x
        }
        throw Error(`x has to be a number! you gave ${value}:${typeof value}`);
    }
    get x(){
        return this.#position.x
    }
    set y(value){
        if(Number.isFinite(value)){
            this.#position.y=value;
            return this.#position.y
        }
        throw Error(`y has to be a number! you gave ${value}:${typeof value}`);
    }
    get y(){
        return this.#position.y
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
        if (Number.isFinite(value)) {
            this.#w = value;
            // console.log("W FOR ENTITY",value,this.#asset,this.#asset.w)
            if(this.#asset){
                this.#asset.w = value;
            }
            return this.#w;
        }
        throw new Error(ErrorMsgManager.numberCheckFailed(value,"w has to be a number"));
    }
    get w() {
        return this.#w;
    }
    set h(value) {
        if (Number.isFinite(value)) {
            this.#h = value;
            if(this.#asset){
                this.#asset.h = value;
            }
            return this.#h;
        }
        throw new Error(ErrorMsgManager.numberCheckFailed(value,"h has to be a number"));
    }
    get h() {
        return this.#h;
    }
}
//shaped entity is an entity with getters and setters for w and h as well as x and y