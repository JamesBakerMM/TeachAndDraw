import { $ } from "../../lib/Pen.js";

$.use(update);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    50
);

function update() {
    slider.draw();
}
