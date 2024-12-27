import { $ } from "../../lib/Pen.js";

$.use(update);

let slider1 = $.makeSlider(250, 300, 200);
let slider2 = $.makeSlider(550, 300, 200);


slider1.min = -50;
slider1.max = 0;

slider2.min = 25;
slider2.max = 75;


function update() {
    slider1.draw();
    slider2.draw();

    $.text.print(slider1.x, slider1.y-50, `min=${slider1.min}, max=${slider1.max}`);
    $.text.print(slider2.x, slider2.y-50, `min=${slider2.min}, max=${slider2.max}`);
}