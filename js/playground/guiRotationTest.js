import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);

const btn = $.makeButton(250, 150, 300, 50, "rotating");
const slider = $.makeSlider($.w-250, 150, 200);
const checkbox = $.makeCheckbox($.w/2, $.h/2, 100, 100);
checkbox.checked = true;

const dropdown = $.makeDropdown(250, $.h-150, 200, ["transparent", "red", "blue", "green", "orange", "yellow", "purple", "pink"]);
const dropup = $.makeDropdown($.w-250, $.h-150, 200, ["This is a dropup. The arrow indicates whether it opens upwards or downwards", "option 2 :) this is also a longer option, causing truncating", "option 3", "Another option", "Wow! Another option. Cool, cool cool. Love that for me", "Wow, a working dropdown", "Very cool", "actually", "it seems perfectly fine! Excellent"]);
dropup.openDirection = "up";

const textArea = $.makeTextArea(256, 256, 300, 300);
textArea.value = "Some text goes here";


function update() {
    updateInput();

    $.shape.movedByCamera = true;

    $.shape.strokeWidth = 2;
    $.shape.border = Paint.white;
    $.shape.colour = Paint.white;

    for (let i=0; i<=$.w; i+=50) {
        $.shape.line(i, 0, i, $.h);
    }

    for (let i=0; i<=$.h; i+=50) {
        $.shape.line(0, i, $.w, i);
    }


    if (btn.hovered) {
        btn.label = "hovered";
    } else {
        btn.label = "not hovered";
    }
    
    if (checkbox.checked) {
        btn.rotation  += 0.001;
        slider.rotation += 0.002;
        checkbox.rotation += 0.00212;
        dropdown.rotation += 0.003;
        dropup.rotation += 0.0015;
        textArea.rotation += 0.001;
    }

    btn.draw();
    slider.draw();
    checkbox.draw();
    dropdown.draw();
	dropup.draw();
	textArea.draw();

}

function updateInput() {
    if ($.keys.down("leftArrow")) {
        $.camera.x -= 1;
    }
    if ($.keys.down("rightArrow")) {
        $.camera.x += 1;
    }
    if ($.keys.down("upArrow")) {
        $.camera.y -= 1;
    }
    if ($.keys.down("downArrow")) {
        $.camera.y += 1;
    }

	if ($.keys.down("q")) {
        $.camera.rotation -= 0.01;
    }
    if ($.keys.down("e")) {
        $.camera.rotation += 0.01;
    }

	if ($.keys.down("i")) {
        $.camera.zoom *= 1.01;
    }
    if ($.keys.down("k")) {
        $.camera.zoom *= 0.99;
    }
}


