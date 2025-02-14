import { $ } from "../../lib/Pen.js";

$.use(update);

let slider1 = $.makeSlider(250, 300, 200);
let slider2 = $.makeSlider(550, 300, 200);

function update() {
    $.shape.rectangle(slider1.x, slider1.y, slider1.value+10, slider1.value+10);
    $.shape.rectangle(slider2.x, slider2.y, slider2.value+10, slider2.value+10);

    slider1.draw();
    slider2.draw();
}