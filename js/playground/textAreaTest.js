import { $ } from "../../lib/Pen.js";
// $.debug = true;

$.use(update);


const textArea = $.makeTextArea(400, 200, 300, 150);
textArea.value = `Write your great message here...`;

function update() {

	textArea.draw();
	textArea.characterLimit = 300;

	$.keys.activeBuffer._forEach((event) => {
		console.log(event);
	});

}
