import { $ as p, shp as shape, col as colour, mouse, kb, txt as text } from "../../lib/Pen.js";
import { Group } from "../../lib/Group.js";
p.start(draw);

let edges = new Group();

let leftEdge=p.makeBoxCollider(0,p.h/2,20,p.h);
leftEdge.static=true;
let rightEdge=p.makeBoxCollider(p.w,p.h/2,20,p.h);
rightEdge.static=true;

edges.push(leftEdge);
edges.push(rightEdge);

let leftSquare=p.makeBoxCollider(p.w/2-20,p.h/2,40,40);
leftSquare.velocity.x=2;
let rightSquare=p.makeBoxCollider(p.w/2+80,p.h/2,40,40);
rightSquare.velocity.x=-2;

function draw(){
    leftSquare.collides(rightSquare);

    leftEdge.collides(leftSquare);
    edges.collides(leftSquare);
    leftSquare.draw();
    rightSquare.draw();
    leftEdge.draw();
    rightEdge.draw();

}