import { Pen } from "../lib/Pen.js";
import { Group } from "../lib/Group.js";
const p = new Pen(draw);
const shp = p.shape;
const col = p.colour;
const mouse = p.mouse;
const kb = p.kb;
const txt = p.text;

p.start();

window.pen = p;

let x = 0;

let anim = p.loadAnimation(
    p.w / 2,
    p.h / 2,
    "../images/fac0_wreckage1.png",
    "../images/fac0_wreckage2.png",
    "../images/fac0_wreckage3.png",
    "../images/fac0_wreckage4.png",
);
window.anim = anim;
let img = p.loadImage(mouse.x, mouse.y, "../images/sample.png");
let img5 = p.loadImage(mouse.x, mouse.y, "../images/sample3.png");
let img2 = p.loadImage(p.w / 2, p.h / 2, "../images/sample2.png");
let text = p.loadTextFile("../data/hello.txt");
let j = p.loadJsonFile("../data/jason.json");
let btn = p.makeButton(200, 100, 100, 50);
btn.label = `Entity Id:${btn.id}`;

let example = new Group();
let btn2 = p.makeButton(350, 100, 100, 50);
btn2.label = `Entity Id:${btn2.id}`;

window.example = example;
example.push({ id: 0 });
example.push({ id: 1 });
example.push({ id: 2 });
example.push({ id: 3 });
example.push({ id: 4 });

function setup() {
    p.w = 800;
    p.h = 350;
    img.x = p.w / 2;
    img.y = p.h / 2;
    img.w = p.w;
    img.h = p.h;
}

function draw() {
    txt.alignment = "left";
    if (p.frameCount === 0) {
        setup();
    }

    img.rotation = 0;
    col.fill = "grey";
    shp.rectangle(p.w / 2, p.h / 2, p.w, p.h);
    col.fill = "blue";
    txt.size = 19;

    txt.draw(
        447,
        120,
        "This is a long piece of text that should be wrapped within the specified width.",
        200
    );

    
    shp.rectangle(x, 200, 100, 50);
    shp.rectangle(mouse.x, mouse.y, 100, 50);
    shp.oval(mouse.x, mouse.y, 50, 30);
    shp.line(300, 50, 400, 150);
    shp.multiline(10, 10, 50, 50, 10, 90);
    shp.shape(150 + x, 100, 200 + x, 150, 150 + x, 200, 100 + x, 150);

    shp.line(200, 0, 200, p.h);
    txt.draw(200, 200, "200,200");

    x += 1;
    if (x > p.w) {
        x = 0;
    }

    img2.rotation++;

    img.draw();

    img2.draw();
    btn.draw();
    btn2.draw();
    col.fill = "black";
    txt.draw(20, 20, "align");
    txt.alignment = "left";
    txt.draw(20, 40, "left");
    txt.alignment = "center";
    txt.draw(20, 60, "center");
    txt.alignment = "right";
    txt.font = "Arial";

    txt.draw(20, 80, "right");
    anim.x = mouse.x;
    anim.y = mouse.y;
    anim.draw();

}
