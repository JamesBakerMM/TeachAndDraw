import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";
import { Paint } from "../../lib/Pallete.js";

$.start(draw);
$.debug=false;
$.fps=20;
let squares = makeGroup();
let ships = makeGroup();

let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
leftSquare.speed=2;
leftSquare.direction=240;
let img=$.loadImage(0,0,"./images/fac0_refinery.png");
leftSquare.asset=img;
window.lSquare=leftSquare;
leftSquare.mass = 200000;
leftSquare.friction = 0;
squares.push(leftSquare);

let rightSquare;
for (let i = 0; i < 700; i += 15) {
    for (let j = 0; j < 500; j += 15) {
        rightSquare=$.makeBoxCollider(i,j, 5, 5);
        rightSquare.velocity.x = 0;
        rightSquare.mass = 1;
        rightSquare.friction = 1;
        squares.push(rightSquare);
    }
}

function draw(){
    // $.paused=true;

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
    let colorArray = ["white", "yellow", "red", "purple", "blue"];

    //Quad tree testing stuff
 /*   
    let num = $.quadTree.getValue(leftSquare.x, leftSquare.y, leftSquare.radius);
    let text = num.toString(2);
    console.log(text);
    if (true) {
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 4; j++) {
                for (let k = 1; k <= 4; k++) {
                    let q = $.quadTree.getQuad().getQuad(i).getQuad(j).getQuad(k);
                    $.colour.fill = colorArray[k];
                    $.shape.rectangle(q.left + (q.right - q.left)/2, q.top + (q.bottom - q.top)/2, q.width, q.height);
                }
            }
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
    $.drawAllColliders();

    document.getElementById("fps").innerText = $.time.averageFps;
}