import { $ as p,shape,colour,mouse,keys,txt } from "../lib/Pen.js";
import { Group } from "../lib/Group.js";
const q = p;
p.use(draw);
p.debug=true;
window.pen = p;

let x = 0;

// load animations
let anim1=q.loadAnimation(
        20+8*20,
        q.h / 2-20,
        "../images/fac0_wreckage1.png",
        "../images/fac0_wreckage2.png",
        "../images/fac0_wreckage3.png",
        "../images/fac0_wreckage4.png",
    )
let anim2=q.loadAnimation(
    20+5*20,
    q.h / 2,
    "../images/fac0_wreckage1.png",
    "../images/fac0_wreckage2.png",
    "../images/fac0_wreckage3.png",
    "../images/fac0_wreckage4.png",
)
let anim3=q.loadAnimation(
    20+8*20,
    q.h / 2-120,
    "../images/fac0_wreckage1.png",
    "../images/fac0_wreckage2.png",
    "../images/fac0_wreckage3.png",
    "../images/fac0_wreckage4.png",
)
//end load animations

//load assets
let img = q.loadImageToStamp(mouse.x, mouse.y, "../images/sample.png");

let img2 = q.loadImageToStamp(p.w / 2, q.h / 2, "../images/sample2.png");
let text = q.loadTextFile("../data/hello.txt");
let j = q.loadJsonFile("../data/jason.json");
//end load assets

let btn = q.makeButton(200, 100, 100, 50);
btn.label = `Entity Id:${btn.id}`;

let btn2 = q.makeButton(350, 100, 100, 50);
btn2.label = `Entity Id:${btn2.id}`;

const testCollider=q.makeBoxCollider(400,250,50);
const secondCollider=q.makeBoxCollider(250,200,100);
const thirdCollider=q.makeBoxCollider(250,500,75);
testCollider.velocity.x=-2;
testCollider.velocity.y=0;

thirdCollider.velocity.y=-2;

function setup() {
    q.w = 800;
    q.h = 350;
    img.x = q.w / 2;
    img.y = q.h / 2;
    img.w = q.w;
    img.h = q.h;
}

function draw() {
    txt.alignment = "left";
    if (p.frameCount === 0) {
        setup();
    }

    img.rotation = 0;
    colour.fill = "grey";
    shape.rectangle(p.w / 2, q.h / 2, q.w, q.h);
    colour.fill = "blue";
    txt.size = 19;

    txt.draw(
        447,
        120,
        "This is a long piece of text that should be wrapped within the specified width.",
        200
    );
    
    shape.rectangle(x, 200, 100, 50);
    shape.rectangle(mouse.x, mouse.y, 100, 50);
    shape.oval(mouse.x, mouse.y, 50, 30);
    shape.line(300, 50, 400, 150);
    shape.multiline(10, 10, 50, 50, 10, 90);
    shape.polygon(150 + x, 100, 200 + x, 150, 150 + x, 200, 100 + x, 150);

    shape.line(200, 0, 200, q.h);
    txt.draw(200, 200, "200,200");

    x += 1;
    if (x > q.w) {
        x = 0;
    }

    img2.rotation++;

    // img.draw();

    // img2.draw();
    btn.draw();
    btn2.draw();
    colour.fill = "black";
    txt.draw(80, 20, "align");
    txt.alignment = "left";
    txt.draw(80, 40, "left sfsd");

    txt.alignment = "center";
    txt.draw(80, 60, "center sdf");

    txt.alignment = "right";
    txt.font = "Arial";
    txt.draw(80, 80, "right sdfds");
    
    testCollider.draw();
    secondCollider.draw();
    thirdCollider.draw();

    anim1.draw();
    txt.alignment="center";
    txt.draw(anim1.x,anim1.y,"anim1")
    anim2.draw();
    txt.draw(anim2.x,anim2.y,"anim2")
    anim3.draw();
    txt.draw(anim3.x,anim3.y,"anim3")

    if(testCollider.collides(secondCollider)){
        
    }

    if(thirdCollider.collides(secondCollider)){
        
    }

}
