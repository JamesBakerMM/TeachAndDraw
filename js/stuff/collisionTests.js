import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";
import { Paint } from "../../lib/Pallete.js";

$.start(draw);
$.debug=true;
let edges = makeGroup();
let squares = makeGroup();

let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
let img=$.loadImage(0,0,"./images/fac0_refinery.png");
leftSquare.asset=img;

window.lSquare=leftSquare;
leftSquare.velocity.x = 0;
leftSquare.mass = 200000;
leftSquare.friction = 1;
squares.push(leftSquare);

const START_NUM=-45;
for (let i = 0; i < 800; i += 15) {
    for (let j = 0; j < 600; j += 15) {
        let rightSquare=$.makeBoxCollider(i,j, 5, 5);
        rightSquare.velocity.x = 0;
        rightSquare.mass = 1;
        rightSquare.friction = 10;
        squares.push(rightSquare);
    }
}

function draw(){
    // $.text.font="arial";
    // $.paused=true;
    //edges.draw();

    if(mouse.isPressed){
        leftSquare.x=mouse.x;
        leftSquare.y=mouse.y;
        leftSquare.velocity.x=0;
        leftSquare.velocity.y=0;
    }

    if(kb.isDown("arrowup")){
        leftSquare.velocity.y--
        leftSquare.rotation=270;
    }
    if(kb.isDown("arrowdown")){
        leftSquare.velocity.y++
        leftSquare.rotation=90;
    }
    if(kb.isDown("arrowleft")){
        leftSquare.velocity.x--
        leftSquare.rotation=180;
    }
    if(kb.isDown("arrowright")){
        leftSquare.velocity.x++
        leftSquare.rotation=0;
    }

    // if(leftSquare.x>$.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>$.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }
    squares.collides(squares);
    for (let i = 0; i < squares.length; i++) {
        if(squares[i].x>$.width){
            squares[i].x=$.width;
            squares[i].velocity.x=-squares[i].velocity.x;
        }
        if(squares[i].x<0){
            squares[i].x=0;
            squares[i].velocity.x=-squares[i].velocity.x;
        }
        if(squares[i].y>$.height){
            squares[i].y=$.height-1;
            squares[i].velocity.y=-squares[i].velocity.y;
        }
        if(squares[i].y<0){
            squares[i].y=0;
            squares[i].velocity.y=-squares[i].velocity.y;
        }

        // $.colour.fill = "#00000000";
        // $.colour.stroke = "#FFFF00FF";
        // $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }
    $.drawAllColliders();
}