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
        if(this.stack.length<=0){
            throw new Error("Tried to load a previous drawing state but none was saved? :(")
        }
        const newState=this.stack.pop();
        this.#pen.text.state=newState.text;
        this.#pen.shape.state=newState.shape;
        this.#pen.colour.state=newState.colour; //grab the last created state and remove it, use its values
    }
    reset(){  //shape
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
            strokeWidth:pen.shape.strokeWidth,
            alignment:pen.shape.alignment,
            strokeDashed:[]
        }
        this.text={
            alignment:pen.text.alignment,
            baseline:pen.text.baseline,
            size:16,
            font:pen.text.font
        }
    }
}