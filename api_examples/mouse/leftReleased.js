import { $ } from "../../lib/Pen.js";

$.use(update);

let x = 400;
let y = 300;
let color1 = "rgb(0, 0, 0)";
let color2 = "rgb(255, 255, 255)";

function update() {
	$.text.alignment.x = "center";
	$.text.alignment.y = "center";
	$.text.size = 20
    $.text.bold = true;

	if ($.mouse.leftReleased) {
        const R = $.math.random(0, 255);
        const G = $.math.random(0, 255);
        const B = $.math.random(0, 255);
        color1 = `rgb(${R}, ${G}, ${B})`;
        color2 = `rgb(${255-R}, ${255-G}, ${255-B})`;
	}
    
    $.colour.fill = color1;
    $.shape.rectangle(x, y, 150, 50);
    
    $.colour.fill = color2;
	$.text.print(x, y, "Left click me!");
};