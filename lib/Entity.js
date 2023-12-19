import {Point} from "./Point.js"

export class Entity {
    static id=0;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    #position
    constructor(pen,x,y){
        this.id=Entity.getId();
        this.#position=new Point(pen,x,y);
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
            if(this.#asset){
                this.#asset.w = value;
            }
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
            if(this.#asset){
                this.#asset.h = value;
            }
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
//shaped entity is an entity with getters and setters for w and h as well as x and y