import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown1 = $.makeDropdown(250, 300, 200, [
    "Option A",
    "Option B",
    "Option C"
]);

let dropdown2 = $.makeDropdown( 550, 300, 200, [
    "Option X",
    "Option Y",
    "Option Z"
]);

function update() {
    dropdown1.border = "orange";
    dropdown2.border = "rgb(75, 15, 255)";
    dropdown1.draw();
    dropdown2.draw();
}