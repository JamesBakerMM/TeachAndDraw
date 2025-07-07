import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";
import { Vector } from "../../lib/Vector.js";
import { Velocity } from "../../lib/Velocity.js";

$.use(update);


const BALL_DEFAULT_RADIUS = 25;


let ballObj = $.makeCircleCollider(100, 100, 25);
    ballObj.mass = 1;
    ballObj.friction = 0;
let aiming = false;

let ballState = ballStateReset;


function ballStateDeath() {
    if (ballObj.radius == BALL_DEFAULT_RADIUS) {
        ballObj.velocity.x = -ballObj.velocity.x + $.math.random(-4, +4);
        ballObj.velocity.y = -ballObj.velocity.y + $.math.random(-4, +4);
        ballObj.static = true;
    }
    ballObj.mass *= 0.75;

    if (ballObj.mass <= 0.1) {
        ballState = ballStateReset;
    }
}

function ballStateReset() {
    ballObj.x = 200;
    ballObj.y = $.h/2;
    ballObj.velocity.x = 0;
    ballObj.velocity.y = 0;
    ballObj.static = true;
    ballObj.radius = BALL_DEFAULT_RADIUS;
    ballObj.mass = 1;
    $.camera.x = ballObj.x;
    $.camera.y = ballObj.y;
    ballState = ballStateIdle;
}

function ballStateIdle() {
    if ($.touch.down) {
        ballState = ballStateAiming;
    }
 
}

function ballStateAiming() {

    if ($.touch.released) {
        ballObj.static = false;
        ballObj.velocity.x = ($.touch.startX - $.touch.endX);
        ballObj.velocity.y = ($.touch.startY - $.touch.endY);
        ballState = ballStateFlying;
    }

    $.shape.border = Paint.palegreen;
    $.shape.strokeWidth = 2;

    const dx = $.touch.startX - $.touch.endX;
    const dy = $.touch.startY - $.touch.endY;

    if (Math.abs(dx) > 64 || Math.abs(dy) > 64) {
        $.shape.border = Paint.green;
        $.shape.strokeWidth = 5;
        aiming = true;
    }
    $.shape.line(
        ballObj.x, ballObj.y,
        ballObj.x+dx, ballObj.y+dy,
    );
}

function ballStateFlying() {

    for (let B of planetGroup) {
        const dir  = Vector.temp(B.x-ballObj.x, B.y-ballObj.y);
        const dist = dir.distance();
        const F = (B.mass * ballObj.mass) / (dist*dist);

        dir.normalize();
        ballObj.velocity.x += F * dir.x;
        ballObj.velocity.y += F * dir.y;
    
        if (B.collides(ballObj)) {
            ballState = ballStateDeath;
        }
    }
}




function update() {

    $.camera.moveTo(ballObj.x, ballObj.y, 0.01);
    ballState();

    ballObj.collides(planetGroup);
    ballObj.draw();
    planetGroup.draw();
}


const planetGroup = $.makeGroup();




function createPlanet(x, y, r)
{
    const B = $.makeCircleCollider(x, y, r);
    B.mass = Math.PI * r*r;
    console.log(B.mass)
    planetGroup.push(B);
}

createPlanet(10,  250, 50);
createPlanet(600, 250, 50);
createPlanet(500, 500, 100);


