import {Pen} from "../lib/monke.js"
const p = new Pen(preload,setup,draw);
let x = 0;
let img=p.loadImage(0,0,"../images/sample.png");
let img2=p.loadImage(p.w/2,p.h/2,"../images/sample2.png");
let btn = p.makeButton(200,0,100,50);

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
    img2.x=p.mouse.x-img2.w/2;
    img2.y=p.mouse.y-img2.h/2;
    img2.draw();
    btn.draw();
}

//changing it so images have: an x and y
//makeImage(x,y,img)