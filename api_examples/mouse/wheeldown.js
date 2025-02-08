import { $ } from "../../lib/Pen.js";

$.use(update);

let x = 400;
let y = 300;

function update() {
	$.text.size = 20

	if ($.mouse.wheel.down) {
        y += 5;
	} else {
        const dy = $.h/2 - y;
        y += 0.01 * dy;
    }

	$.text.print(x, y, "Try scrolling down!");
};