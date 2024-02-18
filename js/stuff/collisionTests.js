import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { Group } from "../../lib/Group.js";
$.start(draw);
$.debug=true;
let edges = new Group();
let squares = new Group();

let leftEdge=$.makeBoxCollider(0,$.h/2,20,$.h);
leftEdge.static=true;
let rightEdge=$.makeBoxCollider($.w,$.h/2,20,$.h);
rightEdge.static=true;

//edges.push(leftEdge);
//edges.push(rightEdge);


let leftSquare=$.makeBoxCollider($.w/2,$.h/2-20,80,80);
leftSquare.velocity.x = 6;
leftSquare.mass = 2;
leftSquare.friction = 10;
squares.push(leftSquare);

for (let i = -5; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+200,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

for (let i = -5; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+100,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

function draw(){

    squares.draw();
    //edges.draw();
    
    for (let i = 0; i < squares.length; i++) {
        if(leftSquare.collides(squares[i])){
            //console.log("left square collided with right square")
        }
        for (let j = 0; j < squares.length; j++) {
            if (i != j) {
                squares[i].collides(squares[j]);
            }
        }

        $.colour.fill = "#00000000";
        $.colour.stroke = "#FFFF00FF";
        $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }
}