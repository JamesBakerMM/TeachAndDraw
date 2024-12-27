import { $ } from "../../lib/Pen.js";

$.use(update);

let button = $.makeButton(400, 300, 150, 50, "Click me!");
let timer = 0;

function update() {
    button.draw();

    if (button.up) {
        timer = 60;
    } else if (timer > 0) {
        timer -= 1;
    }

    if (timer > 0) {
        button.label = "Clicked!";
    } else {
        button.label = "Click me!";
    }
}