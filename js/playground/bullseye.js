import {Pen} from "../../lib/Pen.js"
const p = new Pen(preload,setup,draw);
const shape=p.shape;
const colour=p.colour;

p.preload();

let angle=0;
function preload(){}

function setup(){
    p.w=400;
    p.h=400;
}

function draw(){
    for(let i=0; i<5; i++){
        const size=100-i*21;
        colour.stroke="rgba(0,0,0,0)";
        if(size%2===0){
            colour.fill="red";
        } else { 
            colour.fill="white";
        }
        shape.oval(p.mouse.x,p.mouse.y,size);
    }
}