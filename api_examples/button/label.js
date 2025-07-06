import { $ } from "../../lib/Pen.js";

$.use(update);

let A = $.makeButton(200, 300, 150, 50);
let B = $.makeButton(400, 300, 150, 50);
let C = $.makeButton(600, 300, 150, 50);

function update() {
    A.label = "Button A";
    B.label = "Button B";
    C.label = "Button C";
    A.draw();
    B.draw();
    C.draw();
}