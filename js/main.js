import {Pen} from "../lib/Pen.js"
const p = new Pen(preload,setup,draw);
window.pen=p;
const shape=p.shape;
const colour=p.colour;

let x = 0;

let img=p.loadImage(p.mouse.x,p.mouse.y,"../images/sample.png");
let img2=p.loadImage(p.w/2,p.h/2,"../images/sample2.png");

let btn = p.makeButton(200,100,100,50);
btn.label=`Entity Id:${btn.id}`;

let btn2 = p.makeButton(350,100,100,50);
btn2.label=`Entity Id:${btn2.id}`;

p.preload();

function preload(){}

function setup() {
    p.w=800;
    p.h=350;    
    img.x=200;
    img.y=200;   
}

function draw() { 
    img.w=p.w;
    img.h=p.h;
    colour.fill="grey";
    shape.rectangle(p.w/2,p.h/2,p.w,p.h);
    colour.fill="red";
    shape.rectangle(x,200,100,50);
    shape.rectangle(p.mouse.x,p.mouse.y,100,50);
    shape.oval(p.mouse.x, p.mouse.y, 50, 30); 
    shape.line(300, 50, 400, 150); 
    shape.multiline(10, 10, 50, 50, 10, 90);
    shape.shape(
        150+x, 100, 
        200+x, 150, 
        150+x, 200, 
        100+x, 150
    );
    for(let i=0; i<400; i++){
        const offsetX=i*20;
        const prevFill=colour.fill;
        colour.fill="black";
        p.text.draw(0+offsetX,20,i*20);
        colour.fill=prevFill;
    }
    p.shape.line(
        200,0,
        200,p.h
    )
    p.text.draw(200,200,"200,200")

    x += 1;
    if (x > p.w)  {
        x = 0;
    }


    img.draw();

    img2.x=200;
    img2.y=200;
    img2.draw();
    img2.x=p.mouse.x;
    img2.y=p.mouse.y;
    img2.draw();
    btn.draw();
    btn2.draw();
}