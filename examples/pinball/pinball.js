import { CollisionUtilities } from "../../lib/CollisionUtilities.js";
import { $, shape, colour, mouse, keys, text } from "../../lib/TeachAndDraw.js";

$.use(update);
$.debug=false;

//Make the groups
const walls = $.makeGroup();
const pegs = $.makeGroup();
const pins = $.makeGroup();
const balls = $.makeGroup();

//load all the images
const img_peg=$.loadImage(0,0,"./images/peg.png");
const img_peg2=$.loadImage(0,0,"./images/peg2.png");
const img_pin=$.loadImage(0,0,"./images/pin.png");
const img_pin2=$.loadImage(0,0,"./images/pin2.png");
const img_ball=$.loadImage(0,0,"./images/ball.png");
const img_wall=$.loadImage(0,0,"./images/bucket_wall.png");
const img_wall_side=$.loadImage(0,0,"./images/side_wall.png");
const img_wall_thin=$.loadImage(0,0,"./images/side_wall_thin.png");
const img_floor=$.loadImage(0,0,"./images/bucket_floor.png");
const img_arrows=$.loadImage(0,0,"./images/arrows.png");
const img_flipperL=$.loadImage(0,0,"./images/flipperL.png");
const img_flipperR=$.loadImage(0,0,"./images/flipperR.png");
const img_background=$.loadImage(0,0,"./images/background.png");
const img_sweeper=$.loadImage(0,0,"./images/sweeper.png");

//load the text font
const font = $.loadCustomFont("Comic Mono", "../../fonts/ComicMono.ttf");

let arrows= makeStaticAssetBox(460,700,40,220,img_arrows);

//walls

//left wall
walls.push(makeStaticAssetBox(0,400,40,800,img_wall_side));
//right wall
walls.push(makeStaticAssetBox(500,400,40,800,img_wall_side));
//right wall thing
walls.push(makeStaticAssetBox(430,600,20,800,img_wall_thin));

walls.push(makeSweeper(100,410,-10));
walls.push(makeSweeper(340,330,10));

let floor=makeStaticAssetBox(300,800,600,40,img_floor);
walls.push(floor);

//ceiling
walls.push(makeStaticAssetBox(300,0,600,40,img_floor));

//curved box at top
walls.push(makeCurveBox(25,110,22.5))
walls.push(makeCurveBox(60,60,45))
walls.push(makeCurveBox(110,25,67.5))
walls.push(makeCurveBox(475,110,-22.5))
walls.push(makeCurveBox(440,60,-45))
walls.push(makeCurveBox(390,25,-67.5))

//right slides
walls.push(makeSlide(405,650,40));
walls.push(makeSlide(350,550,0));

//left slides
walls.push(makeSlide(35,650,-40));
walls.push(makeSlide(90,550,0));

//make pegs
pegs.push(makePeg(350,500));
pegs.push(makePeg(350,600));
pegs.push(makePeg(90,500));
pegs.push(makePeg(90,600))
pegs.push(makePeg(125,50));
pegs.push(makePeg(75,80));
pegs.push(makePeg(45,130));
pegs.push(makePeg(430,190));

//make pins
pins.push(makePin(225,100));
pins.push(makePin(125,200));
pins.push(makePin(325,200));
pins.push(makePin(125,300));

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
const maxBallSpeed = 150;
const flipperSpeed = 60;

let score = 0;
let showScore = false;

let moveFlipperUp = false;

let respawning = 0;
let respawnTime = 60;
function update() {
    img_background.draw();
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
        if (respawning === 0) {
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
        const hitLeft = ball.collides(flipper_left);
        const hitRight = ball.collides(flipper_right);
        if(keys.down(" ") && (hitLeft || hitRight)){
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

function makeStaticAssetBox(x,y,w,h,asset){
    const temp = $.makeBoxCollider(x,y,w,h);
    temp.static = true;
    temp.asset = asset;
    return temp;
}

function makePeg(x,y){
    const temp = $.makeCircleCollider(x,y,30,30);
    temp.static = true;
    temp.asset = img_peg;
    return temp;
}

function makePin(x,y){
    const temp = $.makeCircleCollider(x,y,50,50);
    temp.static = true;
    temp.asset = img_pin;
    return temp;
}

function makeCurveBox(x,y,rotation){
    const temp = $.makeBoxCollider(x,y,20,80)
    temp.rotation = rotation
    temp.static = true;
    temp.asset = img_wall
    return temp
}

function makeSweeper(x,y,rotationalVelocity){
    const temp = $.makeBoxCollider(x,y,150,16);
    temp.asset = img_sweeper;
    temp.static = true;
    temp.friction = 0;
    temp.rotationalVelocity = rotationalVelocity;
    return temp
}

function makeSlide(x,y,rotation){
    const temp = $.makeBoxCollider(x,y,20,80);
    temp.static = true;
    temp.asset = img_wall;
    temp.rotation = rotation;
    return temp;
}