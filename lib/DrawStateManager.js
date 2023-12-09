export class DrawStateManager {
    #pen
    constructor(pen){
        this.stack=[]
        this.#pen=pen;
    }
    save(){
        const newState=new DrawState(this.#pen);
        this.stack.push(newState);
    }
    load(){
        const textState={};
        const shapeState={};
        const colourState={};
        this.#pen.text.state=textState;
        this.#pen.shape.state=shapeState;
        this.#pen.colour.state=colourState; //grab the last created state and remove it, use its values
    }
    reset(){
        this.#pen.shape.strokeWidth=1;
        this.#pen.colour.fill="white";
        this.#pen.colour.stroke="white";
    }
}

class DrawState{
    constructor(pen){
        this.colour={
            fill:pen.colour.fill,
            stroke:pen.colour.stroke
        }
        this.shape={
            strokeWidth:pen.strokeWidth,
            strokeDashed:[]
        }
        this.text={
            size:16,
            w:-1,
            h:-1,
            font:null
        }
    }
}