import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";
import { Paint } from "../../lib/Paint.js";

$.use(update);
$.debug=true;
let squares = $.makeGroup();
let ships = $.makeGroup();

// let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
let img=$.loadImage(0,0,"./images/fac0_refinery.png");
/*
let redShip=$.makeBoxCollider($.w/2+200,$.h/2,80,80);
redShip.speed=10;
redShip.asset=img;
redShip.mass = 1;
redShip.direction=270;
redShip.friction=0.5;
redShip.rotationalVelocity = 0;
squares.push(redShip);
*/
let yellowShip=$.makeBoxCollider($.w/2,$.h/2-50,80,80);
yellowShip.speed=0;
yellowShip.asset=img;
yellowShip.mass = 2;
yellowShip.direction=0;
yellowShip.friction=0.5;
squares.push(yellowShip);


let rightSquare;
for (let i = 100; i < 800; i += 200) {
    for (let j = 100; j < 600; j += 200) {
        rightSquare=$.makeBoxCollider(i,j, 80, 80);
        rightSquare.mass = 1;
        rightSquare.friction = 0.5;
        rightSquare.asset=img;
        squares.push(rightSquare);
    }
}

function drawTree(quad, counter) {
    let colorArray = ["white", "yellow", "red", "purple", "blue", "green", "orange", "brown", "pink", "grey", "gold", "teal", "bronze", "lime"];
    for (let i = 1; i <= 4; i++) {
        let q = quad.getQuad(i);
        if (q != null) {
            $.colour.stroke="black";
            $.colour.fill = "white";//colorArray[counter];
            counter += 1;
            if (counter == colorArray.length) {
                counter = 0;
            }
            $.shape.rectangle(q.left + (q.right - q.left)/2, q.top + (q.bottom - q.top)/2, q.size, q.size);
            drawTree(q, counter);
        }
    }
}

function background(colour){
    $.colour.fill=colour;
    $.shape.rectangle($.width/2,$.height/2,$.width,$.height);
}

function setup(){
    if($.frameCount===0){
        console.log('Start');
    }
}

function update() { 
    setup();
    background("rgba(125,125,125)");
    $.paused=false;
    /*if(mouse.leftUp){
        $.camera.moveTo(mouse.x,mouse.y);
    }*/

    if(mouse.leftDown){
        yellowShip.x = mouse.x;
        yellowShip.y = mouse.y;
    }

    //yellowShip.rotation=yellowShip.direction;
    if(keys.down("uparrow")){
        yellowShip.direction=0;
        yellowShip.speed=5;
    }
    if(keys.down("downarrow")){
        yellowShip.direction=180;
        yellowShip.speed=5;
    }
    if(keys.down("leftarrow")){
        yellowShip.direction=270;
        yellowShip.speed=5;
    }
    if(keys.down("rightarrow")){
        yellowShip.direction=90;
        yellowShip.speed=5;
    } 
    shape.polygon(
        $.w/2-75,100,
        $.w/2,200,
        $.w/2+75,100,
    );
    
    if(keys.down("a")){
        $.camera.x-=10
    }
    if(keys.down("d")){
        $.camera.x+=10
    }
    if(keys.down("w")){
        $.camera.y-=10
    }
    if(keys.down("s")){
        $.camera.y+=10
    }

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
            sq.x=$.width-1;
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

    // drawTree(squares.QuadTree.getTree(), 0);
    //console.log(squares.QuadTree.getTree());

    $.drawAllColliders();

    document.getElementById("fps").innerText = $.time.averageFps;
}