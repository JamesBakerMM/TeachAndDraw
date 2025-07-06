import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	const duration = $.keys.durationDown(" ");
	$.shape.rectangle($.w/2, $.h/2, 25+duration, 25+duration);
	$.colour.fill = "black";
	$.text.print($.w/2, $.h/2, String(duration));
};