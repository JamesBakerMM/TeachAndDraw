import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 16;
	$.text.print(100, $.h/2, "size = 16");

	$.text.size = 24;
	$.text.print(300, $.h/2, "size = 24");

	$.text.size = 32;
	$.text.print(500, $.h/2, "size = 32");

	$.text.size = 42;
	$.text.print(700, $.h/2, "size = 42");
}