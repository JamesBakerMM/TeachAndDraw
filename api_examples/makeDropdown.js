import { $ } from "../lib/Pen.js";

$.use(update);

let dropdown = $.makeDropdown(
    400, // x position
    300, // y position
    250, // width
    ["Option A", "Option B", "Option C"] // options
);

function update() {
    dropdown.draw();
}