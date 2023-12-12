export class DrawStateManager {
    #pen
    constructor(pen){
        this.stack=[]
        this.#pen=pen;
    }
    save(){
        const newState=new DrawState(this.#pen);
        this.stack.push(newState);
        this.#pen.context.save();
        if(this.stack.length>100){
            console.warn("over 100 states are saved currently this could cause performance impacts")
        }
    }
    load(){
        if(this.stack.length<=0){
            throw new Error("Tried to load a previous drawing state but none was saved? :(")
        }
        const newState=this.stack.pop();
        this.#pen.text.state=newState.text;
        this.#pen.shape.state=newState.shape;
        this.#pen.colour.state=newState.colour; //grab the last created state and remove it, use its values
        this.#pen.context.restore();
    }
    reset(){  //shape
        this.#pen.shape.alignment="center";
        this.#pen.shape.strokeWidth=1;
        this.#pen.colour.fill="white";
        this.#pen.colour.stroke="white";

        this.#pen.text.alignment="center";
        this.#pen.text.baseline="middle";
        this.#pen.text.size=16;
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