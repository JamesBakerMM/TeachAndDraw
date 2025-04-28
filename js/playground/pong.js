import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);

const playerWidth = 10;

let ball = $.makeCircleCollider($.w/2, $.h/2, 10);
    ball.friction = 0;
    ball.velocity.x = -15;
    ball.velocity.y = -5;

let leftPlayer = $.makeBoxCollider(25, 255, playerWidth, 100);
let leftLose = $.makeBoxCollider(0, $.h/2, 15, $.h)
    leftLose.static = true;

let rightPlayer = $.makeBoxCollider($.w-1-25, 255, playerWidth, 100);
let rightLose = $.makeBoxCollider($.w-1, $.h/2, 15, $.h)
    rightLose.static = true;

let collisionsGroup = $.makeGroup(
    leftPlayer,
    rightPlayer,
    $.makeBoxCollider($.w/2, 0, $.w, 15),
    $.makeBoxCollider($.w/2, $.h-1, $.w, 15),
);

for (let element of collisionsGroup) {
    element.static = true;
}



function update() {
    updateInput();
    cameraTracking();

    ball.collides(collisionsGroup);
    leftPlayer.collides(collisionsGroup)

    // Collisions
    // ------------------------------------------
    if (ball.collides(leftLose)) {
        console.log("rip");
    } else if (ball.collides(rightLose)) {
        console.log("rop");
    }
    // ------------------------------------------


    $.drawColliders();
}


function updateInput() {

    const speed = 0.25 * $.time.msElapsed;

    if ($.keys.down('w') && leftPlayer.y > leftPlayer.h/2) {
        leftPlayer.y -= speed;
    }
    if ($.keys.down('s') && leftPlayer.y < $.h-leftPlayer.h/2) {
        leftPlayer.y += speed;
    }

    // if ($.keys.down("upArrow") && rightPlayer.y > rightPlayer.h/2) {
    //     rightPlayer.y -= speed;
    // }
    // if ($.keys.down("downArrow") && rightPlayer.y < $.h-rightPlayer.h/2) {
    //     rightPlayer.y += speed;
    // }


    if ($.keys.down("leftArrow")) {
        $.camera2.x -= 1;
    }
    if ($.keys.down("rightArrow")) {
        $.camera2.x += 1;
    }
    if ($.keys.down("upArrow")) {
        $.camera2.y -= 1;
    }
    if ($.keys.down("downArrow")) {
        $.camera2.y += 1;
    }

	if ($.keys.down("q")) {
        $.camera2.rotation -= 0.0025;
    }
    if ($.keys.down("e")) {
        $.camera2.rotation += 0.0025;
    }

	if ($.keys.down("i")) {
        $.camera2.zoom += 0.01;
    }
    if ($.keys.down("k")) {
        $.camera2.zoom -= 0.01;
    }

}


let xoffset = 0;

function cameraTracking() {
    $.shape.movedByCamera = true;

    // const cam = $.camera;
    // cam.xOffset += 1.01;
    // $.camera2.x += 0.005 * (ball.x - $.camera2.x);
    // cam.x += 55;
    // cam.moveTo(ball.x, ball.y);
    // console.log(cam.x);
    
}