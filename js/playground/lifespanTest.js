import { $ } from "../../lib/Pen.js"

$.use(draw);
$.width  = 816;
$.height = 900;

let lifespans = [];

let anims = [];

let checkboxes = [];
let buttons = [];
let sliders = [];

let balls;
let walls;

const COLS = 5;


function createLifespans() {
    for (let i=0; i<COLS; i++) {
        lifespans.push(250 + 100*i);
    }
}

function createAnimations() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion/explosion${i}.png`);
    }

    for (let i=0; i<COLS; i++) {
        const A = $.loadAnimation(0, 0, ...paths);

        A.lifespan = lifespans[i];
        A.scale = 200;
        A.looping = true;
        A.duration = 2.0 + 0.5*i;

        A.x = 100 + 150*i;
        A.y = 50;
    
        anims.push(A);
    }
}

function createCheckboxes() {
    for (let i=0; i<COLS; i++) {
        let cb = $.makeCheckbox(50+150*i, 150, 32);
        cb.lifespan = lifespans[i];
        checkboxes.push(cb);
    }
}

function createButtons() {
    for (let i=0; i<COLS; i++) {
        const B = $.makeButton(50+150*i, 250, 72, 32, String(`Button ${i}`));
        B.lifespan = lifespans[i];
        buttons.push(B);
    }
}

function createSliders() {
    for (let i=0; i<COLS; i++) {
        const S = $.makeSlider(50+150*i, 350, 72);
        S.lifespan = lifespans[i];
        buttons.push(S);
    }
}

function createColliders() {
    balls = $.makeGroup();
    walls = $.makeGroup();

    const bot = $.makeBoxCollider($.width/2, $.height, $.width, 50);
    const left = $.makeBoxCollider(0, $.height/2+250, 50, $.height-250);
    const right = $.makeBoxCollider($.width, $.height/2+250, 50, $.height-250);
    bot.static = true;
    left.static = true;
    right.static = true;
    walls.push(bot, left, right);

    for (let i=0; i<COLS; i++) {
        const B = $.makeCircleCollider(100+150*i, 500, 32);
        B.lifespan = lifespans[i];
        B.velocity.x = 64 * (Math.random() - 0.5);
        B.mass = 64
        B.friction = 0;
        balls.push(B);
    }
}






function drawAnimations() {
    $.text.alignment.x = "left";
    $.text.alignment.y = "top";
    $.text.print(0, 100, "lifespan:");

    // for (const A of anims) {
    for (let i=0; i<anims.length; i++) {
        const A = anims[i];

        if (A.exists === false) {
            delete anims[i];
            anims.splice(i, 1);
            break;
        }

        A.draw();
        $.text.print(A.x, A.y+50, String(`lifespan=${A.lifespan}`));
    }
}

function drawCheckboxes() {
    for (const cb of checkboxes) {
        cb.draw();
        $.text.print(cb.x, cb.y+25, String(`lifespan=${cb.lifespan}`));
    }
}

function drawButtons() {
    for (const B of buttons) {
        B.draw();
        $.text.print(B.x, B.y+25, String(`lifespan=${B.lifespan}`));
    }
}

function drawSliders() {
    for (const S of sliders) {
        S.draw();
        $.text.print(S.x, S.y+25, String(`lifespan=${S.lifespan}`));
    }
}

function drawColliders() {
    balls.collides(balls);
    balls.collides(walls);

    for (const B of balls) {
        if (B) {
            B.velocity.y += 1;
            $.text.print(B.x, B.y, String(`lifespan=${B.lifespan}`));
        }
    }

    $.drawColliders();
}

createLifespans();
createAnimations();
createColliders();
createCheckboxes();
createButtons();
createSliders();

// let collider = $.makeCircleCollider($.width/2, $.height/2, 100, 100);
// collider.asset = anims[0];
function draw() {
    drawAnimations();
    drawColliders();
    drawCheckboxes();
    drawButtons();
    drawSliders();

}