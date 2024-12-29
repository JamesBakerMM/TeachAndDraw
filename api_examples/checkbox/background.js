import { $ } from "../../lib/Pen.js";

$.use(update);

let checkbox1 = $.makeCheckbox(350, 300, 32);
let checkbox2 = $.makeCheckbox(450, 300, 32);

function update() {
    checkbox1.background = "green";
    checkbox2.background = "blue";
    checkbox1.draw();
    checkbox2.draw();
}