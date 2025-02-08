import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown = $.makeDropdown(400, 300, 250, [
    "Option A",
    "Option B",
    "Option C",
    "Option X",
    "Option Y",
    "Option Z",
    "Option Q",
    "Option R",
    "Option S"
]);


function update() {
    dropdown.draw();
    $.text.print(dropdown.x, dropdown.y-25, `Index: ${dropdown.index}`);
}