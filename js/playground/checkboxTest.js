import { $ } from "../../lib/Pen.js";

$.use(update);

const checkbox = $.makeCheckbox(    
    $.w / 2,
    $.h / 2,
    30
);
checkbox.value = 9;

function update() {
    console.log(checkbox.value);
    checkbox.draw();
}
