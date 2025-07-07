import { Collider } from "../../lib/Collider.js";
import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";
import { Vector } from "../../lib/Vector.js";


function mix( x, y, a ) {
    return (1-a)*x + a*y;
}

const state = {
    targetX:    $.w/2,
    targetY:    $.h/2,
    targetRot:  0,
    targetZoom: 0.5,

    statefn: gameEntry,
    transition: (fn) => {
        state.statefn = fn;
    },

    update: () => {
        $.shape.movedByCamera = true;
        $.text.movedByCamera = true;
        $.camera.zoomTo(state.targetZoom);
        $.camera.rotateTo(state.targetRot, 0.05);
        $.camera.moveTo(state.targetX, state.targetY, 0.01);
        state.statefn();
    }
};

$.use(state.update);


let player = $.makeBoxCollider($.w/2, $.h/2, 25, 25);
let playerFront = new Vector(1, 0);
const playerMaxSpeed = 32;

let asteroidGroup = $.makeGroup();
let projectileGroup = $.makeGroup();
let gameOverMsg  = "";



// Menu
// --------------------------------------------------------------------
const startButton = $.makeButton($.w/2, $.h/2, 125, 35, "Play");
startButton.rotation = 90;

function gameEntry() {
    state.targetRot  = 90;
    state.targetZoom = 1;
    $.camera.moveTo(state.targetX, state.targetY, 1.0);
    $.camera.rotation = state.targetRot;
    $.camera.zoom = state.targetZoom;

    player.mass = 8;
    player.friction = 0.25;

    state.transition(menuLoop);
}

function menuLoop() {
    state.targetY    = $.h/2;
    state.targetRot  = mix(state.targetRot, 90, 0.06);
    // state.targetZoom = mix(state.targetZoom, 2, 0.06);

    $.text.rotation = 90;

    $.text.colour = Paint.white;
    $.text.print($.w/2+75, $.h/2, "ASTEROID");

    if (gameOverMsg != "") {
        startButton.label = "Play Again";
        // $.text.colour = ball.colour;
        // $.text.print($.w/2+50, $.h/2, gameOverMsg);
    }

    startButton.draw()
    if (startButton.down) {
        state.transition(gameInit);
    }

    player.draw();
    asteroidGroup.draw();
    projectileGroup.draw();
}
// --------------------------------------------------------------------


// Game
// --------------------------------------------------------------------

function gameInit() {
    player.x = $.w/2;
    player.y = $.h/2;
    player.velocity.x = 0;
    player.velocity.y = 0;

    for (let i=0; i<16; i++) {
        asteroidGroup.push(makeAsteroid());
    }

    state.transition(gameLoop);
}

function gameLoop() {
    state.targetX    = mix(state.targetX, player.x, 0.05);
    state.targetY    = mix(state.targetY, player.y, 0.05);
    // state.targetRot  = mix(state.targetRot, 0.025*(leftPlayer.y-rightPlayer.y), 0.1);
    // state.targetZoom = mix(state.targetZoom, 1.0, 0.1);
    state.targetZoom = mix(1, 0.5, player.speed / playerMaxSpeed);

    updateInput();

    for (let A of asteroidGroup) {
        if (player.collides(A)) {
            gameOver();
        }

        for (let P of projectileGroup) {
            if (P.collides(A)) {
                fractureAsteroid(A);
                P.exists = false;
            }
        }
    }

    player.draw();
    $.shape.oval(player.x+15*playerFront.x, player.y+15*playerFront.y, 10, 10);
    asteroidGroup.draw();
    projectileGroup.draw();
}



function gameOver() {
    player.velocity.x = 0;
    player.velocity.y = 0;
    state.transition(menuLoop);
}


function makeAsteroid( x = $.math.random(0, $.w),
                       y = $.math.random(0, $.h),
                       mass = $.math.random(256, 16*1024) )
{
    const A = $.makeCircleCollider(x, y, Math.sqrt(mass / Math.PI));

    A.velocity.x = $.math.random(-8, +8);
    A.velocity.y = $.math.random(-8, +8);
    A.friction   = 0;
    A.mass       = mass;
    

    return A;
}

/**
 * 
 * @param {Collider} A 
 */
function fractureAsteroid(A) {
    if (A.mass <= 2048) {
        A.exists = false;
    } else {
        const A0 = makeAsteroid(A.x-8, A.y-8, A.mass/2);
        const A1 = makeAsteroid(A.x+8, A.y+8, A.mass/2);
    
        A0.velocity.x = A.velocity.x + $.math.random(-4, +4);
        A0.velocity.y = A.velocity.y + $.math.random(-4, +4);

        A1.velocity.x = A.velocity.x + $.math.random(-4, +4);
        A1.velocity.y = A.velocity.y + $.math.random(-4, +4);

        asteroidGroup.push(A0, A1);

        A.exists = false;
    }

}
// --------------------------------------------------------------------



function updateInput() {

    const mov_speed = 0.02 * $.time.msElapsed;
    const rot_speed = 0.005 * $.time.msElapsed;
    const prj_speed = 16;

    // for (let i=0; i<$.w; i+=50) {
    //     $.shape.line(i, 0, i, $.h-1);
    // }

    if ($.mouse.wheel.up) {
        state.targetZoom *= 1.01;
    } else if ($.mouse.wheel.down) {
        state.targetZoom *= 0.99;
    }

    if ($.keys.down("w") || $.keys.down("upArrow")) {
        player.velocity.x += mov_speed * playerFront.x;
        player.velocity.y += mov_speed * playerFront.y;
        $.shape.colour = Paint.yellow;
        $.shape.oval(player.x-15*playerFront.x, player.y-15*playerFront.y, 10, 10);
    }
    if ($.keys.down("a") || $.keys.down("leftArrow")) {
        playerFront.rotate(-rot_speed);
        playerFront.normalize();
    }
    if ($.keys.down("d") || $.keys.down("rightArrow")) {
        playerFront.rotate(+rot_speed);
        playerFront.normalize();
    }

    if ($.keys.released(" ")) {
        state.targetX -= 100 * playerFront.x;
        state.targetY -= 100 * playerFront.y;
        createProjectile(player.x, player.y, prj_speed*playerFront.x, prj_speed*playerFront.y);
    }
}

function createProjectile(x, y, vx, vy) {
    const P = $.makeCircleCollider(x, y, 10, 10);

    P.velocity.x = vx;
    P.velocity.y = vy;
    P.mass       = 1;
    P.friction   = 0;

    projectileGroup.push(P);
}
