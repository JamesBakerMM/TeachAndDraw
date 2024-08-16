import { $ } from "../../lib/Pen.js";

$.use(update);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    50
);
slider.max = 10;
console.log(slider);

function update() {
    slider.draw();
}
