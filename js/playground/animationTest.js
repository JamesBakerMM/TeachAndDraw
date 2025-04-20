import { $ } from "../../lib/TeachAndDraw.js"

$.use(draw);
$.width  = 816;
$.height = 900;

let anims = [];

function preload() {
    const paths = [];

    for (let i=0; i<=9; i++)
    {
        paths.push(`images/explosion/explosion${i}.png`);
    }

    for (let i=0; i<8; i++)
    {
        const A = $.loadAnimation(0, 0, ...paths);
        A.movedByCamera = true;
        A.scale = 200;
        A.looping = true;
        A.duration = (i + 1.0) * 0.5;

        A.x = 128 + i * ($.width/4);
        A.y = 64;

        if (i >= 4)
        {
            A.x -= 4 * ($.width/4);
            A.y += 128+64;
        }

        anims.push(A);
    }

    for (let i=0; i<8; i++)
    {
        const A = $.loadAnimation(0, 0, ...paths);
        A.movedByCamera = true;
        A.scale = 200;
        A.looping = false;
        A.duration = (i + 1.0) * 0.5;

        A.x = 128 + i * ($.width/4);
        A.y = 64 + 2*(128+64) + 64;

        if (i >= 4)
        {
            A.x -= 4 * ($.width/4);
            A.y += 128+64;
        }

        anims.push(A);
    }
    
}

preload();



let collider = $.makeCircleCollider($.width/2, $.height/2, 100, 100);
collider.asset = anims[0];
function draw() {
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
        $.camera2.rotation -= 0.01;
    }
    if ($.keys.down("e")) {
        $.camera2.rotation += 0.01;
    }
    $.text.alignment.y = "top";
    $.text.alignment.x = "left";
    $.text.movedByCamera = true;


    // anims[0].duration -= 0.001;

    for (let i=0; i<16; i++)
    {
        const A = anims[i];
        A.movedByCamera = !(i <= 2);
        A.draw();

        $.text.print(A.x-50, A.y+50, `duration = ${A.duration}`);
        $.text.print(A.x-50, A.y+70, `looping = ${A.looping}`);
        $.text.print(A.x-50, A.y+90, `playing = ${A.playing}`);
    }
    $.drawColliders();

}