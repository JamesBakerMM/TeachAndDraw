import { $ } from "../../lib/Pen.js";

$.use(update);

const checkbox = $.makeCheckbox(    
    $.w / 2,
    $.h / 2,
    20
);
checkbox.checked = true;

function update() {
    // console.log(checkbox.value);
    checkbox.draw();
}
