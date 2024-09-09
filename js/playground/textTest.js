import { $ } from "../../lib/Pen.js";
$.debug = true;

$.use(update);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    350
);
// slider.value = 110;
// slider.max = 100;
slider.min = -10;
slider.value = 50;
slider.max = 100;

const button = $.makeButton(
    $.w/2-200,
    $.h/2,
    100,
    50
)

function update() {
    button.draw();
    slider.draw();
	$.text.print(400, 300, "Testing!");
	$.text.print(400, 350, "Testing with max width!", 100);
	$.text.print(400, 200, 234);
}
