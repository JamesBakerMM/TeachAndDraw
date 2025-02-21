import { $ } from "../../lib/Pen.js";

$.use(update);

let button = $.makeButton(400, 300, 150, 50, "Up!");

function update() {
    button.draw();

    if (button.down) {
        button.label = "Down!";
    } else {
        button.label = "Up!";
    }
}