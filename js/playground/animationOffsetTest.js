import { $ } from "../../lib/TeachAndDraw.js"

$.use(draw);
$.width  = 512;
$.height = 512;

let anim, img;

function preload() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion/explosion${i}.png`);
    }

    anim = $.loadAnimation(256-128, 256, ...paths);
    anim.duration = 0.75;
    anim.offset.x = 32;
    anim.offset.y = 32;
    anim.scale    = 200;

    img = $.loadImage(256+128, 256, "images/explosion/explosion2.png");
    img.offset.x = 32;
    img.offset.y = 32;
    img.scale    = 200;
}

preload();


let theta = 0.0;

function draw() {

    anim.rotation = theta;
    anim.draw();

    img.rotation = theta;
    img.draw();

    theta += 1;
}