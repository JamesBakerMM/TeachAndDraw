import { $ } from "../../lib/Pen.js";

$.use(update);

let img = $.loadImage(400, 300, "images/sample.png");

function update() {
    img.draw();
    img.rotation += 1;
}