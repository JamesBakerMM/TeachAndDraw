import { $ } from "../../lib/Pen.js";

$.use(update);

let A = $.makeButton(200, 300, 150, 50, "Click me!");
let B = $.makeButton(400, 300, 150, 50, "Click me!");
let C = $.makeButton(600, 300, 150, 50, "Click me!");

function update() {
    A.border = "lime";
    B.border = "purple";
    C.border = "rgb(100, 250, 250)";
    A.draw();
    B.draw();
    C.draw();
}