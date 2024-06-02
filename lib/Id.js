export class Id { //manages unique ids groups,entities and colliders
    static id=0;
    static getId() {
        Id.id += 1;
        return Id.id;
    }
}