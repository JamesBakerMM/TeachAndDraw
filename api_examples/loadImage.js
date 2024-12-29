import { $ } from "../lib/Pen.js";

$.use(update);

let img = $.loadImage(
	400, 				// x position
	300, 				// y position
	"images/sample.png" // path to image
);

function update() {
    img.draw();
}