import { $, shape, colour, mouse, keys, text } from "../../lib/TeachAndDraw.js";
import { Paint } from "../../lib/Paint.js";
import { Velocity } from "../../lib/Velocity.js";

$.use(update);
$.debug=false;
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

let yellowShip=$.makeCircleCollider(170,200,100,100);
//yellowShip.asset=img;
yellowShip.mass = 1;
yellowShip.static = true;
yellowShip.direction=180;
yellowShip.friction=0;
yellowShip.speed = 0;
yellowShip.bounciness = 100;
yellowShip.rotation = 0;
yellowShip.velocity = new Velocity(0, 10);
squares.push(yellowShip);

let box=$.makeCircleCollider(200,400,100,50);
box.speed = 0;
box.direction = 90;
box.static = false;
box.bounciness = 50;
box.friction= 0;
box.rotation = 0;
box.mass = 1;
box.rotation = 20;
box.rotationalVelocity = 10;
box.velocity = new Velocity(0, 1);
squares.push(box);

/*
let box2=$.makeBoxCollider(200,400,400,50);
box2.shape = "box";
box2.speed=0;
box2.static = true;
box2.rotation = 0;
box2.mass = 1;
box2.friction = 0;
squares.push(box2);
*/

let rightSquare;
for (let i = 600; i > 100; i -= 10) {
    for (let j = 600; j > 100; j -= 10) {
        rightSquare=$.makeCircleCollider(i,j, 10, 5);
        rightSquare.mass = 1;
        rightSquare.friction = 0;
        rightSquare.bounciness = 50;
        //rightSquare.asset=img;
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

let flag = 1;

function update() { 
    setup();
    background("rgba(125,125,125)");

    $.colour.fill="black";
    //$.text.print($.w/2,$.h/2,`x:${$.mouse.x} y:${$.mouse.y}`);

    if(mouse.leftDown){   
        yellowShip.x = mouse.x;
        yellowShip.y = mouse.y;
    }

    //yellowShip.rotation=yellowShip.direction;
    if(keys.down("uparrow")){
        yellowShip.velocity.y -=8;
    }
    if(keys.down("downarrow")){
        yellowShip.velocity.y +=4;
    }
    if(keys.down("leftarrow")){
        yellowShip.velocity.x -=4;
    }
    if(keys.down("rightarrow")){
        yellowShip.velocity.x +=4;
    }

    // if(leftSquare.x>$.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>$.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }
    squares.collides(squares);

    //yellowShip.velocity.y += 1;

    for (let i = 0; i < squares.length; i++) {
        const sq = squares[i];
        if (sq.shape == "circle")
        {
            //sq.velocity.y += 1;
        }
        
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

    $.drawColliders();
}