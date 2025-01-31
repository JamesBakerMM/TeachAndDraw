import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.text.font = "Arial";
	$.text.print(100, $.h/2, "Arial");

	$.text.font = "Verdana";
	$.text.print(300, $.h/2, "Verdana");

	$.text.font = "Tahoma";
	$.text.print(500, $.h/2, "Tahoma");

	$.text.font = "Tebuchet MS";
	$.text.print(700, $.h/2, "Tebuchet MS");

	$.text.font = "Times New Roman";
	$.text.print(100, $.h/2 + 40, "Times New Roman");

	$.text.font = "Georgia";
	$.text.print(300, $.h/2 + 40, "Georgia");

	$.text.font = "Garamond";
	$.text.print(500, $.h/2 + 40, "Garamond");

	$.text.font = "Courier New";
	$.text.print(700, $.h/2 + 40, "Courier New");

	$.text.font = "Bush Script MT";
	$.text.print(100, $.h/2 + 80, "Bush Script MT");
}