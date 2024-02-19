import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";

$.start(draw);

$.debug=true;
let edges = makeGroup();
let squares = makeGroup();
let leftEdge=$.makeBoxCollider(0,$.h/2,20,$.h);
leftEdge.static=true;
let rightEdge=$.makeBoxCollider($.w,$.h/2,20,$.h);
rightEdge.static=true;

//edges.push(leftEdge);
//edges.push(rightEdge);


let leftSquare=$.makeBoxCollider($.w/2-200,$.h/2-20,80,80);
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
    let rightSquare=$.makeBoxCollider($.w/2+150,$.h/2 + i * 60,40,40);
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

for (let i = -5; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+50,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}
for (let i = -5; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+2,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}
for (let i = -5; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2-39,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

function draw(){
    // if($.frameCount>50){
    //     $.paused=true;
    // }
    squares.draw();
    //edges.draw();
    if(mouse.isPressed){
        leftSquare.x=mouse.x;
        leftSquare.y=mouse.y;
        leftSquare.velocity.x=0;
        leftSquare.velocity.y=0;
    }
    
    squares.collides(squares);
    for (let i = 0; i < squares.length; i++) {
        // if(leftSquare.collides(squares[i])){
            // squares[i].remove=true
            //console.log("left square collided with right square")
        // }
        // for (let j = 0; j < squares.length; j++) {
        //     if (i != j) {
        //         if(squares[i].collides(squares[j])){
        //             squares[j].remove=true;
        //         }
        //     }
        // }

        $.colour.fill = "#00000000";
        $.colour.stroke = "#FFFF00FF";
        $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }
}