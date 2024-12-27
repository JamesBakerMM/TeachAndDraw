import { $ } from "../../lib/Pen.js";

$.use(update);

let slider1 = $.makeSlider(250, 300, 200);
let slider2 = $.makeSlider(550, 300, 200);

slider1.step = 20;
slider2.step = 20;

slider1.showMarks = true;
slider2.showMarks = false;

function update() {

    slider1.draw();
    slider2.draw();

    $.text.print(slider1.x, slider1.y-50, `showMarks=true`);
    $.text.print(slider2.x, slider2.y-50, `showMarks=false`);
}