import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.text.size = 20;

	$.shape.line($.w/2, 0, $.w/2, $.h);

	$.text.alignment.x = "left";
	$.text.print($.w/2, $.h/2-50, "left");
	
	$.text.alignment.x = "center";
	$.text.print($.w/2, $.h/2, "center");
	
	$.text.alignment.x = "right";
	$.text.print($.w/2, $.h/2+50, "right");
}