import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.shape.line(0, $.h/2, $.w, $.h/2);

    $.text.alignment.y = "top";
	$.text.print($.w/2-100, $.h/2, "top");

    $.text.alignment.y = "center";
	$.text.print($.w/2, $.h/2, "center");

    $.text.alignment.y = "bottom";
	$.text.print($.w/2+100, $.h/2, "bottom");
}