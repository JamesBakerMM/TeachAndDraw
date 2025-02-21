import { $ } from "../../lib/Pen.js";

$.use(update);

let A = $.makeButton(200, 300, 150, 50);
let B = $.makeButton(400, 300, 150, 50);
let C = $.makeButton(600, 300, 150, 50);

function update() {
    A.label = "Lime text";
    B.label = "Purple text";
    C.label = "Cyan text";

    A.textColour = "lime";
    B.textColour = "purple";
    C.textColour = "cyan";

    A.draw();
    B.draw();
    C.draw();
}