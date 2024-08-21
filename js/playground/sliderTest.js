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

// test widths, test steps
// test marks
// test settings min/max/value incorrectly
// test steps correct/incorrect
// test the different numbers in the popup
// test turning all parts on/off