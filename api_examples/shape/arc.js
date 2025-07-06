import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.shape.arc(
		$.w/2,	// x position
		$.h/2,	// y position
		100,	// width
		100,	// height
		45,		// start angle
		270		// end angle
	);
}