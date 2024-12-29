import { $ } from "../../lib/Pen.js";

$.use(update);

let x = 400;
let y = 300;

function update() {
	$.text.alignment.x = "center";
	$.text.alignment.y = "center";
	$.text.size = 20

	if ($.mouse.leftDown) {
		x = $.mouse.x;
		y = $.mouse.y;
	}

	$.text.print(x, y, "Hold left mouse");
};