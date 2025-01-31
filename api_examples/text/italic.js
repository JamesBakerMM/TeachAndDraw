import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.text.italic = false;
	$.text.print($.w/2, $.h/2-20, "Normal text");

	$.text.italic = true;
	$.text.print($.w/2, $.h/2+20, "Italic text");
}