export class Entity {
    static id=0;
    static getId(){
        Entity.id+=1;
        return Entity.id
    }
    constructor(){
        this.id=Entity.getId();
    } //get the current offset for x and y from pen each cycle of draw
    load(){}
    setup(){}
    draw(){}
}