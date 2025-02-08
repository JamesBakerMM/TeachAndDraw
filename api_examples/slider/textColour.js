import { $ } from "../../lib/Pen.js";

$.use(update);

let slider1 = $.makeSlider(250, 300, 200);
let slider2 = $.makeSlider(550, 300, 200);

function update() {
    slider1.textColour = "green";
    slider2.textColour = "blue";
    slider1.draw();
    slider2.draw();
}