import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.text.bold = false;
	$.text.print($.w/2, $.h/2-20, "Normal text");

	$.text.bold = true;
	$.text.print($.w/2, $.h/2+20, "Bold text");
}