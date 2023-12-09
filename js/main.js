import {Pen} from "../lib/Pen.js"
const p = new Pen(draw);
const shape=p.shape;
const colour=p.colour;
const mouse=p.mouse;
const keyboard=p.kb;
const text=p.text;

p.start();

window.pen=p;

let x = 0;

let img=p.loadImage(p.mouse.x,p.mouse.y,"../images/sample.png");
let img5=p.loadImage(p.mouse.x,p.mouse.y,"../images/sample3.png");
let img2=p.loadImage(p.w/2,p.h/2,"../images/sample2.png"); 
let txt=p.loadTextFile("../data/hello.txt");
let j=p.loadJsonFile("../data/jason.json");
let btn = p.makeButton(200,100,100,50);
btn.label=`Entity Id:${btn.id}`;

let btn2 = p.makeButton(350,100,100,50);
btn2.label=`Entity Id:${btn2.id}`;


function setup() {
    if(p.frameCount===0){
        p.w=800;
        p.h=350; 
        img.x=p.w/2;
        img.y=p.h/2;  
        img.w=p.w;
        img.h=p.h;
        console.log(j)
    }
}

function draw() { 
    setup();

    img.rotation=0;

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

    shape.line(
        200,0,
        200,p.h
    )
    text.draw(200,200,"200,200")

    x += 1;
    if (x > p.w)  {
        x = 0;
    }

    img2.rotation++

    img.draw();

    img2.x=mouse.x;
    img2.y=mouse.y;
    img2.draw();
    btn.draw();
    btn2.draw();
}