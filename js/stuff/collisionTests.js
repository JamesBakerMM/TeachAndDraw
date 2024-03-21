import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";
import { Paint } from "../../lib/Pallete.js";

$.start(draw);
$.debug=false;
$.fps=20;
let squares = makeGroup();
let ships = makeGroup();

let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
leftSquare.speed=0;
leftSquare.direction=240;
let img=$.loadImage(0,0,"./images/fac0_refinery.png");
leftSquare.asset=img;
window.lSquare=leftSquare;
leftSquare.mass = 200000;
leftSquare.friction = 0;
squares.push(leftSquare);

let rightSquare;
for (let i = 10; i < 790; i += 10) {
    for (let j = 10; j < 590; j += 5) {
        rightSquare=$.makeBoxCollider(i,j, 3, 3);
        rightSquare.velocity.x = 0;
        rightSquare.mass = 1;
        rightSquare.friction = 10;
        squares.push(rightSquare);
    }
}

function drawTree(quad, counter) {
    let colorArray = ["white", "yellow", "red", "purple", "blue", "green", "orange", "brown", "pink", "grey", "gold", "teal", "bronze", "lime"];
    for (let i = 1; i <= 4; i++) {
        let q = quad.getQuad(i);
        if (q != null) {
            $.colour.fill = colorArray[counter];
            counter += 1;
            if (counter == colorArray.length) {
                counter = 0;
            }
            $.shape.rectangle(q.left + (q.right - q.left)/2, q.top + (q.bottom - q.top)/2, q.size, q.size);
            drawTree(q, counter);
        }
    }
}

function draw(){
    $.paused=false;

    if(mouse.isPressed){
        leftSquare.x=mouse.x;
        leftSquare.y=mouse.y;
        leftSquare.velocity.x=0;
        leftSquare.velocity.y=0;
    }
    
    if(kb.isDown("arrowup")){
        leftSquare.velocity.y-=2*$.time.timeMultipler;
        leftSquare.rotation=0;
    }
    if(kb.isDown("arrowdown")){
        leftSquare.velocity.y+=2*$.time.timeMultipler;
        leftSquare.rotation=180;
    }
    if(kb.isDown("arrowleft")){
        leftSquare.velocity.x-=2*$.time.timeMultipler;
        leftSquare.rotation=270;
    }
    if(kb.isDown("arrowright")){
        leftSquare.velocity.x+=2*$.time.timeMultipler;
        leftSquare.rotation=90;
    }
    

    //Quad tree testing stuff
 
 /*   
    let colorArray = ["white", "yellow", "red", "purple", "blue"];
    let num = $.quadTree.getValue(leftSquare.x, leftSquare.y, leftSquare.radius);
    let text = num.toString(2);
    console.log(text);
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            let q = $.quadTree.getQuad().getQuad(i).getQuad(j);
            $.colour.fill = colorArray[j];
            $.shape.rectangle(q.left + (q.right - q.left)/2, q.top + (q.bottom - q.top)/2, q.width, q.height);
        }
    }
*/

    // if(leftSquare.x>$.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>$.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }
    squares.collides(squares);
    for (let i = 0; i < squares.length; i++) {
        const sq = squares[i];
        if(sq.x>$.width){
            sq.x=$.width;
            sq.velocity.x=-sq.velocity.x;
        }
        if(sq.x<0){
            sq.x=0;
            sq.velocity.x=-sq.velocity.x;
        }
        if(sq.y>$.height){
            sq.y=$.height-1;
            sq.velocity.y=-sq.velocity.y;
        }
        if(sq.y<0){
            sq.y=0;
            sq.velocity.y=-sq.velocity.y;
        }

        // $.colour.fill = "#00000000";
        // $.colour.stroke = "#FFFF00FF";
        // $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }

    //drawTree(squares.QuadTree.getTree(), 0);
    //console.log(squares.QuadTree.getTree());

    $.drawAllColliders();

    document.getElementById("fps").innerText = $.time.averageFps;
}