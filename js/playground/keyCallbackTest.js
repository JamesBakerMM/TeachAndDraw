import { $ } from "../../lib/Pen.js"
import { Checkbox } from "../../lib/Checkbox.js";
import { Entity } from "../../lib/Entity.js";
import { MovingStamp } from "../../lib/Animation.js";

$.use(draw);
$.width  = 816;
$.height = 900;

const COLS = 5;

/** @type {MovingStamp[]} */
let anims = [];
/** @type {Checkbox[]} */
let checkboxes = [];
let balls;
let walls;

let yoffset = 350;


function createAnimations() {
    const paths = [];
    for (let i=0; i<=9; i++) {
        paths.push(`images/explosion/explosion${i}.png`);
    }
    for (let i=0; i<COLS; i++) {
        const A = $.loadAnimation(50+150*i, yoffset, ...paths);
        A.scale = 200;
        A.looping = true;
        A.duration = 1.0;
        anims.push(A);
    }
    yoffset += 100;
}

function createCheckboxes() {
    for (let i=0; i<COLS; i++) {
        const B = $.makeCheckbox(50+150*i, yoffset, 32);
        B.checked = (i % 2 == 1);
        checkboxes.push(B);
    }
    yoffset += 100;
}

function createColliders() {
    balls = $.makeGroup();
    walls = $.makeGroup();

    const bot = $.makeBoxCollider($.width/2, $.height, $.width, 50);
    const left = $.makeBoxCollider(0, $.height/2+400, 50, $.height-400);
    const right = $.makeBoxCollider($.width, $.height/2+400, 50, $.height-400);
    bot.static = true;
    left.static = true;
    right.static = true;
    walls.push(bot, left, right);

    for (let i=0; i<COLS; i++) {
        const B = $.makeCircleCollider(100+150*i, yoffset, 32);
        B.velocity.x = 64 * (Math.random() - 0.5);
        B.mass = 64
        B.friction = 0;
        balls.push(B);
    }

    yoffset += 100;
}



/**
 * @param {Array<Entity>} arr
 */
function drawLabelled( arr ) {
    for (let i=0; i<arr.length; i++) {
        const A = arr[i];
        if (A.exists === false) {
            delete arr[i];
            arr.splice(i, 1);
            return;
        }

        A.draw();
    }
}

function drawCheckboxes() {
    for (let i=0; i<checkboxes.length; i++) {
        const B = checkboxes[i];
        B.ageless = !B.checked;
    }
    drawLabelled(checkboxes);
}

function drawColliders() {
    balls.collides(balls);
    balls.collides(walls);

    for (let B of balls) {
        B.velocity.y += 1;
    }

    drawLabelled(balls);
    drawLabelled(walls);
}


$.keys.onKeyDown("W", () => { $.camera.y -= 0.25 * $.time.msElapsed; });
$.keys.onKeyDown("S", () => { $.camera.y += 0.25 * $.time.msElapsed; });
$.keys.onKeyDown("A", () => { $.camera.x -= 0.25 * $.time.msElapsed; });
$.keys.onKeyDown("D", () => { $.camera.x += 0.25 * $.time.msElapsed; });

$.keys.onRelease((data) => {
    console.log("Released: ", data);
})


createAnimations();
createCheckboxes();
createColliders();

function draw() {
    $.text.alignment.x = "left";
    $.text.alignment.y = "top";

    drawLabelled(anims);
    drawCheckboxes();
    drawColliders();
}