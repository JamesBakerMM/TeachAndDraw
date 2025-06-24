import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";
import { Velocity } from "../../lib/Velocity.js";

$.use(update);


const floorObj = $.makeBoxCollider($.w/2, $.h-32, $.w, 32);
      floorObj.static = true;
    //   floorObj.mass = 100;

const colliderGroup = $.makeGroup(
    floorObj
);
const boxGroup = $.makeGroup();

let birdObj = $.makeCircleCollider(100, 100, 25);
    birdObj.mass = 150;
let aiming = false;

function reset() {
    // birdObj.x = 200;
    // birdObj.y = $.h/2;
    // birdObj.static = true;
}

reset();


function createTower(x, y, w, h) {
    while (w>=32 && h>=32) {
        const B = $.makeBoxCollider(x, y, w, 32);
        B.mass = 2
        // B.bounciness = 50;
        // B.friction = 20;
        boxGroup.push(B);
        y -= 45;
        w *= 0.85;
        h -= 32;
    }
}

createTower($.w/2, $.h-64, 128, 512);


function update()
{
    if (aiming && $.touch.released) {
        birdObj.static = false;
        birdObj.velocity.x = 0.25 * ($.touch.startX - $.touch.endX);
        birdObj.velocity.y = 0.25 * ($.touch.startY - $.touch.endY);
    }
    aiming = false;

    if ($.touch.down) {
        reset();

        $.shape.border = Paint.palegreen;
        $.shape.strokeWidth = 2;
    
        const dx = $.touch.startX - $.touch.endX;
        const dy = $.touch.startY - $.touch.endY;

        if (Math.abs(dx) > 64 || Math.abs(dy) > 64) {
            $.shape.border = Paint.green;
            $.shape.strokeWidth = 5;
            aiming = true;
        }
        $.shape.line(
            birdObj.x, birdObj.y,
            birdObj.x+dx, birdObj.y+dy,
        );
    }


    birdObj.draw();

    for (let B of boxGroup) {
        B.velocity.y += 0.1;
    }
    boxGroup.collides(boxGroup);
    boxGroup.collides(colliderGroup);
    boxGroup.collides(birdObj);
    boxGroup.draw();

    colliderGroup.collides(birdObj);
    colliderGroup.draw();

    birdObj.velocity.y += 1;
}

