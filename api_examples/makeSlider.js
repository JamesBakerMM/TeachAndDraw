import { $ } from "../lib/Pen.js";

$.use(update);

let slider = $.makeSlider(
    400, // x position
    300, // y position
    250 // width
);

function update() {
    slider.draw();
}