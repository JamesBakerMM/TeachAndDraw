export class Entity {
    static id=0;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    constructor(){

    }
    load(){}
    setup(){}
    draw(){}
}