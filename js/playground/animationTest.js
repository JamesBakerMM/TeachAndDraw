import { $ } from "../../lib/Pen.js"

$.w = 1024;
$.h = 1024;
$.use(draw);

let anim;

function preload() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion01/explosion01-${i}.png`);
    }

    anim = $.loadAnimation(256, 256, ...paths);
}


preload();


function draw() {

    anim.x = $.mouse.x;
    anim.y = $.mouse.y;

    anim.draw();
}