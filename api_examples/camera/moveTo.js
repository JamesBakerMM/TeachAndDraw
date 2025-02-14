import { $ } from "../../lib/Pen.js";

$.use(update);

function update() {
    $.shape.movedByCamera = true;
    $.shape.rectangle(0, 0, 200, 100);

    $.camera.moveTo(410, 300);

}