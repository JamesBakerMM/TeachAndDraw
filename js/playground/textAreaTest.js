import { $ } from "../../lib/TeachAndDraw.js";
$.debug = true;

$.h = 512;
$.w = 512;
$.use(update);


const textArea = $.makeTextArea(256, 256, 300, 300);
textArea.value = `Write your great message here...`;
// textArea.movedByCamera = false;

function update() {
	$.text.alignment.x = "left";
	$.text.alignment.y = "top";

	$.text.print(0, 0, "TextArea now supports:");
	$.text.print(0, 20,  "- ctl + A");
	$.text.print(0, 40,  "- ctl + C");
	$.text.print(0, 60,  "- ctl + X");
	$.text.print(0, 80,  "- ctl + V");
	$.text.print(0, 100, "- ctl + Z");
	$.text.print(0, 120, "- ctl + shift + Z");
	$.text.print(0, 140, "- ctl + backspace");
	$.text.print(0, 160, "- ctl + left/right");

	$.text.print(175, 20, "- shift + left/right");
	$.text.print(175, 40, "- shift + home/end");

	$.text.print(350, 20,  "- home/end");
	$.text.print(350, 40,  String(`w, h = ${$.w}, ${$.h}`));

	textArea.draw();
	textArea.characterLimit = 300;

}
