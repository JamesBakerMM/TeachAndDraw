import { $ } from "../../lib/Pen.js";
// $.debug = true;

$.use(update);
$.width  = 512;
$.height = 512;


const textArea = $.makeTextArea(256, 256, 300, 300);
textArea.value = `Write your great message here...`;

function update() {
	$.text.alignment.x = "left";
	$.text.alignment.y = "top";

	$.text.print(0, 0, "TextArea now supports:");
	$.text.print(0, 20,  "- ctl + A");
	$.text.print(0, 40,  "- ctl + C");
	$.text.print(0, 60,  "- ctl + X");
	$.text.print(0, 80,  "- ctl + V");
	$.text.print(0, 100, "- ctl + backspace");
	$.text.print(0, 120, "- ctl + left/right");

	$.text.print(175, 20, "- shift + left/right");
	$.text.print(175, 40, "- shift + home/end");

	$.text.print(350, 20,  "- home/end");


	textArea.draw();
	textArea.characterLimit = 300;

}
