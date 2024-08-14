import { $ } from "../../lib/Pen.js";

$.use(update);

const checkbox = $.makeCheckbox(    
    $.w / 2,
    $.h / 2,
    20
);
checkbox.value = 9;

function update() {
    checkbox.draw();
}
