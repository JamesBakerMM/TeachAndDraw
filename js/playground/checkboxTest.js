import { $ } from "../../lib/Pen.js";

$.use(update);

const checkbox = $.makeCheckbox(    
    $.w / 2,
    $.h / 2,
    30
);
checkbox.name = "2";

function update() {
    console.log(checkbox.value);
    checkbox.draw();
}
