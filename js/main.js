import {Pen} from "../lib/monke.js"
const p = new Pen(preload,setup,draw);
let x = 0;
let img=p.loadImage(0,0,"../images/sample.png");

p.preload();

function preload(){}

function setup() {
    p.w=800;
    p.h=350;
}

function draw() {
    p.colour.fill="grey";
    p.shape.rectangle(0+p.w/2,0,p.w,p.canvas.height);
    p.colour.fill="red";
    p.shape.rectangle(x,200,100,50);
    p.shape.oval(p.mouse.x, p.mouse.y, 50, 30); 
    p.shape.line(300, 50, 400, 150); 
    p.shape.multiline(10, 10, 50, 50, 10, 90);
    p.shape.shape(
        150+x, 100, 
        200+x, 150, 
        150+x, 200, 
        100+x, 150
    );

    x += 1;
    if (x > p.w)  {
        x = 0;
    }

    img.w=p.w;
    img.h=p.h;
    img.draw();

}

//changing it so images have: an x and y
//makeImage(x,y,img)