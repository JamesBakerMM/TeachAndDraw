import {Pen} from "../../lib/Pen.js"
import {Group} from "../../lib/Group.js"
const p = new Pen(draw);
const shape=p.shape;
const colour=p.colour;
const mouse=p.mouse;
const keyboard=p.keys;
const text=p.text;

let urbie=50;
let madcat=7;
let catapult=5;
let osiris=29;
let marauder=2;

let total=urbie+madcat+catapult+osiris+marauder;

p.use();
window.pen=p;

let angle=0;
function preload(){}

function setup(){
    p.w=400;
    p.h=400;
}

function draw(){
    console.log("setting up")
    if(p.frameCount===0){
        console.log("setting up")
        setup();
    }
    angle=drawSlice(urbie,total,0,"white","urbie");
    angle+=drawSlice(madcat,total,angle,"red","madcat");
    angle+=drawSlice(catapult,total,angle,"aqua","catapult");
    angle+=drawSlice(osiris,total,angle,"green","osiris");
    angle+=drawSlice(marauder,total,angle,"yellow","marauder");
}

function drawSlice(value,total,offset,fill,label){
    const center=p.w/2;
    const radius=100;
    colour.stroke="black";
    colour.fill=fill;

    const percent = value/total;
    const size = percent*360;

    const start=0+offset;
    const end=size+offset;

    shape.arc(center,center,radius,radius,start,end); 
    const labelRadius = radius;
    let x = center + labelRadius * p.math.cos((start + end) / 2);
    let y = center + labelRadius * p.math.sin((start + end) / 2);

    // Draw label
    p.shape.oval(x-5,y-3,2)
    p.text.print(x, y, label);

    return size
}