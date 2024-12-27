import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown1 = $.makeDropdown(
    300, // x position
    300, // y position
    150, // width
    ["Option A", "Option B", "Option C"] // options
);

let dropdown2 = $.makeDropdown(500, 300, 150, []); // zero options is allowed.

// setting options later also allowed.
dropdown2.options = [
    "Option Q",
    "Option R",
    "Option S"
];


function update() {
    dropdown1.draw();
    dropdown2.draw();
}