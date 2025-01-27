import { $ } from "../../lib/TeachAndDraw.js"
import { Button } from "../../lib/Button.js";
import { Checkbox } from "../../lib/Checkbox.js";
import { Slider } from "../../lib/Slider.js";
import { Dropdown } from "../../lib/Dropdown.js";
import { Entity } from "../../lib/Entity.js";
import { MovingStamp } from "../../lib/Animation.js";

$.use(draw);
$.width  = 816;
$.height = 900;

const COLS = 5;
let lifespans = [];

/** @type {MovingStamp[]} */ let anims = [];
/** @type {Checkbox[]}    */ let checkboxes = [];
/** @type {Button[]}      */ let buttons = [];
/** @type {Slider[]}      */ let sliders = [];
/** @type {Dropdown[]}    */ let dropdowns = [];

let balls;
let walls;

let yoffset = 50;



function createLifespans() {
    for (let i=0; i<COLS-1; i++) {
        lifespans.push(5 + 5*i);
    }

    lifespans.push(null);
}

function createAnimations() {
    const paths = [];
    for (let i=0; i<=9; i++) {
        paths.push(`images/explosion/explosion${i}.png`);
    }
    for (let i=0; i<COLS; i++) {
        const A = $.loadAnimation(50+150*i, yoffset, ...paths);
        A.lifespan = lifespans[i];
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
        B.lifespan = lifespans[i];
        B.checked = (i % 2 == 1);
        checkboxes.push(B);
    }
    yoffset += 100;
}

function createButtons() {
    for (let i=0; i<COLS; i++) {
        const B = $.makeButton(50+150*i, yoffset, 72, 32, String(`Button ${i}`));
        B.lifespan = lifespans[i];
        buttons.push(B);
    }
    yoffset += 100;
}

function createSliders() {
    for (let i=0; i<COLS; i++) {
        const S = $.makeSlider(50+150*i, yoffset, 72);
        S.lifespan = lifespans[i];
        buttons.push(S);
    }
    yoffset += 100;
}

function createDropdowns() {
    const A = $.makeDropdown(75+0*150, yoffset, 128, [
        "Option A", "Option B", "Option C", "Option D"
    ]);

    const B = $.makeDropdown(75+1*150, yoffset, 128, [
        "Option X", "Option Y", "Option Z", "Option W"
    ]);

    const C = $.makeDropdown(75+2*150, yoffset, 128, [
        "Option 1", "Option 2", "Option 3", "Option 4"
    ]);

    A.lifespan = 2;
    B.lifespan = 4;
    C.lifespan = 16;

    A.openDirection = "down";
    B.openDirection = "down";
    C.openDirection = "up";

    dropdowns.push(A, B, C);

    yoffset += 300;
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
        B.lifespan = lifespans[i];
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
        let text = "";

        if (A.lifespan) {
            text = `lifespan=${A.lifespan.toFixed(1)}`;
            text += "s";
        }

        A.draw();
        $.text.print(A.x, A.y+25, text);
    }
}

function drawButtons() {
    for (const B of buttons) {
        if (B.lifespan) {
            B.label = String(B.lifespan.toFixed(1)) + "s";
        }

        if (B.released) {
            B.lifespan += 5;
        }
    }
    drawLabelled(buttons);
}


function drawColliders() {
    balls.collides(balls);
    balls.collides(walls);

    for (let B of balls) {
        B.velocity.y += 1;
    }

    $.drawColliders();
    drawLabelled(balls);
}


createLifespans();
createAnimations();
createCheckboxes();
createButtons();
createSliders();
createDropdowns();
createColliders();


function draw() {
    $.text.alignment.x = "left";
    $.text.alignment.y = "top";

    drawLabelled(anims);
    drawLabelled(checkboxes);
    drawButtons();
    drawLabelled(sliders);
    drawLabelled(dropdowns);
    drawColliders();
}