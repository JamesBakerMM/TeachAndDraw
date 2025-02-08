import { $ } from "../../lib/Pen.js";

$.use(update);
let value = 50;

function update() {

	$.text.print(
		$.w/2, 	  			  // x position
		$.h/2-40, 			  // x position
		"An ordinary string." // string to print
	);

	$.text.print(
		$.w/2,
		$.h/2,
		"A string with \"quotes\"."
	);

	$.text.print(
		$.w/2,
		$.h/2+40,
		String(value) // Must convert non-strings to strings!
	);
}