import { $ } from "../../lib/Pen.js";

$.use(update);

let slider = $.makeSlider(400, 300, 200);

function update() {
    slider.draw();

    if (slider.isHoverOnHandle()) {
        $.text.print(slider.x, slider.y-50, `Hovering on handle!`);
    }
}