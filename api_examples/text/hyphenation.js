import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.text.hyphenation = true;
	$.text.print(
		$.w/2 - 100,
		$.h/2,
		"A hyphenated sentence which exceeds the maximum set width of 64 pixels.",
		64
	);

	$.text.hyphenation = false;
	$.text.print(
		$.w/2 + 100,
		$.h/2,
		"A non hyphenated sentence which exceeds the maximum set width of 64 pixels.",
		64
	);
}