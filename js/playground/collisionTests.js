import { $, shape, mouse, keys, make, load } from "../../lib/TeachAndDraw.js";
import { Paint } from "../../lib/Paint.js";
import { Velocity } from "../../lib/Velocity.js";

$.use(update);
$.debug=false;
let squares = $.make.group();
let ships = $.make.group();

// let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
let img=$.load.image(0,0,"./images/fac0_refinery.png");
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

let yellowShip=$.make.boxCollider(530,160,50,50);
yellowShip.mass = 1;
yellowShip.friction = 1;
yellowShip.bounciness = 10;
//yellowShip.asset=img;
yellowShip.torque = 1;
yellowShip.rotationalVelocity = 10;
squares.push(yellowShip);

let box=$.make.boxCollider(450,300,50,800);
box.mass = 1;
box.static = true;
box.bounciness = 10;
box.friction= 0;
box.rotation = 90;
box.velocity = new Velocity(0, 0);
box.rotationalVelocity = 0;
squares.push(box);

/*
let box2=$.make.circleCollider(550,400,75);
box2.mass = 1;
box2.static = false;
box2.direction=180;
box2.friction = 1;
box2.speed = 0;
box2.bounciness = 10;
box2.rotationalVelocity = 0;
box2.velocity = new Velocity(0, 0);
box2.asset=img;
squares.push(box2);


let rightSquare;
for (let i = 600; i > 100; i -= 100) {
    for (let j = 600; j > 100; j -= 100) {
        rightSquare=$.make.circleCollider(i,j, 50, 50);
        rightSquare.mass = 1;
        rightSquare.friction = 10;
        rightSquare.bounciness = 10;
        //rightSquare.asset=img;
        rightSquare.torque = 1;
        squares.push(rightSquare);
    }
}
*/

function drawTree(quad, counter) {
    let colorArray = ["white", "yellow", "red", "purple", "blue", "green", "orange", "brown", "pink", "grey", "gold", "teal", "bronze", "lime"];
    for (let i = 1; i <= 4; i++) {
        let q = quad.getQuad(i);
        if (q != null) {
            $.shape.colour = "black";
            $.shape.colour = "white"; //colorArray[counter];
            counter += 1;
            if (counter == colorArray.length) {
                counter = 0;
            }
            $.shape.rectangle(q.left + (q.right - q.left)/2, q.top + (q.bottom - q.top)/2, q.size, q.size);
            drawTree(q, counter);
        }
    }
}

function background(colour) {
    $.shape.colour = colour;
    $.shape.rectangle($.width/2,$.height/2,$.width,$.height);
}

function setup(){
    if($.frameCount===0){
        console.log('Start');
    }
}

function update() { 
    setup();
    background("rgba(125, 125, 125)");
    $.shape.colour = "black";
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

    yellowShip.velocity.y += 1;

    squares.collides(squares);

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

    $.shape.movedByCamera = true;

    if ($.keys.down("a")) {
        $.camera.x -= 1;
    }
    if ($.keys.down("d")) {
        $.camera.x += 1;
    }
    if ($.keys.down("w")) {
        $.camera.y -= 1;
    }
    if ($.keys.down("s")) {
        $.camera.y += 1;
    }
    if ($.keys.down("q")) {
        $.camera.rotation -= 1;
    }
    if ($.keys.down("e")) {
        $.camera.rotation += 1;
    }


    // drawTree(squares.QuadTree.getTree(), 0);
    //console.log(squares.QuadTree.getTree());

    $.drawColliders();
}