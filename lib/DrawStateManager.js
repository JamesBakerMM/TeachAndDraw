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
            console.warn("over 100 states are saved currently this could cause performance impacts! check how often you are calling state.save() before you call state.load()")
        }
    }
    load(){
        if(this.stack.length<=0){
            throw new Error("Tried to load a previous drawing state but none were saved? :(")
        }
        const newState=this.stack.pop();
        this.#pen.text.state=newState.text;
        this.#pen.shape.state=newState.shape;
        this.#pen.colour.state=newState.colour; //grab the last created state and remove it, use its values
        this.#pen.context.restore();
    }
    reset(){  //reset intended to reset state to defaults start of each frame
        if(this.stack.length>0){
            console.warn("you have states saved from the previous frame! you likely forgot to call a state.load() somewhere :)")
        }
        this.#pen.shape.xAlignment="center";
        this.#pen.shape.yAlignment="center";
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
            xAlignment:pen.shape.xAlignment,
            yAlignment:pen.shape.yAlignment,
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