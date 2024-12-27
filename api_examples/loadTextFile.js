import { $ } from "../lib/Pen.js";

$.use(update);

let data = $.loadTextFile("data/hello.txt");

function update() {
	$.text.alignment.x = "left";

	for (let i=0; i<data.length; i++) {
		$.text.print($.w/2-50, 200+25*i, `Line ${i+1}: "${data[i]}"`);
	}
}