import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown = $.makeDropdown(400, 300, 250, [
    "Option A",
    "Option B",
    "Option C"
]);


function update() {
    dropdown.open = true;
    dropdown.draw();

    if (dropdown.isHoverOnOptions()) {
        $.text.print(dropdown.x, dropdown.y-25, `Hovering on options!`);
    }
}