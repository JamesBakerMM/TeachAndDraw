import { $ } from "../../lib/Pen.js";
// $.debug = true;

$.use(update);
$.width  = 512;
$.height = 512;


const textArea = $.makeTextArea(256, 256, 300, 300);
textArea.value = `Write your great message here...`;

function update() {

	textArea.draw();
	textArea.characterLimit = 300;

}
