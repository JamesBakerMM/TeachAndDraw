import { $ } from "../../lib/Pen.js";

$.use(update);

const ball = $.loadImage(200,200,"../examples/pachinko/images/ball.png");

function update() {
    ball.draw();
}