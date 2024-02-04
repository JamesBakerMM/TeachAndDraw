import { $, shp as shape, col as colour, mouse, kb, txt as text } from "../../lib/Pen.js";
import { Group } from "../../lib/Group.js";
$.start(draw);
$.debug=true;
let edges = new Group();
let squares = new Group();

let leftEdge=$.makeBoxCollider(0,$.h/2,20,$.h);
leftEdge.static=true;
let rightEdge=$.makeBoxCollider($.w,$.h/2,20,$.h);
rightEdge.static=true;

edges.push(leftEdge);
edges.push(rightEdge);

let leftSquare=$.makeBoxCollider($.w/2-20,$.h/2,40,40);
leftSquare.velocity.x=2;
let rightSquare=$.makeBoxCollider($.w/2+80,$.h/2,40,40);
rightSquare.velocity.x=-2;
squares.push(leftSquare);
squares.push(rightSquare);

function draw(){
    if(leftSquare.collides(rightSquare)){
        console.log("left square collided with right square")
    }

    if(leftEdge.collides(leftSquare)){
        console.log("left edge collides with left square")
    }

    if(edges.collides(rightSquare)){
        console.log("right square collides with a member of the edges group")
    }
    squares.draw();
    edges.draw();
}