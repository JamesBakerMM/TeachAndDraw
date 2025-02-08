import { $ } from "../lib/Pen.js";

$.use(update);

let json = $.loadJsonFile("data/jason.json");

function update() {
	const text = JSON.stringify(json);
	$.text.print($.w/2, $.h/2, text);
}