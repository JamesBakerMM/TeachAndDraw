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
