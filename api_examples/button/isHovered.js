import { $ } from "../../lib/Pen.js";

$.use(update);

let button = $.makeButton(400, 300, 150, 50, "Not hovered!");
let timer = 0;

function update() {
    button.draw();

    if (button.isHovered()) {
        button.label = "Hovered!";
    } else {
        button.label = "Not hovered!";
    }
}