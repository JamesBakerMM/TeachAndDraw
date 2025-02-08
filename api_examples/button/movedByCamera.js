import { $ } from "../../lib/Pen.js";

$.use(update);

let A = $.makeButton(400, 250, 200, 50);
let B = $.makeButton(400, 350, 200, 50);
let xspeed = +1;

function update() {

    A.movedByCamera = true;
    B.movedByCamera = true;
    A.label = "movedByCamera = false";
    B.label = "movedByCamera = true";

    A.draw();
    B.draw();

    if ($.camera.x <= 100) {
        $.camera.x = 100;
        xspeed = -1;
    } else if ($.camera.x >= $.w-100) {
        $.camera.x = $.w-100;
        xspeed = +1;
    }

    $.camera.x += xspeed;
}