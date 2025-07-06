import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown = $.makeDropdown(400, 300, 250, [
    "Option A",
    "Option B",
    "Option C"
]);


function update() {
    dropdown.draw();

    if (dropdown.isHoverOnBox()) {
        $.text.print(dropdown.x, dropdown.y-25, `Hovering on box!`);
    }
}