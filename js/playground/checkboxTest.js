import { $ } from "../../lib/Pen.js";

$.use(update);
$.gui.accentColour = "red";
const checkbox = $.makeCheckbox(    
    $.w / 2,
    $.h / 2,
    15
);
// checkbox.checked = "true";

function update() {
    checkbox.draw();
    $.makeCh
}
