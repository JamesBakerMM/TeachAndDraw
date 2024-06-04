import { $ } from "../../lib/Pen.js";

$.use(draw);

$.width = 400;
$.height = 400;
$.debug = true;

const topLeft = $.makeBoxCollider(100, 100, 20, 20);
const topRight = $.makeBoxCollider($.width - 100, 100, 20, 20);
const bottomLeft = $.makeBoxCollider(100, $.height - 100, 40, 40);
const bottomRight = $.makeBoxCollider($.width - 100, $.height - 100, 20, 20);
const topCenter = $.makeBoxCollider($.width / 2, $.height / 2 - 50, 20, 20);

topCenter.movedByCamera = false;

const circles = $.makeGroup(
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    topCenter
);

for(let circle of circles){
    circle.velocity.x=2
    // circle.friction=0
}

function draw() {
    if ($.keys.down("a")) {
        $.camera.x -= 1;
    }
    if ($.keys.down("d")) {
        $.camera.x += 1;
    }
    if ($.keys.down("w")) {
        $.camera.y -= 1;
    }
    if ($.keys.down("s")) {
        $.camera.y += 1;
    }
    circles.draw();
    for (let circle of circles) {
        if (circle.movedByCamera) {
            $.text.print(circle.x, circle.y-20, `🎥 ${parseInt(circle.x)},${parseInt(circle.y)}`);
        } else {
            $.text.print(circle.x, circle.y-20, `${parseInt(circle.x)},${parseInt(circle.y)}`);
        }
    }
}
