import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
	$.shape.strokeWidth = 8;

	$.colour.stroke = "green";
	$.shape.oval(100, $.h/2, 50, 50);
     
	$.colour.stroke = "yellow";
	$.shape.oval(300, $.h/2, 50, 50);

	$.colour.stroke = "rgb(255, 0, 0)";
	$.shape.oval(500, $.h/2, 50, 50);

	$.colour.stroke = "rgb(255, 100, 255)";
	$.shape.oval(700, $.h/2, 50, 50);
};