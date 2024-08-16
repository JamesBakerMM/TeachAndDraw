import { $ } from "../../lib/Pen.js";

$.use(update);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    100
);
slider.min = 10;
console.log(slider);

function update() {
    slider.draw();
}
