import { $ } from "../../lib/Pen.js";

$.use(update);

let checkbox1 = $.makeCheckbox(350, 300, 32);
let checkbox2 = $.makeCheckbox(450, 300, 32);

function update() {
    checkbox1.secondaryColour = "green";
    checkbox2.secondaryColour = "blue";
    checkbox1.draw();
    checkbox2.draw();
}