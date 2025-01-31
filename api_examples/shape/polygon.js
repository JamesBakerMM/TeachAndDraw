import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.shape.polygon(
		$.w/2 - 100,	// first x position
		$.h/2,			// first y position
		$.w/2,			// second x position
		$.h/2 - 100,	// second y position
		$.w/2 + 100,	// third x position
		$.h/2, 			// third y position
	)
}