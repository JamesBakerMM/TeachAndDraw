import { $ } from "../../lib/Pen.js"

$.use(draw);
$.width  = 816;
$.height = 900;

let A, B, C;

function preload() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion/explosion${i}.png`);
    }

    A = $.loadAnimation(100, 100, ...paths);
    A.scale = 200;
    A.looping = true;
    A.rotation = 45;

    B = A.clone($, 200, 100, A.frames);
    C = B.clone($, 300, 100, B.frames);
}

preload();


function draw() {

    A.draw();
    B.draw();
    C.draw();
}