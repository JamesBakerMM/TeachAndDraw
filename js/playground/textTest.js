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
	// $.text.print(400, 200, 234);

	$.text.alignment.y = "top";
	$.text.alignment.x = "left";
	$.text.print(100, 50, "Top Left");
	$.text.alignment.x = "center";
	$.text.print(100, 80, "Top Center");
	$.text.alignment.x = "right";
	$.text.print(100, 110, "Top Right");

	$.text.alignment.y = "center";
	$.text.alignment.x = "left";
	$.text.print(100, 160, "Center Left");
	$.text.alignment.x = "center";
	$.text.print(100, 190, "Center Center");
	$.text.alignment.x = "right";
	$.text.print(100, 220, "Center Right");


	$.text.alignment.y = "bottom";
	$.text.alignment.x = "left";
	$.text.print(100, 270, "Bottom Left");
	$.text.alignment.x = "center";
	$.text.print(100, 300, "Bottom Center");
	$.text.alignment.x = "right";
	$.text.print(100, 330, "Bottom Right");
}
