import { $ } from "../../lib/Pen.js";

$.use(update);

const dropdownGroup1 = $.makeGroup();
for (let i = 0; i < 10; i++) {
	const dropdown = $.makeDropdown(200, 500 - 50 * i, 200 + Math.random() * 100, ["option 1. The default option! It's selected by default", "option 2 :) this is also a longer option, causing truncating", "option 3", "Another option", "Wow! Another option. Cool, cool cool. Love that for me", "Wow, a working dropdown", "Very cool", "actually", "it seems perfectly fine! Excellent"]);
	dropdownGroup1.push(dropdown);
}
dropdownGroup1[0].name = "First dropdown";
dropdownGroup1[1].options = [];
dropdownGroup1[2].options = ["New list", "Of options"];
dropdownGroup1[3].index = 4;
dropdownGroup1[4].accentColour = "blue";
dropdownGroup1[4].textColour = "blue";
dropdownGroup1[5].secondaryColour = "red";
dropdownGroup1[6].background = "purple";

const dropdown = $.makeDropdown(550, 50, 300, ["transparent", "red", "blue", "green", "orange", "yellow", "purple", "pink"]);
const dropup = $.makeDropdown(550, 550, 300, ["This is a dropup. The arrow indicates whether it opens upwards or downwards", "option 2 :) this is also a longer option, causing truncating", "option 3", "Another option", "Wow! Another option. Cool, cool cool. Love that for me", "Wow, a working dropdown", "Very cool", "actually", "it seems perfectly fine! Excellent"]);
dropup.openDirection = "up";


function update() {
	$.colour.fill = dropdown.value;
	$.shape.rectangle($.w / 2, $.h / 2, $.w, $.h);

	dropdown.draw();
	dropup.draw();
	dropdownGroup1.draw();

}
