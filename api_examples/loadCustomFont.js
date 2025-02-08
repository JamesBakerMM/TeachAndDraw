import { $ } from "../lib/Pen.js";

$.use(update);

$.loadCustomFont(
    "ComicMono", // font name
    "fonts/ComicMono.ttf" // path to file
);

function update() {
	$.text.size = 20;
	$.text.font = "ComicMono";
	$.text.print($.w/2, $.h/2, "Comic Mono custom font.");
}