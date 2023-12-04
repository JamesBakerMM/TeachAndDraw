import {Pen} from "../lib/monke.js"
const p = new Pen(preload,setup,draw);
let x = 0;
let img=p.loadImage("../images/sample.png");
let btn = p.makeButton(200,0,100,50);
window.pen=p;

p.preload();

function preload(){}

function setup() {
    // Example setup code
    p.w=800;
    p.h=350;
}

function draw() {
    // Example drawing code    
    p.colour.fill="grey";
    p.shape.rectangle(0+p.w/2,0,p.w,p.canvas.height);
    p.colour.fill="red";
    p.shape.rectangle(x,200,100,50);
    p.shape.oval(200, 100, 50, 30); 
    p.shape.line(300, 50, 400, 150); 
    p.shape.multiline(10, 10, 50, 50, 10, 90);
    p.shape.shape(100, 100, 150, 150, 100, 200, 50, 150);

    x += 1; // Move the circle
    if (x > p.w)  {
        x = 0; // Reset position
    }
    pen.image.draw(img,9,9)

    btn.draw();
}