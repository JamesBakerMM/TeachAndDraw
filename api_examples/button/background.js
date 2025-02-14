import { $ } from "../../lib/Pen.js";

$.use(update);

let A = $.makeButton(200, 300, 150, 50, "Button A");
let B = $.makeButton(400, 300, 150, 50, "Button B");
let C = $.makeButton(600, 300, 150, 50, "Button C");

function update() {
    A.background = "lime";
    B.background = "purple";
    C.background = "rgb(100, 250, 250)";
    A.draw();
    B.draw();
    C.draw();
}