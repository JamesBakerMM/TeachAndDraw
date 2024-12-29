import { $ } from "../../lib/Pen.js";

$.use(update);

let checkbox = $.makeCheckbox(400, 300, 32);

function update() {
    checkbox.draw();

    if (checkbox.isHovering()) {
        $.text.print(checkbox.x, checkbox.y-50, `Hovering on checkbox!`);
    }
}