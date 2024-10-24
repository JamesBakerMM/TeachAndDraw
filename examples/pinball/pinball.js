import { CollisionUtilities } from "../../lib/CollisionUtilities.js";
import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";

$.use(update);
$.debug=false;

//Make the groups
let walls = $.makeGroup();
let pegs = $.makeGroup();
let pins = $.makeGroup();
let balls = $.makeGroup();

//load all the images
let img_peg=$.loadImage(0,0,"./images/peg.png");
let img_peg2=$.loadImage(0,0,"./images/peg2.png");
let img_pin=$.loadImage(0,0,"./images/pin.png");
let img_pin2=$.loadImage(0,0,"./images/pin2.png");
let img_ball=$.loadImage(0,0,"./images/ball.png");
let img_wall=$.loadImage(0,0,"./images/bucket_wall.png");
let img_wall_side=$.loadImage(0,0,"./images/side_wall.png");
let img_wall_thin=$.loadImage(0,0,"./images/side_wall_thin.png");
let img_floor=$.loadImage(0,0,"./images/bucket_floor.png");
let img_arrows=$.loadImage(0,0,"./images/arrows.png");
let img_flipperL=$.loadImage(0,0,"./images/flipperL.png");
let img_flipperR=$.loadImage(0,0,"./images/flipperR.png");
let img_background=$.loadImage(0,0,"./images/background.png");
let img_sweeper=$.loadImage(0,0,"./images/sweeper.png");

//load the text font
const font = $.loadCustomFont("Comic Mono", "../../fonts/ComicMono.ttf");

//Set up the table
let background=$.makeBoxCollider(250,400,500,800);
background.static = true;
background.asset = img_background;

let arrows=$.makeBoxCollider(460,700,40,220);
arrows.static = true;
arrows.asset = img_arrows;

let left_Wall=$.makeBoxCollider(0,400,40,800);
left_Wall.static = true;
left_Wall.asset = img_wall_side;
walls.push(left_Wall);

let right_Wall=$.makeBoxCollider(500,400,40,800);
right_Wall.static = true;
right_Wall.asset = img_wall_side;
walls.push(right_Wall);

let right_Wall_thin=$.makeBoxCollider(430,600,20,800);
right_Wall_thin.static = true;
right_Wall_thin.asset = img_wall_thin;
walls.push(right_Wall_thin);

let sweeper=$.makeBoxCollider(100,410,150,16);
sweeper.static = true;
sweeper.asset = img_sweeper;
sweeper.friction = 0;
sweeper.rotationalVelocity = -10;
walls.push(sweeper);

let sweeper2=$.makeBoxCollider(340,330,150,16);
sweeper2.static = true;
sweeper2.asset = img_sweeper;
sweeper2.friction = 0;
sweeper2.rotationalVelocity = 10;
walls.push(sweeper2);

let floor=$.makeBoxCollider(300,800,600,40);
floor.static = true;
floor.asset = img_floor;
walls.push(floor);

let ceiling=$.makeBoxCollider(300,0,600,40);
ceiling.static = true;
ceiling.asset = img_floor;
walls.push(ceiling);

let curve1=$.makeBoxCollider(25,110,20,80);
curve1.static = true;
curve1.asset = img_wall;
curve1.asset = img_wall;
curve1.rotation = 22.5;
walls.push(curve1);

let curve2=$.makeBoxCollider(60,60,20,80);
curve2.static = true;
curve2.asset = img_wall;
curve2.rotation = 45;
walls.push(curve2);

let curve3=$.makeBoxCollider(110,25,20,80);
curve3.static = true;
curve3.asset = img_wall;
curve3.rotation = 67.5;
walls.push(curve3);

let curve4=$.makeBoxCollider(475,110,20,80);
curve4.static = true;
curve4.asset = img_wall;
curve4.asset = img_wall;
curve4.rotation = -22.5;
walls.push(curve4);

let curve5=$.makeBoxCollider(440,60,20,80);
curve5.static = true;
curve5.asset = img_wall;
curve5.rotation = -45;
walls.push(curve5);

let curve6=$.makeBoxCollider(390,25,20,80);
curve6.static = true;
curve6.asset = img_wall;
curve6.rotation = -67.5;
walls.push(curve6);

let slideR=$.makeBoxCollider(405,650,20,80);
slideR.static = true;
slideR.asset = img_wall;
slideR.rotation = 40;
walls.push(slideR);

let slideR2=$.makeBoxCollider(350,550,20,80);
slideR2.static = true;
slideR2.asset = img_wall;
slideR2.rotation = 0;
walls.push(slideR2);

let peg1=$.makeCircleCollider(350,500,30,30);
peg1.static = true;
peg1.asset = img_peg;
pegs.push(peg1);

let peg7=$.makeCircleCollider(350,600,30,30);
peg7.static = true;
peg7.asset = img_peg;
pegs.push(peg7);

let slideL=$.makeBoxCollider(35,650,20,80);
slideL.static = true;
slideL.asset = img_wall;
slideL.rotation = -40;
walls.push(slideL);

let slideL2=$.makeBoxCollider(90,550,20,80);
slideL2.static = true;
slideL2.asset = img_wall;
slideL2.rotation = 0;
walls.push(slideL2);

let peg2=$.makeCircleCollider(90,500,30,30);
peg2.static = true;
peg2.asset = img_peg;
pegs.push(peg2);

let peg8=$.makeCircleCollider(90,600,30,30);
peg8.static = true;
peg8.asset = img_peg;
pegs.push(peg8);

let peg3=$.makeCircleCollider(125,50,30,30);
peg3.static = true;
peg3.asset = img_peg;
pegs.push(peg3);

let peg4=$.makeCircleCollider(75,80,30,30);
peg4.static = true;
peg4.asset = img_peg;
pegs.push(peg4);

let peg5=$.makeCircleCollider(45,130,30,30);
peg5.static = true;
peg5.asset = img_peg;
pegs.push(peg5);

let peg6=$.makeCircleCollider(430,190,20,20);
peg6.static = true;
peg6.asset = img_peg;
pegs.push(peg6);

let pin1=$.makeCircleCollider(225,100,50,50);
pin1.static = true;
pin1.asset = img_pin;
pins.push(pin1);

let pin2=$.makeCircleCollider(125,200,50,50);
pin2.static = true;
pin2.asset = img_pin;
pins.push(pin2);

let pin3=$.makeCircleCollider(325,200,50,50);
pin3.static = true;
pin3.asset = img_pin;
pins.push(pin3);

let pin4=$.makeCircleCollider(125,300,50,50);
pin4.static = true;
pin4.asset = img_pin;
pins.push(pin4);

let flipper_left=$.makeBoxCollider(50,680,280,30);
flipper_left.static = true;
flipper_left.rotation = 20;
flipper_left.friction = 0;
flipper_left.asset = img_flipperL;

let flipper_right=$.makeBoxCollider(390,680,280,30);
flipper_right.static = true;
flipper_right.rotation = -20;
flipper_right.friction = 0;
flipper_right.asset = img_flipperR;

//Setup the ball
let ball=$.makeCircleCollider(450,700,40,40);
ball.asset = img_ball;
balls.push(ball);

//Control variables
const maxBallSpeed = 200;
const flipperSpeed = 60;

let score = 0;
let showScore = false;

let moveFlipperUp = false;

let respawning = 0;
let respawnTime = 60;

function update() {
    //Set screen size
    $.w=500;
    $.h=800;

    //do background colour
    $.colour.fill="rgba(245,245,255)";
    $.shape.rectangle($.width/2,$.height/2,$.width,$.height);

    //limit ball max speed so it doesn't glitch out
    let speed = CollisionUtilities.distance(ball.velocity.x, ball.velocity.y);
    if (speed >= maxBallSpeed) {
        let ballVector = CollisionUtilities.normalize(ball.velocity.x, ball.velocity.y);
        ball.velocity.x = ballVector.x * maxBallSpeed;
        ball.velocity.y = ballVector.y * maxBallSpeed;
    }

    //handle respawning if lost
    if (respawning > 0) {
        respawning -= 1;
        if (respawning == 0) {
            score = 0;
            ball.x = 450;
            ball.y = 700;
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        } else {
            ball.x = -100;
            ball.y = -100;
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        }
    } else {
        if (ball.x <= 0 || ball.x >= 500) {
            respawning = respawnTime;
        }
        if (ball.y <= 0 || ball.y >= 800) {
            respawning = respawnTime;
        }
    }

    //launch ball if over arrows in start
    if (ball.overlaps(arrows)) {
        if(keys.down(" ")){
            showScore = true;
            ball.velocity.y -= 20;
        }
    } else {
        //kill if ball touches bottom floor
        if (ball.collides(floor)) {
            respawning = respawnTime;
        }

        //launch ball upwards if it touches a flipper
        let result1 = ball.collides(flipper_left);
        let result2 = ball.collides(flipper_right);
        if(keys.down(" ") && (result1 || result2)){
            ball.velocity.y = Math.abs(ball.velocity.y) * -1.3;
        }
    }
    
    //show instructions or score
    if (showScore) {
        $.colour.fill = "black";
        $.text.size = 64;
        $.text.font = font;
        $.text.print(220, 760, score.toString());
    } else {
        $.colour.fill = "black";
        $.text.size = 30;  
        $.text.font = font;
        $.text.print(225, 760, "Press Space To Start!");
    }
 
    //move flipper upwards if space was pressed, limit to 45 degrees
    if (moveFlipperUp) {
        let angle = flipper_right.rotation;
        if (angle > 180) {
            angle -= 360;
        }
        if (angle > 45) {
            flipper_right.rotation = 45;
            flipper_left.rotation = -45;
            flipper_left.rotationalVelocity = flipperSpeed;
            flipper_right.rotationalVelocity = -flipperSpeed;
            moveFlipperUp = false;
        }
    }
    //move flipper back down if its reached the top
    if (!moveFlipperUp) {
        let angle = flipper_right.rotation;
        if (angle > 180) {
            angle -= 360;
        }
        if (angle < -20) {
            flipper_right.rotation = -20;
            flipper_left.rotation = 20;
            flipper_left.rotationalVelocity = 0;
            flipper_right.rotationalVelocity = 0;
        }
    }

    //trigger flippers moving upwards if space is pressed
    if(keys.down(" ") && !moveFlipperUp){
        flipper_left.rotationalVelocity = -flipperSpeed;
        flipper_right.rotationalVelocity = flipperSpeed;
        moveFlipperUp = true;
    }
    
    //Collide with the walls
    balls.collides(walls);

    //Countdown to reset peg image after it has been hit
    for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        if (peg.life != null) {
            peg.life -= 1;
            if (peg.life == 0) {
                peg.life = null;
                pegs[i].asset = img_peg;
            }
        }
    }
    //Countdown to reset pin image after it has been hit
    for (let i = 0; i < pins.length; i++) {
        const pin = pins[i];
        if (pin.life != null) {
            pin.life -= 1;
            if (pin.life == 0) {
                pin.life = null;
                pins[i].asset = img_pin;
            }
        }
    }

    //Add gravity to ball
    ball.velocity.y += 1;

    //detect if peg hit, add score, start img change
    for (let j = 0; j < pegs.length; j++) {
        if (ball.collides(pegs[j])) {
            pegs[j].asset = img_peg2;
            pegs[j].life = 10;
            score += 10;
        }
    }
    //detect if pin hit, add score, start img change
    for (let j = 0; j < pins.length; j++) {
        if (ball.collides(pins[j])) {
            pins[j].asset = img_pin2;
            pins[j].life = 10;
            score += 25;
        }
    }

    $.drawColliders();
}