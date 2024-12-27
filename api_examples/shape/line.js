import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.shape.line(
	    40,      // x position
		$.h/2,   // y position
		$.w-40,  // width 
		$.h/2    // height 
	);     
};