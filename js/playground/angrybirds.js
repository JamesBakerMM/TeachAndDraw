import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);


let birdObj = $.makeCircleCollider(100, 100, 25);
let aiming = false;


function update()
{
    if (aiming && $.touch.released)
    {
        birdObj.velocity.x = $.touch.startX - $.touch.endX;
        birdObj.velocity.y = $.touch.startY - $.touch.endY;
    }

    if ($.touch.down && Math.abs($.touch.startX - $.touch.endX) > 64) {
        aiming = true;

        $.shape.border = Paint.palegreen;
        $.shape.strokeWidth = 5;
        $.shape.line($.touch.startX, $.touch.startY, $.touch.endX, $.touch.endY);
    } else {
        aiming = false;
    }

    birdObj.draw();
}

