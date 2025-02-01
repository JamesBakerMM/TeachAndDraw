import { $ } from "../../lib/TeachAndDraw.js"

$.use(draw);
$.width  = 512;
$.height = 512;

let A, B, C;
let D, E, F;

function preload() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion/explosion${i}.png`);
    }

    // Animations
    {
        A = $.loadAnimation(100, 100, ...paths);
        A.duration = 1.5;
        A.scale = 200;
        A.looping = true;

        B = A.clone();
        B.rotation = 180;

        C = B.clone();

        B.x = 200;
        C.x = 300;
    }


    // Images
    {
        D = $.loadImage(100, 300, "images/explosion/explosion2.png");

        E = D.clone();
        E.rotation = 180;
        E.x = 200;
        E.flip.y = true;

        F = E.clone();
        F.x = 300;
    }
}

preload();


let theta = 0.0;

function draw() {

    A.offset.x = 32;
    A.offset.y = 32;
    A.rotation = theta;
    A.draw();
    B.draw();
    C.draw();

    D.draw();
    E.draw();
    F.draw();

    theta += 1;
}