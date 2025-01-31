import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.shape.multiline(
		20,      // first x position
		$.h/2,   // first y position
		$.w/4,   // second x position
		$.h/2,   // second y position
		$.w/2,   // third x position
		$.h/4,   // third y position
		$.w-20,  // fourth x position
		$.h/4,   // fourth y position
	);
}