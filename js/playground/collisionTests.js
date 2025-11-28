import {
    tad,
    make,
    time,
    load,
    shape,
    mouse,
    keys,
    text,
} from "../../lib/TeachAndDraw.js";
import { Paint } from "../../lib/Paint.js";
import { Velocity } from "../../lib/Velocity.js";

tad.use(update);
tad.debug = true;
let squares = make.group();
let ships = make.group();

// let leftSquare=make.BoxCollider(tad.w/2-300,tad.h/2-20,80,80);
let img = tad.load.image(0, 0, "./images/fac0_refinery.png");
/*
let redShip=make.BoxCollider(tad.w/2+200,tad.h/2,80,80);
redShip.speed=10;
redShip..image=img;
redShip.mass = 1;
redShip.direction=270;
redShip.friction=0.5;
redShip.rotationalVelocity = 0;
squares.push(redShip);
*/

let yellowShip = make.circleCollider(170, 200, 100, 100);
//yellowShip..image=img;
yellowShip.mass = 1;
yellowShip.static = true;
yellowShip.direction = 180;
yellowShip.friction = 0.5;
yellowShip.speed = 0;
yellowShip.bounciness = 100;
yellowShip.rotation = 0;
yellowShip.velocity = new Velocity(0, 10);
squares.push(yellowShip);

let box = make.boxCollider(200, 400, 100, 50);
box.speed = 0;
box.direction = 90;
box.static = false;
box.bounciness = 50;
box.friction = 50;
box.rotation = 0;
box.mass = 1;
box.rotation = 20;
box.rotationalVelocity = 10;
box.velocity = new Velocity(0, 1);
squares.push(box);

/*
let box2=make.BoxCollider(200,400,400,50);
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
        rightSquare = make.circleCollider(i, j, 10, 5);
        rightSquare.mass = 1;
        rightSquare.friction = 50;
        rightSquare.bounciness = 50;
        //rightSquare..image=img;
        squares.push(rightSquare);
    }
}

function drawTree(quad, counter) {
    let colorArray = [
        "white",
        "yellow",
        "red",
        "purple",
        "blue",
        "green",
        "orange",
        "brown",
        "pink",
        "grey",
        "gold",
        "teal",
        "bronze",
        "lime",
    ];
    for (let i = 1; i <= 4; i++) {
        let q = quad.getQuad(i);
        if (q != null) {
            tad.shape.colour = "black";
            tad.shape.colour = "white"; //colorArray[counter];
            counter += 1;
            if (counter == colorArray.length) {
                counter = 0;
            }
            tad.shape.rectangle(
                q.left + (q.right - q.left) / 2,
                q.top + (q.bottom - q.top) / 2,
                q.size,
                q.size
            );
            drawTree(q, counter);
        }
    }
}

function background(colour) {
    tad.shape.colour = colour;
    tad.shape.rectangle(tad.width / 2, tad.height / 2, tad.width, tad.height);
}

function setup() {
    if (tad.frameCount === 0) {
        console.log("Start");
    }
}

let flag = 1;

function update() {
    setup();
    background("rgba(125, 125, 125)");
    tad.shape.colour = "black";
    //tad.text.print(tad.w/2,tad.h/2,`x:${tad.mouse.x} y:${tad.mouse.y}`);

    text.colour = "white";
    text.alignment.x = "left";
    text.print(20, 20, time.averageFps.toString());
    if (mouse.leftDown) {
        yellowShip.x = mouse.x;
        yellowShip.y = mouse.y;
    }

    //yellowShip.rotation=yellowShip.direction;
    if (keys.down("uparrow")) {
        yellowShip.velocity.y -= 1;
    }
    if (keys.down("downarrow")) {
        yellowShip.velocity.y += 1;
    }
    if (keys.down("leftarrow")) {
        yellowShip.velocity.x -= 1;
    }
    if (keys.down("rightarrow")) {
        yellowShip.velocity.x += 1;
    }

    // if(leftSquare.x>tad.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>tad.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }
    squares.collides(squares);

    //yellowShip.velocity.y += 1;

    for (let i = 0; i < squares.length; i++) {
        const sq = squares[i];
        if (sq.shape == "circle") {
            //sq.velocity.y += 1;
        }

        if (sq.x > tad.width) {
            sq.x = tad.width - 1;
            sq.velocity.x = -sq.velocity.x;
        }
        if (sq.x < 0) {
            sq.x = 0;
            sq.velocity.x = -sq.velocity.x;
        }
        if (sq.y > tad.height) {
            sq.y = tad.height - 1;
            sq.velocity.y = -sq.velocity.y;
        }
        if (sq.y < 0) {
            sq.y = 0;
            sq.velocity.y = -sq.velocity.y;
        }

        // tad.colour.fill = "#00000000";
        // tad.colour.stroke = "#FFFF00FF";
        // tad.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }

    tad.shape.movedByCamera = true;

    if (tad.keys.down("a")) {
        tad.camera.x -= 1;
    }
    if (tad.keys.down("d")) {
        tad.camera.x += 1;
    }
    if (tad.keys.down("w")) {
        tad.camera.y -= 1;
    }
    if (tad.keys.down("s")) {
        tad.camera.y += 1;
    }
    if (tad.keys.down("q")) {
        tad.camera.rotation -= 1;
    }
    if (tad.keys.down("e")) {
        tad.camera.rotation += 1;
    }

    // drawTree(squares.QuadTree.getTree(), 0);
    //console.log(squares.QuadTree.getTree());

    box.draw();
    tad.drawColliders();
}