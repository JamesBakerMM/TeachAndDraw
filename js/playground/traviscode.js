
//Library
import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";

//update method
$.use(update);

//debugging
$.debug=true;

//groups
let pegs = $.makeGroup(); //Static circular colliders
let balls = $.makeGroup(); //Kinematic balls
let bars = $.makeGroup(); //Static Box Colliders


let img=$.loadImage(0,0,"./images/fac0_refinery.png");

//border bars_______________
let collideBarShort=$.makeBoxCollider(800, 750, 500, 25);
collideBarShort.static=true;
collideBarShort.fill = "rgb(162,6,6)"
bars.push(collideBarShort)


//balls___________________

//used to limit ball spawning 
let ballSpawned = false;

let ballSize = 10;

let ballSpawnPosition = {x: 800, y: 100};

function createBall(xPos, yPos, size) {
    let ball = $.makeCircleCollider(xPos, yPos, size);
    ball.mass = 1; //high weight

    let randomXVel = $.math.random(-15,15); //Introduce some random spread
    ball.velocity.x += randomXVel;
    ball.direction = 180; 
    ball.bounciness = 100; // low bounciness
    ball.friction = 1;
    ball.fill = "rgb(255,255,255)";
    //ball.collides(pegs);
    balls.push(ball);
}



//pegs______________________

let pegSize = 30;

let pegsGenerated = false;


let pegPositions = [
    //1st row
    {x: 650, y: 200},
    {x: 801, y: 200},
    {x: 950, y: 200},
    //2nd row
    {x: 575, y: 300},
    {x: 725, y: 300},
    {x: 875, y: 300},
    {x: 1025, y: 300},
    //3rd row
    {x: 650, y: 400},
    {x: 800, y: 400},
    {x: 950, y: 400},
    //4th row
    {x: 575, y: 500},
    {x: 725, y: 500},
    {x: 875, y: 500},
    {x: 1025, y: 500},
    //5th row
    {x: 650, y: 600},
    {x: 800, y: 600},
    {x: 950, y: 600},
]

//Generate Singular Peg - Used below
function createPeg(xPos, yPos, size){
    let peg = $.makeCircleCollider(xPos, yPos, size);
    peg.static = true;
    peg.fill = "rgb(77,77,77)";
    peg.friction = -1;
    peg.bounciness = 100;
    pegs.push(peg)
}

//Generate all pegs
function generatePegs(){
    for (let i = 0; i < pegPositions.length; i+= 1) {
        let xPos = pegPositions[i].x;
        let yPos = pegPositions[i].y;

        createPeg(xPos, yPos, pegSize);
    }
    pegs.collides(balls);

}

function setup(){
    
    if($.frameCount===0){
        console.log('Start');
        $.width = 1600;
        $.height = 900;

        //console.log(pegPositions)
        generatePegs();
    }

}

function background(colour){
    $.colour.fill=colour;
    $.shape.rectangle($.width/2,$.height/2,$.width,$.height);
}

function update() { 
    setup();
    background("rgba(137,77,0)");
    $.paused=false;
    
    
    //For testing, one ball per click
    if(mouse.leftDown && ballSpawned === false){
        createBall(ballSpawnPosition.x, ballSpawnPosition.y, ballSize);
        ballSpawned = true;    
    }

    //On mouse release, reset flag
    if(mouse.leftReleased) {
        ballSpawned = false;
    }
    
    

    

    //Spawn Marker
    colour.fill="black"
    shape.oval(
        800,
        100,
        10,
    );
    
    // if(leftSquare.x>$.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>$.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }

    
    
    

    balls.collides(pegs);
    balls.collides(balls);
    
    //ball updates
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        //apply consistent downward velocity to simulate falling
        ball.velocity.y += 0.9;
    
    }

    bars.collides(balls)
        // $.colour.fill = "#00000000";
        // $.colour.stroke = "#FFFF00FF";
        // $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    

    // drawTree(squares.QuadTree.getTree(), 0);
    //console.log(squares.QuadTree.getTree());

    $.drawColliders();

    document.getElementById("fps").innerText = $.time.averageFps;
}